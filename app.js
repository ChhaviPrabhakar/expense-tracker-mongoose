const express = require('express');
const cors = require('cors');

const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense')

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));