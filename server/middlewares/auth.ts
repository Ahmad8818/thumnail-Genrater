import {Request , Response, NextFunction} from 'express'

const protect = async (req:Request, res:Response , next:NextFunction) => {
    const {isLoggedIn, userId} = req.session;
    if(!isLoggedIn || ! userId){
        return res.status(401).json({
           message:'you are not loggedin'
        })
    }
    next()
}

export default protect