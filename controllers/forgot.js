const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const ForgotPswd = require('../models/forgot');
const uuid = require('uuid');

exports.forgotPswd = async (req, res, next) => {
    try {
        const email = req.body.email;
        const id = uuid.v4();
        await req.user.createForgotPswd({ id, isActive: true });

        const client = Sib.ApiClient.instance

        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.SIB_API_KEY

        const sender = {
            email: 'steve@gmail.com'
            // name: 'Steve Rodgers',
        }

        const recievers = [
            {
                email: email
            }
        ]

        const transactionalEmailApi = new Sib.TransactionalEmailsApi()

        transactionalEmailApi
            .sendTransacEmail({
                subject: 'Reset your password',
                sender,
                to: recievers,
                textContent: `Reset your password from this link :- http://localhost:3000/password/resetpasssword/:id`
                //         htmlContent: `
                // 	<h1>Become a {{params.role}} developer</h1>
                // 	<a href='https://cules-coding.vercel.app/'>Cules Coding</a>
                // `,
                //         params: {
                //             role: 'frontend',
                //         },
            })
            .then(console.log)
            .catch(console.log)

        res.status(200).json({ message: 'Reset link sent to your email' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.resetPswd = async (req, res, next) => {
    try {
        const reqId = req.params.id;
        const request = await ForgotPswd.findOne({ where: { id: reqId } });
        if (request) {
            await ForgotPswd.update({ isActive: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${reqId}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            );
        }
    } catch (err) {
        console.log(err);
    }
}

exports.updatepassword = async (req, res, next) {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        await ForgotPswd.findOne({ where: { id: resetpasswordid } });
        await User.findOne({ where: { id: resetpasswordrequest.userId } });

        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            bcrypt.hash(newpassword, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    throw new Error(err);
                }
                await User.update({ password: hash })
                res.status(201).json({ message: 'Successfuly update the new password' });
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(403).json({ error, success: false } )
    }
}