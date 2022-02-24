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

//da ripartire da qui
exports.deleteUser = (req, res, next) => {
    const adminId = req.userId;
    const userId = req.params.postId;
    User.findById(adminId)
      .then(user => {
        if(!user){
            const error = new Error('Could not find user athenticated.');
            error.status = 404;
            throw error;
        }
        if(user.permissions.findIndex(val => {val === 'delete'}) === -1){
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        return User.findById(userId);
      })
      .then(user => {
        if(!user){
          const error = new Error('Could not find user to delete.');
          error.status = 404;
          throw error;
        }
        return User.findByIdAndRemove(user._id);
      })
      .then(result => {
        //inserimento token in blacklist
        res.status(200).json({message:'User deleted.'});
      })
      .catch(err => {
        if(!err.statusCode){
          err.statusCode = 500;
        }
        next(err);
      });
  }