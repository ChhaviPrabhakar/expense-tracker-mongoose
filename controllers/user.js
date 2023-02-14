const User = require('../models/user');

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

        const data = await User.create({
            name: name,
            email: email,
            password: password
        });
        //User.create({ name, email, password });
        res.status(201).json({message: 'Successfully Signed Up'});
    } catch(err) {
        console.log(err);
        res.status(500).json({err: "User already exist!"});
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findAll({ where: { email }});
        if(user.length > 0) {
            if(user[0].password === password) {
                res.status(200).json({success: true, message: 'Logged in Successfully!'});
            } else {
                res.status(401).json({success: false, message: 'Password is incorrect!'});
            }
        } else {
            res.status(404).json({success: false, message: 'User not found!'});
        } 
    } catch(err) {
        console.log(err);
        res.status(500).json({message: err, success: false});
    }
};