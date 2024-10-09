import express, { request, response } from 'express'
import { Contact } from './contactModel.js'

const ContactRouter = express.Router()

ContactRouter.post('/add/',async(request,response) => {

    console.log(request.body)
    let new_data = new Contact(request.body)
    await new_data.save()
    response.json({message:"Contact Saved"})
})

ContactRouter.get('/all/',async(request,response) => {

    let all_data = await Contact.find({})
    response.json(all_data)
})

ContactRouter.get('/:id/',async(request,response) => {
  
    const {id} = request.params
    let all_data = await Contact.findById(id)
    response.json(all_data)
})

ContactRouter.patch('/update/:id/',async(request,response) => {
  
    const {id} = request.params
    let all_data = await Contact.findByIdAndUpdate(id)
    response.json(all_data)
})

ContactRouter.delete('/delete/:id/',async(request,response) => {
  
    const {id} = request.params
    let all_data = await Contact.findByIdAndDelete(id)
    response.json(all_data)
})

export default ContactRouter



