const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');


const PORT = process.env.PORT
connectDB()

const app = express()
app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tasks', require('./routes/taskRoutes'))
app.use('/api/habits', require('./routes/habitsRoutes'))
app.use('/api/watch', require('./routes/watchRoutes'))

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`.green);
})


