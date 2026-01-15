import  express  from "express";
import { getAllUsersThumbnails, getSingleUsersThumbnails } from "../controllers/UserController.js";
import protect from "../middlewares/auth.js";

const UserRouter = express.Router();

UserRouter.get('/thumbnails', protect, getAllUsersThumbnails)
UserRouter.get('/thumbnails/:id', protect, getSingleUsersThumbnails)


export default UserRouter;
