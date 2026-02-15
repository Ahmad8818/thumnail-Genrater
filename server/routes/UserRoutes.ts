import  express  from "express";
import { getAllProject, getAllUsersThumbnails, getCommunityThumbnails, getProjectById, getSingleUsersThumbnails, getUserCredits, toggleProjectPublic } from "../controllers/UserController.js";
import protect from "../middlewares/auth.js";

const UserRouter = express.Router();

UserRouter.get('/thumbnails', protect, getAllUsersThumbnails)
UserRouter.get('/thumbnails/:id', protect, getSingleUsersThumbnails)
UserRouter.get("/community",  getCommunityThumbnails);
// ads routes
UserRouter.get('/credits', protect ,getUserCredits)
UserRouter.get('/project', protect ,getAllProject)
UserRouter.get('/project/:id', protect ,getProjectById)
UserRouter.get('/published/:projectId', protect ,toggleProjectPublic)


export default UserRouter;
