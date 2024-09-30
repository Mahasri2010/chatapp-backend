import express,{json} from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import LoginRouter from './Authentication/loginRouter.js'

const app = express()
const port = process.env.port
const mongodb = process.env.mongodb

app.use(json())
config()
app.use(cors())
app.cookieParser({})




const start = async () => {

    await connect(mongodb)
    app.listen(port, console.log(`Serving on the post ${port}`))
    // .catch(error=>console.log(error.message))
}

start()
