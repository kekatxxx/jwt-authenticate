const User = require('../models/user');

exports.getName = (req, res, next) => {
    const userId = req.user.userId;
    User.findById(userId)
        .then(user => {
            if(!user){
                const error = new Error('Could not find user.');
                error.status = 404;
                throw error;
            }
            res.status(200).json({
                name: user.name,
                role: user.role
            });
        })
        .catch(err => {
            err.statusCode = 500;
        });
};

exports.updateName = (req, res, next) => {
  const userId = req.user.userId;
  const name = req.body.name;
  User.findById(userId)
      .then(user => {
          if(!user){
              const error = new Error('Could not find user.');
              error.status = 404;
              throw error;
          }
          user.name = name;
          return user.save();
      })
      .then(result => {
          res.status(200).json({message:'Name updated.'});
      })
      .catch(err => {
          err.statusCode = 500;
      });
};