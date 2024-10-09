import express,{json,urlencoded} from 'express'
import { connect } from 'mongoose'
import {config} from 'dotenv'
import cors from 'cors'
import ProfileRouter from './Profile/profileRouter.js'
import ContactRouter from './Contacts/contactRouter.js'

const app = express()
config()
app.use(cors())
app.use(json({limit: "50mb"}))
app.use(urlencoded({limit:'50mb',extended:true}))

const port = process.env.port
const mongodb = process.env.mongodb

app.use('/profile/',ProfileRouter)
app.use('/contact/',ContactRouter)


const start = async () => {

    await connect(mongodb)
    app.listen(port, console.log(`Serving on the post ${port}`))
}

start()
