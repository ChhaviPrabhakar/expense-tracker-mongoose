const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPswd = require('./models/forgot');
const DownloadedExpense = require('./models/download');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

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

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPswd);
ForgotPswd.belongsTo(User);

User.hasMany(DownloadedExpense);
DownloadedExpense.belongsTo(User);

sequelize.sync()  //{force: true}
.then(result => {
    app.listen(process.env.PORT || 3000);
})
.catch(err => console.log(err));