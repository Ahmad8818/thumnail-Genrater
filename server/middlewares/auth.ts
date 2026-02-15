import {Request , Response, NextFunction} from 'express'
import * as Sentry from "@sentry/node"

//  const protect = async (req:Request, res:Response , next:NextFunction) => {
//     const {isLoggedIn, userId} = req.session;
//     if(!isLoggedIn || ! userId){
//         return res.status(401).json({
//            message:'you are not loggedin'
//         })
//     }
//     next()
// }
// export default protect

 const protect = async (req:Request, res:Response , next:NextFunction) => {
    try {
        const {userId} = req.auth();
    if(!userId){
        return res.status(401).json({
           message:'you are not loggedin'
        })
    }
    next()
    } catch (error:any) {
        Sentry.captureException(error)
        res.status(401).json({message:error.code || error.message })
    }
    
}

export default protect