import express from "express";
import { Profile } from "./profileModel.js";

const ProfileRouter = express.Router()

ProfileRouter.post('/add/',async(request,response) => {

    console.log(request.body)
    let new_data = new Profile(request.body)
    await new_data.save()
    response.json(request.body)

})


ProfileRouter.get('/all',async(request,response) => {

    let all_data = await Profile.find({})
    response.json(all_data)
    
})


ProfileRouter.get('/:id',async(request,response) => {

    const {id} = request.params
    let id_data = await Profile.findById(id)
    response.json(id_data)
    
})

ProfileRouter.patch('/update/:id',async(request,response) => {

    const {id} = request.params
    let id_data = await Profile.findByIdAndUpdate(id,request.body)
    response.json({message:"Profile Updated"})
})

export default ProfileRouter