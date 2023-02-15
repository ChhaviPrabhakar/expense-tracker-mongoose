const express = require('express');
const cors = require('cors');

const sequelize = require('./util/database');

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));