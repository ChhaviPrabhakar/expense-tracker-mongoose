const express = require('express');
const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, 'access.log'),
//     { flags: 'a' }
// );

const app = express();

app.use(cors());
app.use(express.json());
// app.use(helmet());
// app.use(morgan('combined', { stream: accessLogStream }));

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeatures');
const forgotRoutes  = require('./routes/forgot');

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', forgotRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `views/${req.url}`));
});

mongoose
.connect('mongodb+srv://prabhakarchhavi9:z1CNQRBedteE946d@cluster0.hzxeuvy.mongodb.net/expenseTracker?retryWrites=true&w=majority')
.then(result => {
    app.listen(process.env.PORT || 3000);
    console.log('>>>>> Connected to PORT 3000 <<<<<');
})
.catch(err => console.log(err));