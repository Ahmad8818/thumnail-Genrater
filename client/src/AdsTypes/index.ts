// import type React from "react";

export  interface ImageUploadZoneProps {
//   label:string;
  title: string;
  file: File | null;
  setFile: (file: File | null) => void;
//   onClear:()=>void;
//   onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;

}
export interface User {
    id?:string;
    name?:string;
    email?:string
}
export  interface Project {
    id:string;
    name?:string;
    userId?: string;
    user?: User;
    productName:string;
    productDescription?:string;
    userPrompt:string;
    aspectRatio:string;
    targetLength?:number;
    generatedImage?:string;
    generatedVideo?:string;
    isGenerating: boolean;
    isPublished:boolean;
    error?:string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    uploadedImages:string[];

}