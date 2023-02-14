const User = require('../models/user');
const bcrypt = require('bcrypt');

function isStringInvalid(string) {
    if(string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

exports.signUp = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        //const { name, email, password } = req.body;

        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({err: "Something is missing!"});
        }

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            console.log(err);
            const data = await User.create({
                name: name,
                email: email,
                password: hash
            });
            //User.create({ name, email, password });
            res.status(201).json({ message: 'Successfully Signed Up' });
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({err: "User already exist!"});
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({err: "Email or Password is missing!"});
        }

        const user = await User.findAll({ where: { email }});
        if(user.length > 0) {
            // if(user[0].password === password) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    throw new Error('Something went wrong!');
                } else if (result === true) {
                    res.status(200).json({ success: true, message: 'Logged in Successfully!' });
                } else {
                    return res.status(401).json({ success: false, message: 'Password is incorrect!' });
                }
            });
        } else {
            return res.status(404).json({success: false, message: 'User not found!'});
        } 
    } catch(err) {
        console.log(err);
        res.status(500).json({message: err, success: false});
    }
};