import mongoose from 'mongoose'
 export const connectDb = async () => {
   try {
    mongoose.connection.on('connected', ()=>console.log('mongoDb Connected'))
    await mongoose.connect(process.env.MONGODB_URI as string)
   } catch (error) {
    console.error('Error connecting to MongoDb',error)
   } 
}
