const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    const user = jwt.verify(token, 'secretkey');
    User.findByPk(user.userId).then(user => {

        req.user = user; 
        next();
    }).catch(err => console.log(err));
} 