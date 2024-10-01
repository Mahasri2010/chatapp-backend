import mongoose from "mongoose";


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





export const Login = mongoose.model('ChatUsers',UserSchema)