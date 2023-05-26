const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');

const cryptr = new Cryptr(process.env.CRYPTR);


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400).json({
            message: 'Please add all fields'
        })
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User arleady exists')
        // res.status(400).json({
        //     message: 'User arleady exists'
        // })
    }

    const salt = await bcrypt.genSalt(10)
    const handlePassword = await bcrypt.hash(password, salt)


    const user = await User.create({
        name,
        email,
        password: handlePassword,
    })

    if (user) {
        res.status(200).json({
            message: `User successfully created`
        })
    }
    else {
        res.status(400).json({
            message: `Invalid user data`
        })
    }

})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body


    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        const refresh = generateRefreshToken(user._id);
        User.findOneAndUpdate({ _id: user._id }, { refresh: cryptr.encrypt(refresh) }, { new: true })
            .then(function () {
                res.cookie('access', cryptr.encrypt(generateAccessToken(user._id)), {
                    sameSite: 'none',
                    secure: false,
                    httpOnly: true,
                })
                res.cookie('refresh', cryptr.encrypt(refresh), {
                    sameSite: 'none',
                    secure: false,
                    httpOnly: true,
                })
                res.cookie('aod', cryptr.encrypt(user._id), {
                    sameSite: 'none',
                    secure: false,
                    httpOnly: true,
                })
                res.status(200).json({
                    message: 'yes   '
                })
            })
            .catch(function (err) {
                res.status(400).json({
                    message: 'Error in login'
                })
            });


    } else {
        // res.status(400)
        // throw new Error('User arleady exists')
        res.status(400).json({
            message: `Invalid credentials`
        })
    }

})




const getMe = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)
    const { name, _id, email, tasks } = await User.findById(id);

    res.status(200).json({
        name,
        id: _id,
        email,
        tasks
    });
})


const proverka = asyncHandler(async (req, res) => {
    const acc = cryptr.decrypt(req.cookies.access)

    jwt.verify(acc, process.env.JWT_SECRET_ACCESS, async (err, user) => {
        if (err) {
            res.status(401).json({
                message: 'acc dead'
            })
        } else if (user) {
            res.status(200).json({
                message: 'OK'
            })
        }
    })
})

const exitAkk = asyncHandler(async (req, res) => {
    const acc = cryptr.decrypt(req.cookies.access)

    jwt.verify(acc, process.env.JWT_SECRET_ACCESS, async (err, user) => {

        if (err) {
            res.status(401).json({
                message: 'acc dead'
            })
        } else if (user) {
            res.cookie('access', "", {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                maxAge: 0
            })
            res.cookie('refresh', "", {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                maxAge: 0
            })
            res.cookie('aod', "", {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                maxAge: 0
            })
            res.status(200).json({
                message: 'exit'
            })
        }
    })
})












const renewAccessToken = asyncHandler(async (req, res) => {
    console.log('-------------------------------');
    console.log(req.cookies);
    console.log('-------------------------------');

    const refreshToken = cryptr.decrypt(req.cookies.refresh);

    if (!refreshToken) {

        return res.status(405).json({ message: "User not authenticated" })
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, async (err, user) => {

        if (!err) {
            const { refresh } = await User.findById(user.id);
            try {
                const refreshDec = cryptr.decrypt(refresh)
                if (refreshToken === refreshDec) {
                    res.cookie('access', cryptr.encrypt(generateAccessToken(user._id)), {
                        httpOnly: true,
                        sameSite: 'None',
                        secure: true
                    })
                    res.status(201).json({ message: 'ok' })
                } else {
                    // res.clearCookie('access')
                    // res.clearCookie('refresh')
                    // res.clearCookie('aod')
                    res.status(405).json({ message: "Token invalid", err: err })
                }

            } catch (err) {
                res.status(405).json({
                    message: 'NO'
                })
            }

        } else {
            // res.clearCookie('access')
            // res.clearCookie('refresh')
            // res.clearCookie('aod')
            res.status(405).json({ message: "User not authenticated", err: err })
        }
    })
})










const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_ACCESS, {
        expiresIn: '1m',
    })
}

const generateAccessTokenResPass = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET_ACCESS_REST_PASS, {
        expiresIn: '100m',
    })
}


const generateRefreshToken = (id) => {
    const refresh = jwt.sign({ id }, process.env.JWT_SECRET_REFRESH, {
        expiresIn: '30d',
    })

    return refresh;

}







module.exports = {
    registerUser,
    loginUser,
    renewAccessToken,
    getMe,
    proverka,
    exitAkk
}