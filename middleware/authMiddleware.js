const jwt = require('jsonwebtoken');
const asyncHandle = require('express-async-handler');
const User = require('../models/userModel');
const Cryptr = require('cryptr');

const cryptr = new Cryptr(process.env.CRYPTR);


const protect = asyncHandle(async (req, res, next) => {
    let token;

    console.log(req.cookies);

    if (req.cookies.access) {
        try {
            token = cryptr.decrypt(req.cookies.access)
            jwt.verify(token, process.env.JWT_SECRET_ACCESS)
            console.log('16 строка');
            // req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.log('21 строка');
            res.status(401)
            throw new Error(`Not authorized, ${error}`)
        }
    }
    else if (!token) {
        console.log('27 строка');
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = { protect }