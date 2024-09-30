import mongoose from "mongoose";
import genSalt from 'bcrypt'

const UserSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            reqired:[true,"Email is required"],
            unique:true
        },
        password:{
            type:String,
            reqired:[true,"Password is required"]
        },
        firstName:{
            type:String
        },
        lastName:{
            type:String
        },
        image:{
            type:String
        },
        profileSetup:{
            type:Boolean,
            default:false
        }
    }
)

UserSchema.pre("save",async function (next) {
    const salt = await genSalt()
    this.password = await hash(this.password,salt)
    next()
    
})



export const Login = mongoose.model('ChatUsers',UserSchema)