import express,{json} from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import cors from 'cors'

const app = express()
app.use(json())
config()
app.use(cors())

const port = process.env.port
const mongodb = process.env.mongodb


const start = async () => {

    await connect(mongodb)
    app.listen(port, console.log(`Serving on the post ${port}`))
}

start()
