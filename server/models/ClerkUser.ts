import mongoose, { Schema } from "mongoose";

export interface IUserClerk extends Document{
  clerkId:string;
  name:string;
  email:string;
  password?:string;
  credits:number;
  plan:string;
  image:string;
  createdAt?: Date;
  updatedAt?:Date; 
}
const userSchema = new Schema<IUserClerk>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
    },

    name: String,
    image: String,

    credits: {
      type: Number,
      default: 20,
    },
    plan: { type: String, default: 'free' }
  },
  { timestamps: true }
);

 const ClerkUser = mongoose.models.ClerkUser || mongoose.model<IUserClerk>('ClerkUser',userSchema)
 export default ClerkUser;


