import mongoose ,{ Document, Model, Schema } from 'mongoose';


export interface IProject extends Document {
  name: string;
  clerkId: string; // Clerk user ID
  productName: string;
  productDescription: string;
  userPrompt: string;
  aspectRatio: string;
  targetLength: number;
  uploadedImages: string[];
  generatedImage: string;
  generatedVideo: string;
  isGenerating: boolean;
  isPublished: boolean;
  error: string;
  createdAt: Date;
  updatedAt: Date;
}


const projectSchema = new mongoose.Schema<IProject>({
  name: { type: String, required: true },
  clerkId: { type: String, required: true, index: true }, // Referencing Clerk ID for easier queries
  productName: { type: String, required: true },
  productDescription: { type: String, default: "" },
  userPrompt: { type: String, default: "" },
  aspectRatio: { type: String, default: "9:16" },
  targetLength: { type: Number, default: 5 },
  uploadedImages: [{ type: String }],
  generatedImage: { type: String, default: "" },
  generatedVideo: { type: String, default: "" },
  isGenerating: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  error: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.AdsProject || mongoose.model<IProject>('AdsProject', projectSchema);
