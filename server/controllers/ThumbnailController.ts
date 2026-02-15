import {Request , Response} from 'express'
import Thumbnail from '../models/Thumbnail.js';
import {GenerateContentConfig, GoogleGenAI, HarmBlockThreshold, HarmCategory} from '@google/genai'
import ai from '../config/ai.js';
import path from 'path';
import  fs  from 'fs';
import {v2 as cloudinary} from 'cloudinary'
import * as Sentry from "@sentry/node"
import ClerkUser from '../models/ClerkUser.js';
import Project from '../models/Project.js';
import upload from '../config/multer.js';
import axios from 'axios';

const genAI = new GoogleGenAI({ 
    apiKey: process.env.GEMNI_API_KEY_TEST
});
const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style',
}
const colorSchemeDescriptions = {
    vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
    sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
    forest: 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
    neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
    purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
    monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
    ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
    pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',
}
const loadImage = (path:string, mimeType:string)=>{
    return {
        inlineData:{
            data:fs.readFileSync(path).toString('base64'),
            mimeType
        }
    }
}

export const generateThumbnail = async (req:Request, res:Response) => {
  let creditsDeducted = false;
  const {userId} = req.auth()
        if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const {
            title,
            promt:user_promt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay
        }= req.body
  const updatedUser = await ClerkUser.findOneAndUpdate(
    {
      clerkId: userId,
      credits: { $gte: 10 },
    },
    {
      $inc: { credits: -10 },
    },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(401).json({ message: "Insufficient credits" });
  }

  creditsDeducted = true;
    try {
        // const {userId} = req.session;
        
        // const {
        //     title,
        //     promt:user_promt,
        //     style,
        //     aspect_ratio,
        //     color_scheme,
        //     text_overlay
        // }= req.body
        const thumbnail = await Thumbnail.create({
            userId,
            title,
            promt_used:user_promt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true
        })
        // googlecloud api integrate
        const model = 'gemini-3-pro-image-preview'
        const generationConfig: GenerateContentConfig = {
            maxOutputTokens:32768,
            temperature:1,
            topP:0.95,
            responseModalities:['IMAGE'],
            imageConfig:{
                aspectRatio: aspect_ratio||'16:9',
                imageSize:'1K'
            },
            safetySettings:[
                {
                    category:HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold:HarmBlockThreshold.OFF
                },
                {
                    category:HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold:HarmBlockThreshold.OFF
                },
                {
                    category:HarmCategory.HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT,
                    threshold:HarmBlockThreshold.OFF
                },
                {
                    category:HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold:HarmBlockThreshold.OFF
                }
            ]

        }
        let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts]} for :"${title}".  `
        if(color_scheme){
            prompt += `Use a ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]} color scheme.`
        }
        if(user_promt){
            prompt += `Additional details: ${user_promt}.`
        }
        prompt += `The thumbnail should be ${aspect_ratio}, visually stunning, and 
        designed to maximize click-through rate. Make it bold, professional, and 
        impossible to ignore .`

        // Generate the image using ai model
        const  response:any = await ai.models.generateContent({
            model,
            contents:[prompt],
            config: generationConfig
        })
        //Check if the response is valid 
        if(!response?.candidates?.[0].content?.parts){
            throw new Error('Unexpected response')
        }
        const parts = response.candidates[0].content.parts;
        let finalBuffer: Buffer | null = null;
        for(const part of parts){
            if(part.inlineDate){ 
            finalBuffer = Buffer.from(part.inlineDate.data,'base64')
        }
    }
    const filename = `final-output-${Date.now()}.png`;
    const filepath = path.join('images',filename);

    //create the image  directory if it does't exist
    fs.mkdirSync('images',{recursive:true})
    //Write the final image to the file
    fs.writeFileSync(filepath, finalBuffer!);
    
    const uploadResult = await cloudinary.uploader.upload(filepath,{
        resource_type:'image'
    })
    thumbnail.image_url = uploadResult.url;
    thumbnail.isGenerating = false;
    await thumbnail.save()

    res.json({
        message:'Thumbnail Generated',
        thumbnail
    })
    //remove the file from disk
    fs.unlinkSync(filepath)
    } catch (error:any) {
      
    /**
     * Refund credits on failure
     */
    if (creditsDeducted) {
      await ClerkUser.updateOne(
        { clerkId: userId },
        { $inc: { credits: 10 } }
      );
    }

    Sentry.captureException(error);
    console.error(error);

    return res.status(500).json({
      message: error.message || "Failed to create Thumbnails",
    });
        
    }
}
 

export const deleteThumbnail = async (req:Request, res:Response) => {
    try {
        const {id} = req.params;
        const {userId} = req.auth();

        await Thumbnail.findByIdAndDelete({_id:id, clerkId:userId})
        res.status(500).json({message:'Thumbnails deleted successfully'})


    } catch (error:any) {
      Sentry.captureException(error);
        console.log(error)
        res.status(500).json({message:error.message})
    }
}



// Ads generator Api

// Generate Image for video
export const createProject = async (req: Request, res: Response) => {
  let tempProjectId: string | null = null;
  let creditsDeducted = false;

  const { userId } = req.auth();
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    name = "New Project",
    aspectRatio = "9:16",
    userPrompt = "",
    productName,
    productDescription = "",
    targetLength = 5,
  } = req.body;

  const images: any = req.files;

  if (!images || images.length < 2 || !productName) {
    return res.status(400).json({
      message: "Please upload at least 2 images and provide product name",
    });
  }

  /**  ATOMIC CREDIT DEDUCTION (MongoDB safe) */
  const updatedUser = await ClerkUser.findOneAndUpdate(
    {
      clerkId: userId,
      credits: { $gte: 10 },
    },
    {
      $inc: { credits: -10 },
    },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(401).json({ message: "Insufficient credits" });
  }

  creditsDeducted = true;

  try {
    /**
     * Upload input images
     */
    const uploadedImages = await Promise.all(
      images.map(async (item: any) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    /**
     * Create Project (Mongoose)
     */
    const project = await Project.create({
      name,
      clerkId: userId,
      productName,
      productDescription,
      userPrompt,
      aspectRatio,
      targetLength: parseInt(targetLength),
      uploadedImages,
      isGenerating: true,
    });

    tempProjectId = project._id.toString();

    /**
     * AI CONFIG
     */
    const model = "gemini-3-pro-image-preview";

    const generationConfig: GenerateContentConfig = {
      maxOutputTokens: 32768,
      temperature: 1,
      topP: 0.95,
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio,
        imageSize: "1K",
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
      ],
    };

    const img1base64 = loadImage(images[0].path, images[0].mimetype);
    const img2base64 = loadImage(images[1].path, images[1].mimetype);

    const adsPrompt = {
      text: `
        Combine the person and product into a realistic photo.
        Make the person naturally hold or use the product.
        Match lighting, shadows, scale and perspective.
        Use professional studio lighting.
        Output ecommerce-quality photorealistic imagery.
        ${userPrompt}
      `,
    };

    /**
     * Generate image
     */
    const response: any = await ai.models.generateContent({
      model,
      contents: [img1base64, img2base64, adsPrompt],
      config: generationConfig,
    });

    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error("Unexpected AI response");
    }

    let finalBuffer: Buffer | null = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        finalBuffer = Buffer.from(part.inlineData.data, "base64");
      }
    }

    if (!finalBuffer) {
      throw new Error("Failed to generate image");
    }

    /**
     * Upload generated image
     */
    const base64Image = `data:image/png;base64,${finalBuffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      resource_type: "image",
    });

    /**
     * Update project
     */
    project.generatedImage = uploadResult.secure_url;
    project.isGenerating = false;
    await project.save();

    return res.json({
      message: "Project created successfully",
      projectId: project._id,
      creditsLeft: updatedUser.credits,
      project,
    });
  } catch (error: any) {
    /**
     * Mark project as failed
     */
    if (tempProjectId) {
      await Project.findByIdAndUpdate(tempProjectId, {
        isGenerating: false,
        error: error.message,
      });
    }

    /**
     * Refund credits on failure
     */
    if (creditsDeducted) {
      await ClerkUser.updateOne(
        { clerkId: userId },
        { $inc: { credits: 10 } }
      );
    }

    Sentry.captureException(error);
    console.error(error);

    return res.status(500).json({
      message: error.message || "Failed to create project",
    });
  }
};

// tode:orignal
// export const createVideo = async (req:Request, res:Response) => {
//     const {userId} = req.auth();
//     const {projectId} = req.body
//     let isCreditsDeducted = false;

//       /**  ATOMIC CREDIT DEDUCTION (MongoDB safe) */
//   const updatedUser = await ClerkUser.findOneAndUpdate(
//     {
//       clerkUserId: userId,
//       credits: { $gte: 10 },
//     },
//     {
//       $inc: { credits: -10 },
//     },
//     { new: true }
//   );

//   if (!updatedUser) {
//     return res.status(401).json({ message: "Insufficient credits" });
//   }
//     isCreditsDeducted = true;

//     try {
//         const  project = await prisma.project.dindUnique({
//             where:{id:projectId, userId},
//             include:{user:true}
//         })
//         if(!project || project.isGenerating){
//             return res.status(404).json({
//                 message:'Generation in progress'
//             })
//         }
//         if( project.generatedVideo){
//             return res.status(404).json({
//                 message:'Video Already Generated'
//             })
//         }
//         await prisma.project.update({
//             where:{is:projectId},
//             data:{isGenerating:true}
//         })

//            const videoPrompt = `make the person showcase the product which is ${project.productName}
//            ${project.productDescription && `and Product Description: ${project.
//             productDescription
//            }`} `

//         const model = 'veo-3.1-generate-preview'
//         if(!project.generatedImage){
//             throw new Error('Generated image not found')
//         }
//         const image = await axios.get(project.generatedImage, {responseType:'arraybuffer', })
//         const imageBytes: any = Buffer.from(image.data)
//         let operation : any = await ai.models.generateVideos({
//             model,
//             videoPrompt,
//             image:{
//                 imageBytes:imageBytes.toString('base64'),
//                 mimeType:'image/png'
//             },
//             config:{
//                 aspectRatio:project?.aspectRatio || '9:16',
//                 numberOfVideos:1,
//                 resolution:'720p'
//             }
//         })

//         while (!operation.done){
//             console.log('waiting for video generate to complete....');
//             await new Promise((resolve)=>{setTimeout(resolve,10000)});
//             operation = await ai.operations.getVideosOperation({
//                 operation:operation
//             })
//         }

//         const filename = `${userId}-${Date.now()}.mp4`;
//         const filepath = path.join('videos',filename)

//         fs.mkdirSync('viseos',{recursive:true})

//         if(!operation.response.generatedVideo){
//             throw new Error(operation.response.raiMediaFilterReasons[0])
//         }

//         await ai.files.download({
//             file:operation.response.generatedVideo[0].video,
//             downloadPath:filepath
//         })

//         const uploadResult = await cloudinary.uploader.upload(filepath,{
//             resource_type:'video'
//         })
//         await prisma.project.update({
//             where:{id:project.id},
//             data:{
//                 geneartedVideo: uploadResult.secure_url,
//                 isGenerating:false
//             }
//         })
//         fs.unlinkSync(filepath)

//     res.json({
//         message:'Video Generated completed',
//         videoUrl:uploadResult.secure_url
//     })
//     //remove the file from disk
//     fs.unlinkSync(filepath)
//     } catch (error:any) {
//         /**
//      * Mark project as failed
//      */
//    await prisma.project.update({
//             where:{id:projectId , userId},
//             data:{
//                 erroe:error.message,
//                 isGenerating:false
//             }})
      

//     /**
//      * Refund credits on failure
//      */
//     if (isCreditsDeducted) {
//       await ClerkUser.updateOne(
//         { clerkUserId: userId },
//         { $inc: { credits: 10 } }
//       );
//     }
//         Sentry.captureException(error)
//         console.log(error)
//         res.status(500).json({
//             message:error.message
//         })
//     }
// }
// ai convert in mongoDb

// generate video using veo.3
export const createVideo = async (req: Request, res: Response) => {
  const { userId } = req.auth();
  const { projectId } = req.body;

  if (!userId || !projectId) {
    return res.status(400).json({ message: "Missing user or project" });
  }

  let creditsDeducted = false;
  let videoFilePath: string | null = null;

  /**
   *   ATOMIC CREDIT DEDUCTION (10 credits)
   */
  const updatedUser = await ClerkUser.findOneAndUpdate(
    {
      clerkUserId: userId,
      credits: { $gte: 10 },
    },
    {
      $inc: { credits: -10 },
    },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(401).json({ message: "Insufficient credits" });
  }

  creditsDeducted = true;

  try {
    /**
     * Fetch project (Mongoose)
     */
    const project = await Project.findOne({
      _id: projectId,
      clerkId: userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.isGenerating) {
      return res.status(409).json({ message: "Generation already in progress" });
    }

    if (project.generatedVideo) {
      return res.status(409).json({ message: "Video already generated" });
    }

    if (!project.generatedImage) {
      throw new Error("Generated image not found");
    }

    /**
     * Mark generating
     */
    project.isGenerating = true;
    await project.save();

    /**
     * Prepare prompt
     */
     

    const prompt = `make the person showcase the product which is ${project.productName}
           ${project.productDescription && `and Product Description: ${project.
            productDescription
           }`} `

    /**
     * Load image
     */
    const imageResponse = await axios.get(project.generatedImage, {
      responseType: "arraybuffer",
    });

    const imageBytes = Buffer.from(imageResponse.data);

    /**
     * Generate video
     */
    const model = "veo-3.1-generate-preview";

    let operation: any = await ai.models.generateVideos({
      model,
      prompt,
      image: {
        imageBytes: imageBytes.toString("base64"),
        mimeType: "image/png",
      },
      config: {
        aspectRatio: project.aspectRatio || "9:16",
        numberOfVideos: 1,
        resolution: "720p",
      },
    });

    /**
     * Polling
     */
    while (!operation.done) {
      console.log("Waiting for video generation...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    if (!operation?.response?.generatedVideo?.[0]) {
      throw new Error(
        operation?.response?.raiMediaFilterReasons?.[0] ||
          "Video generation failed"
      );
    }

    /**
     * Save video locally
     */
    const filename = `${userId}-${Date.now()}.mp4`;
    const videosDir = path.join(process.cwd(), "videos");
    videoFilePath = path.join(videosDir, filename);

    fs.mkdirSync(videosDir, { recursive: true });

    await ai.files.download({
      file: operation.response.generatedVideo[0].video,
      downloadPath: videoFilePath,
    });

    /**
     * Upload to Cloudinary
     */
    const uploadResult = await cloudinary.uploader.upload(videoFilePath, {
      resource_type: "video",
    });

    /**
     * Update project
     */
    project.generatedVideo = uploadResult.secure_url;
    project.isGenerating = false;
    project.error = undefined;
    await project.save();

    /**
     * Cleanup
     */
    fs.unlinkSync(videoFilePath);

    return res.json({
      message: "Video generated successfully",
      videoUrl: uploadResult.secure_url,
      creditsLeft: updatedUser.credits,
    });
  } catch (error: any) {
    /**
     * Mark project failed
     */
    await Project.findOneAndUpdate(
      { _id: projectId, clerkId: userId },
      {
        isGenerating: false,
        error: error.message,
      }
    );

    /**
     * Refund credits
     */
    if (creditsDeducted) {
      await ClerkUser.updateOne(
        { clerkUserId: userId },
        { $inc: { credits: 10 } }
      );
    }

    if (videoFilePath && fs.existsSync(videoFilePath)) {
      fs.unlinkSync(videoFilePath);
    }

    Sentry.captureException(error);
    console.error(error);

    return res.status(500).json({
      message: error.message || "Video generation failed",
    });
  }
};

// Show in Community 
export const getAllPublishedProject = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ isPublished: true })
      .sort({ createdAt: -1 }) // newest first
      .lean(); // faster read, returns plain JS objects

    res.status(200).json({ projects });
  } catch (error: any) {
    Sentry.captureException(error);
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch published projects",
    });
  }
};

export const deleteProject = async (req:Request, res:Response) => {
    try {
        const {projectId} = req.params;
        const {userId} = req.session;

      const project = await Project.findByIdAndDelete({ id:projectId, userId})
        if(!project){
            return res.status(404).json({message:'project not found'})
        }
        res.status(500).json({message:'project deleted successfully'})


    } catch (error:any) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}
 

