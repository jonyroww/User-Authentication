require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
//db.dropDatabase()
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

const signUpRouter = require('./routers/sign-up')
const signInRouter = require('./routers/sign-in')
const usersRouter = require('./routers/users')
const postsRouter = require('./routers/posts')
const tagsRouter = require('./routers/tags')
const testRouter = require('./routers/test')

app.use(express.json())
app.use(signUpRouter)
app.use(signInRouter)
app.use('/users', usersRouter)
app.use('/posts',postsRouter)
app.use('/tags',tagsRouter)
app.use(testRouter)

app.listen (process.env.PORT_API,() => {
    console.log('Server has started')
})