import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema(
    {

    }
)

export const Login = mongoose.model('Login',LoginSchema)