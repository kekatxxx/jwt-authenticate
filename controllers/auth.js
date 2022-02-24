const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const constants = require('../utils/constants');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if(!errors.isEmpty()){
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const hashedPsw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      password: hashedPsw
    });
    const result = await user.save();
    res.status(201).json({message:'User created.', userId: result._id});
  } catch (err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({email:email});
    if (!user){
      const error = new Error('User not exists');
      error.statusCode = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if(!isEqual){
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }
    //authenticated: generate JWT and refreshToken to return in the JSON
    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user, req.ip);
    await refreshToken.save();

    res.status(200).json({
      jwtToken: jwtToken, 
      refreshToken: refreshToken,
      userId: user._id.toString()
    });
  } catch (err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.refreshToken = async (req, res, next) => {
  const token = req.body.token;
  const ipAddress = req.ip;
  try {
    const refreshToken = await getRefreshToken(token);
    const { user } = refreshToken;
    
    //generate a new refreshToken and replace to the old one
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    //generate new jwt
    const jwtToken = generateJwtToken(user);

    res.status(201).json({
      jwtToken: jwtToken, 
      refreshToken: newRefreshToken.token, 
      userId: user._id.toString()
    });
  } catch (err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.revokeToken = async (req, res, next) => {
    const token = req.body.token;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try{
      const refreshToken = await getRefreshToken(token);
      refreshToken.revoked = Date.now();
      refreshToken.revokedByIp = ipAddress;
      await refreshToken.save();
      res.status(200).json({ message: 'Token revoked' });
    }catch (err) {
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    }
}

async function getRefreshToken(token) {
  const refreshToken = await RefreshToken.findOne({ token: token }).populate('user');
  if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
  return refreshToken;
}

function generateJwtToken(user){
  return jwt.sign(
      { 
        sub: "treedomtest-jwb", 
        email: user.email,
        userId: user._id.toString()
      }, 
      constants.JWT_SECRET, 
      { expiresIn: '15m' }
    );
}

function generateRefreshToken(user, ipAddress) {
  return new RefreshToken({
      user: user._id,
      token: randomTokenString(),
      expires: new Date(Date.now() + 7*24*60*60*1000),
      createdByIp: ipAddress
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}