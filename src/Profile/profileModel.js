import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
    {
        image:{
            type:String
        },
        name:{
            type:String,
            required:[true,'Firstname is required']
        },
        phone:{
            type:Number,
        },
        about:{
            type:String
        }
}
)

export const Profile = mongoose.model('Profile',ProfileSchema)