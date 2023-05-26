const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR);

const Task = require('../models/taskModel');


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





const addTasks = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)
    const { name, data, completed, startTime, endTime, } = req.body


    if (!name || !data || !completed || !startTime || !endTime) {
        res.status(400).json({
            message: 'Please add all fields'
        })
    }

    const task = await Task.create({
        user: id,
        name,
        data,
        completed,
        startTime,
        endTime
    })

    if (task) {
        res.status(200).json({
            message: `Task successfully created`
        })
    }
    else {
        res.status(400).json({
            message: `Invalid task data`
        })
    }
})


const getTasksAll = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)

    const Tasks = await Task.find({ user: id })

    res.status(200).json(Tasks);

})


const delTask = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)
    const task = await Task.findById(req.body.tsId)

    if (!task) {
        res.status(400)
        throw new Error('Task not found')
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

    await Task.findByIdAndDelete(req.body.tsId)

    res.status(200).json({ message: 'Task successfully delete' });

})

const checkTs = asyncHandler(async (req, res) => {
    const id = cryptr.decrypt(req.cookies.aod)
    const task = await Task.findById(req.body.tsId)

    if (!task) {
        res.status(400)
        throw new Error('Task not found')
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
        await Task.findOneAndUpdate({ _id: task.id }, { check: true }, { new: true })

        res.status(200).json({ message: 'Check update' });
    } if (task.check == 'true') {
        await Task.findOneAndUpdate({ _id: task.id }, { check: false }, { new: true })

        res.status(200).json({ message: 'Check update' });
    }



})


module.exports = {
    addTasks,
    getTasksAll,
    delTask,
    checkTs
}