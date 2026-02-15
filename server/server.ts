import "./config/instrument.mjs"
import express, { Request, Response } from 'express';
import cors from 'cors'
import 'dotenv/config'
import { connectDb } from './config/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import AuthRouter from './routes/AuthRoutes.js';
import ThumbnailRouter from './routes/ThumbnailRoutes.js';
import UserRouter from './routes/UserRoutes.js';
import { clerkMiddleware } from '@clerk/express'
// import { clerkWebhook } from './controllers/Clerk.js';
import * as Sentry from "@sentry/node"
import clerkWebhook from "./controllers/Clerk.js";

declare module 'express-session' {
    interface SessionData{
        isLoggedIn:boolean;
        userId:string;

    }
}
const env = process.env
await connectDb()
const app = express();
app.post(
  '/api/clerk', 
  express.raw({ type: 'application/json' }), 
  clerkWebhook
);

const port = process.env.PORT || 5000;

app.use(express.json())
app.use(clerkMiddleware())
app.use(cors({
    origin:[
        'http://localhost:5173',
        'http://localhost:5000',
        'https://advizi.vercel.app'
        //add frontend url
    ],credentials:true
}))
app.set('trust proxy',1)
// app.use(session({
//     secret:process.env.SESSION_SECRET as string,
//     resave:false,
//     saveUninitialized:false,
//     cookie:{
//         maxAge:1000 * 60 * 60 * 24 * 7,
//         httpOnly:true,
//         secure:process.env.NODE_ENV === 'production',
//         sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//         path:'/'
//     }, 
//     store:MongoStore.create({
//         mongoUrl:process.env.MONGODB_URI as string,
//         collectionName:'sessions'
//     })
// }))
app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);
app.use('/api/auth',AuthRouter)
app.use('/api/thumbnail',ThumbnailRouter)
app.use('/api/user',UserRouter)


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});