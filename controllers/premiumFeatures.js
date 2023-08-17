const User = require('../models/user');

exports.getUserLeaderboard = async (req, res, next) => {
    try {
        const leaderboardofusers = await User.find()
            .sort({ totalExpenses: -1 });

        res.status(200).json(leaderboardofusers);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
