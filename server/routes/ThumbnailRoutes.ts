import  express  from "express";
import { createProject, createVideo, deleteProject, deleteThumbnail, generateThumbnail, getAllPublishedProject } from "../controllers/ThumbnailController.js";
import protect from "../middlewares/auth.js";
import upload from "../config/multer.js";

const ThumbnailRouter = express.Router();
// ThumbnailRouter.get("/community", protect, getCommunityThumbnails);
ThumbnailRouter.post('/generate', protect, generateThumbnail)
ThumbnailRouter.delete('/delete/:id', protect, deleteThumbnail)

// ads routes
ThumbnailRouter.post('/create',upload.array('images',2), protect, createProject)
ThumbnailRouter.post('/video', protect, createVideo)
ThumbnailRouter.get('/published', protect, getAllPublishedProject)
ThumbnailRouter.delete('/:projectId', protect, deleteProject)



export default ThumbnailRouter;
