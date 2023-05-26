const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR);

const Watch = require('../models/watchModel');


// const addTasks = asyncHandler(async (req, res) => {
//     const id = cryptr.decrypt(req.cookies.aod)
//     const { tasks } = await User.findById(id);
//     const { name, data, completed, startTime, endTime, } = req.body

//     const fg = {
//         id: uuid.v4(),
//         name,
//         data,
//         completed,
//         startTime,
//         endTime
//     }

//     const fgg = User.updateOne({
//         id
//     }, { $push: { 'tasks': fg } }
//     ).catch((err) => {
//         res.status(400).json({
//             message: err
//         })
//     }).then(() => {
//         res.status(200).json({
//             message: 'add task'
//         })
//     })


//     if (!name || !data || !completed || !startTime || !endTime) {
//         res.status(400).json({
//             message: 'Please add all fields'
//         })
//     }

// })





const addWatch = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)
    const { name, time } = req.body


    if (!name || !time) {
        res.status(400).json({
            message: 'Please add all fields'
        })
    }

    const watch = await Watch.create({
        user: id,
        name,
        time,
    })

    if (watch) {
        res.status(200).json({
            message: `Watch successfully created`
        })
    }
    else {
        res.status(400).json({
            message: `Invalid watch data`
        })
    }
})


const getWatchAll = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)

    const watch = await Watch.find({ user: id })

    res.status(200).json(watch);

})


const delWatch = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)
    const watch = await Watch.findById(req.body.tsId)
    if (!watch) {
        res.status(400)
        throw new Error('Watch not found')
    }

    const user = await User.findById(id)

    if (!user) {
        res.status(401)
        throw new Error('Watch not found')
    }

    if (watch.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await Watch.findByIdAndDelete(req.body.tsId)

    res.status(200).json({ message: 'Watch successfully delete' });

})



module.exports = {
    addWatch,
    getWatchAll,
    delWatch,
}