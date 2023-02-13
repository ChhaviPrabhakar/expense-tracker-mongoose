const express = require('express');
const cors = require('cors');

const sequelize = require('./util/database');

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user');

app.use('/user', userRoutes);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));