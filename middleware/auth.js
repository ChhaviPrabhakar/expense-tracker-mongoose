const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const user = await User.findById(decodeToken.userId);
        if (!user) {
            return res.status(401).json({ success: false });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
}