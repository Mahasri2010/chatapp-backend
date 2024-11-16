import mongoose from 'mongoose';


const AuthSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match:[/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,'Invalid email format']    // Simple email validation
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 4, // Minimum password length
    maxlength: 4 // Maximum passwoed length
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
  }
});

export const Auth = mongoose.model('Auth', AuthSchema);



const RefreshTokenSchema = mongoose.Schema(
  {
        refresh_token:{
               
              type:String,
              required:true

        }
  }
)

export const RefreshToken = mongoose.model('refreshtoken',RefreshTokenSchema)


