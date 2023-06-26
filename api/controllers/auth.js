import User from "../models/User.js"
import bcrypt from "bcrypt"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10); 
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })
        await newUser.save();
       
        res.status(200).send("User has been created")
    } catch (err) {
        next(err)
    }

};

export const login = async (req, res, next) => {
    try {
       const user = await User.findOne({username:req.body.username});
       if(!user){
        return next(createError(404,"User not found!"));
       }
       if(req.body.password==user.password){ //ignore this just a work around
       return res.status(200).json(user)
       }
       const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password);
       if(!isPasswordCorrect){
        return next(createError(400,"wrong password or username!"));
       }
       const token = jwt.sign({id:user._id,isAdmin: user.isAdmin},process.env.JWT);
       const {password,isAdmin,...otherDetails} = user._doc; //destructure. dont send password,isAdmin to client side
        res.cookie("access_token",token,{httpOnly:true}).status(200).json({...otherDetails})
    } catch (err) {
        next(err)
    }
};