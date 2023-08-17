const Order = require('../models/order');
const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

const generateAccessToken = (id, ispremiumuser) => {
    return jwt.sign({ userId: id, ispremiumuser }, process.env.TOKEN_SECRET_KEY);
}

exports.purchasePremium = async (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 1000;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            const newOrder = new Order({
                orderid: order.id,
                status: 'PENDING',
                userId: req.user
            });
            return newOrder.save()
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong!', error: err });
    }
};

exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { order_id, payment_id } = req.body;
        const order = await Order.findOne({ orderid: order_id });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const updatePayStatus = Order.updateOne({ orderid: order_id }, { paymentid: payment_id, status: 'SUCCESS' });

        const updateUser = User.updateOne({ _id: req.user._id }, { ispremiumuser: true });

        const userId = req.user;

        await Promise.all([updatePayStatus, updateUser]);
        
        res.status(202).json({ success: true, message: 'Transaction successful', token: generateAccessToken(userId, true) });
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong!' });
    }
};