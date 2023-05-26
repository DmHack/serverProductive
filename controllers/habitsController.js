const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR);

const Habits = require('../models/habitsModel');


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





const addHabits = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)
    const { name, completed } = req.body


    if (!name || !completed) {
        res.status(400).json({
            message: 'Please add all fields'
        })
    }

    const habits = await Habits.create({
        user: id,
        name,
        completed
    })

    if (habits) {
        res.status(200).json({
            message: `Habits successfully created`
        })
    }
    else {
        res.status(400).json({
            message: `Invalid habits data`
        })
    }
})


const getHabitsAll = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)

    const habits = await Habits.find({ user: id })

    res.status(200).json(habits);

})


const delHabits = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)
    const task = await Habits.findById(req.body.tsId)
    if (!task) {
        res.status(400)
        throw new Error('Habits not found')
    }

    const user = await User.findById(id)

    if (!user) {
        res.status(401)
        throw new Error('Habits not found')
    }

    if (task.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await Habits.findByIdAndDelete(req.body.tsId)

    res.status(200).json({ message: 'Habits successfully delete' });

})

const checkTs = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)
    const task = await Habits.findById(req.body.tsId)

    if (!task) {
        res.status(400)
        throw new Error('Habits not found')
    }

    const user = await User.findById(id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (task.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    if (task.check == 'false') {
        await Habits.findOneAndUpdate({ _id: task.id }, { check: true }, { new: true })

        res.status(200).json({ message: 'Check update' });
    } if (task.check == 'true') {
        await Habits.findOneAndUpdate({ _id: task.id }, { check: false }, { new: true })

        res.status(200).json({ message: 'Check update' });
    }



})


module.exports = {
    addHabits,
    getHabitsAll,
    delHabits,
    checkTs
}