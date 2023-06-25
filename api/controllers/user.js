import User from "../models/User.js";


export const updateUser = async(req,res,next)=>{
    try{
const updatedUser = await User.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true});
res.status(200).json(updatedUser);
}catch(error){
    next(err); 
}
}

export const deleteUser = async(req,res,next)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(err); 
    }
}

export const getUser =async(req,res,next)=>{
    try {
        const user=await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(err); 
    }
}

export const getAllUser = async(req,res,next)=>{
    // console.log("hotel route");
    // return next();
    const failed = false;
    if(failed){
        return next(createError(401,"You are not authenticated"))
    }
    try {
        const availableUsers=await User.find();
        res.status(200).json(availableUsers);
    } catch (error) {
        next(err)
    }
}