const express = require('express');
const router = express.Router();

const premiumFeaturesController = require('../controllers/premiumFeatures');

router.get('/showleaderboard', premiumFeaturesController.getUserLeaderboard);

module.exports = router;