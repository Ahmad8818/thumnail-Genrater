import { Request, Response } from "express"
import Thumbnail from "../models/Thumbnail.js";
import * as Sentry from "@sentry/node"
import ClerkUser from "../models/ClerkUser.js";
import Project from "../models/Project.js";


//Controller to get all user Thumbnails 
export const getAllUsersThumbnails = async (req:Request , res:Response) => {
    try {
        const {userId} = req.auth();
        const thumbnails = await Thumbnail.find({clerkId:userId}).sort({createdAt: -1})
        res.json({thumbnails})
    } catch (error:any ) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}
//Controller to get single user Thumbnails 

export const getSingleUsersThumbnails = async (req:Request , res:Response) => {
    try {
        const {userId} = req.auth();
        const {id} = req.params;
        const thumbnail = await Thumbnail.findOne({clerkId:userId, _id:id}).sort({createdAt: -1})
        res.json({thumbnail})
    } catch (error:any ) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}
// controllers/thumbnail.controller.ts

export const getCommunityThumbnails = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [thumbnails, total] = await Promise.all([
      Thumbnail.find({
        published: true,
        image_url: { $ne: "" },
      })
        .populate("userId", "name") // ✅ POPULATE USER NAME
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Thumbnail.countDocuments({
        published: true,
        image_url: { $ne: "" },
      }),
    ]);

    res.json({
      thumbnails,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load community thumbnails" });
  }
};

// ads user api
export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const {userId} = req.auth();
    if(!userId){
      return res.status(401).json({
        message:'Unautrozied'
      })
    }
    const user = await ClerkUser.findOne({clerkId:userId})
    res.json({credits: user?.credits})
  } catch (error: any) {
    Sentry.captureException(error)
    res.status(500).json({message:error.code || error.message})

  }
}
export const getAllProject = async (req:Request , res:Response) => {
    try {
          const {userId} = req.auth();
        const projects = await Project.find({clerkId:userId }).sort({createdAt: -1})
        res.json({projects})
    } catch (error:any ) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}
// controllers/thumbnail.controller.ts

export const getProjectById= async (req: Request, res: Response) => {
  try {
   const {userId} = req.auth();
   const {projectId} = req.params 
        const project = await Project.findById({clerkId:userId,  id:projectId }).sort({createdAt: -1})
        res.json({project})
        if(!project){
          return res.status(404).json({
            message:'Project not found'
          })
        }
  } catch (error) {
    res.status(500).json({ message: "Failed to load community thumbnails" });
  }
};
export const toggleProjectPublic = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    const { projectId } = req.params;

    const project = await Project.findOne({ _id: projectId, clerkId: userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.generatedImage && !project.generatedVideo) {
      return res.status(400).json({ message: "Image or video not generated" });
    }

    // Toggle isPublished
    project.isPublished = !project.isPublished;
    await project.save();

    res.json({ isPublished: project.isPublished });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};


// export const toggleProjectPublic = async (req: Request, res: Response) => {
//   try {
//     const {userId} = req.auth()
//     const {projectId} = req.params
//      const project = await Project.findById({userId,  id:projectId }).sort({createdAt: -1})
//         res.json({project})
//         if(!project){
//           return res.status(404).json({
//             message:'Project not found'
//           })
//         }
//         if(!project.generatedImage && project.generatedVideo ){
//           return res.status(404).json({
//             message:'image or vodeo not generated'
//           })
//         }
        
//         await project.update({
//           id:projectId,
//           data:{isPublished : !project.isPublished}

//         })
//         res.json({isPublished :!project.isPublished})

//   } catch (error: any) {
//     Sentry.captureException(error)
//     res.send(500).json({message:error.code || error.message})

//   }
// }


 