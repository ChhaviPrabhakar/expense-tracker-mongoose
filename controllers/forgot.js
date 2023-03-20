const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

exports.forgotPswd = async (req, res, next) => {
    try {
        const email = req.body.email;

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
                textContent: `Cules Coding will teach you how to become a {{params.role}} developer.`,
                htmlContent: `
			<h1>Become a {{params.role}} developer</h1>
			<a href='https://cules-coding.vercel.app/'>Cules Coding</a>
		`,
                params: {
                    role: 'frontend',
                },
            })
            .then(console.log)
            .catch(console.log)

        res.status(200).json({ message: 'Reset link sent to your email' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}