import mongoose from 'mongoose'

const Contactschema = new mongoose.Schema(
    {
        contact_name:{
            type:String
        },
        contact_number:{
            type:Number
        }
    }
)

export const Contact = mongoose.model('Contact',Contactschema)