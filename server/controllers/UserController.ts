import { Request, Response } from "express"
import Thumbnail from "../models/Thumbnail.js";


//Controller to get all user Thumbnails 
export const getAllUsersThumbnails = async (req:Request , res:Response) => {
    try {
        const {userId} = req.session;
        const thumbnails = await Thumbnail.find({userId}).sort({createdAt: -1})
        res.json({thumbnails})
    } catch (error:any ) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}
//Controller to get single user Thumbnails 

export const getSingleUsersThumbnails = async (req:Request , res:Response) => {
    try {
        const {userId} = req.session;
        const {id} = req.params;
        const thumbnail = await Thumbnail.findOne({userId, _id:id}).sort({createdAt: -1})
        res.json({thumbnail})
    } catch (error:any ) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}