const express = require('express')
const mongoose = require('mongoose')
const app = express()



mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.use(express.json())

const signUpRouter = require('./routers/sign-up')
const signInRouter = require('./routers/sign-in')
const usersRouter = require('./routers/users')

app.use(signUpRouter)
app.use(signInRouter)
app.use(usersRouter)


app.listen(3000, () => {
    console.log('Server has started')
})