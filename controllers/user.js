const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function isStringInvalid(string) {
    if (string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

exports.signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ err: "Something is missing!" });
        }

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            try {
                const userData = new User({
                    name: name,
                    email: email,
                    password: hash
                });
                await userData.save();
                res.status(201).json({ message: 'Successfully Signed Up' });
            } catch(err) {
                console.log(err);
                return res.status(403).json({ err: "User already exist!" });
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const generateAccessToken = (id, ispremiumuser) => {
    return jwt.sign({ userId : id, ispremiumuser }, process.env.TOKEN_SECRET_KEY );
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ err: "Email or Password is missing!" });
        }

        const user = await User.findOne({ email });

        if (user) {
            // if(user[0].password === password) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    throw new Error('Something went wrong!');
                } else if (result === true) {
                    res.status(200).json({ success: true, message: 'Logged in Successfully!', token: generateAccessToken(user._id, user.ispremiumuser) });
                } else {
                    return res.status(401).json({ success: false, message: 'Password is incorrect!' });
                }
            });
        } else {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err, success: false });
    }
};