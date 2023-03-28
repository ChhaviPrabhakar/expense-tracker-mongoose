const express = require('express');
const cors = require('cors');

const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPswd = require('./models/forgot');
const DownloadedExpense = require('./models/download');

const app = express();

app.use(cors());
app.use(express.json());

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
    app.listen(3000);
})
.catch(err => console.log(err));