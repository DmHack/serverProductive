const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');


const PORT = process.env.PORT
connectDB()

const app = express()
app.use(cors({ credentials: true, origin: '*' }));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use('/api/users', require('./routes/userRoutes'))
// app.use('/api/tasks', require('./routes/taskRoutes'))

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`.green);
})


