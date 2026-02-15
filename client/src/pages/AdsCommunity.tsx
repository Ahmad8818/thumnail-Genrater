
import SoftBackdrop from "../components/SoftBackdrop";
import { dummyGenerations } from "../AdsAssets/assets";
import { useEffect, useState } from "react";
import type { Project } from "../AdsTypes";
import { Loader2Icon } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";
 

export default function AdsCommunity() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // const fetchProject = async () => {
  //    try {
  //     const {data} = await api.get('/api/thumbnail/published')
  //     setProjects(data.projects)
  //     setLoading(false)
  //    } catch (error:any) {
  //     toast.error(error.response?.data?.message || error?.message)
  //     console.log(error.message)
  //    }
  // }
  const fetchProject = async () => {
  try {
    setLoading(true);
    // if (projects.isPublished  === true   ){
     setProjects(dummyGenerations)
      
    // }
          setLoading(false)

    

  } catch (error: any) {
    toast.error(error?.response?.data?.message || error.message);
  } finally {
    setLoading(false);
  }
};
  useEffect(()=>{
    fetchProject()
  },[])
  return (
    <> 
    <SoftBackdrop/>
    {
      loading ? 
      (<>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-400"/>
      </div>
      </>) :
      (<>
      <div className="min-h-screen m-6 pt-34 text-white">
      {/* Header */}
      <div className=" max-w-6xl mx-auto">
        <header className="mb-12"> 
        <h1 className="text-4xl font-semibold">Community</h1>
        <p className="text-white/60 mt-2">
          See what others are creating with AdVizi.ai
        </p>
        </header>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 ">        
        {
        projects.map((card)=>(
          <div key={card.id} className="mb-4 break-inside-avoid ">
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden 
        hover:border-white/20 transition group">
          {/* preview */}
          <div className={`${card.aspectRatio === '9:16' ? 'aspect-9/16' : 'aspect-video' } relative overflow-hidden` }>

          
           
           {
                card.generatedImage && (
                  <img
                src={card.generatedImage}
                alt={card.productName}
                // className="h-full w-full object-cover group-hover:opacity-0 transition-opacity duration-500"
                className={`absolute inset-0 h-full w-full object-cover cursor-pointer  transition duration-500 ${card.generatedVideo ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
              />

                )
              }
            {
              card.generatedVideo && (
                <video
                src={card.generatedVideo}
                poster={card.productName}
                muted
                loop
                playsInline
                className="absolute cursor-pointer inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition  duration-500"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />

              )
            }
            {
              (!card.generatedImage && !card.generatedVideo) && (
                <div className="absolute inset-0 w-full h-full flex flex-col *:items-center 
                justify-center bg-black/20">
                  <Loader2Icon className="size-7 animate-spin"/>
                </div>
              )
            }
            {/* status badge */}
            <div className="absolute left-3 top-3 flex gap-2 items-center ">
              {
                card.isGenerating &&(
              <span className="text-xs px-2 py-1 bg-yellow-600/30
              rounded-full">Generating...</span>
                )
              }
               {
                card.isPublished &&(
              <span className="text-xs px-2 py-1 bg-green-600/30
              rounded-full">Published...</span>
                )
              }

            </div>
            {/* source Images */}
            <div className="absolute right-3 bottom-3">
              <img src={card.uploadedImages[0]} alt="Product" className="w-16 h-16 object-cover
              rounded-full  float" />
              <img src={card.uploadedImages[1]} alt="model" className="w-16 h-16 object-cover
              rounded-full  float -ml-8" style={{animationDelay:'3s'}} />
            </div>

            </div>
            {/* product name date aspectRatio */}
           <div className="p-5 space-y-6">
               <div className="flex items-start justify-between gap-4">
                <div className="flex-1">

                
                 <h3 className="text-lg font-medium">{card.productName}</h3>
                 <p 
                 className="text-sm text-gray-400">
                  Created:{new Date(card.createdAt).toLocaleString()} </p>
                 {card.updatedAt &&(
                 <p
                 className="text-sm text-gray-400"
                 >Updated:{new Date(card.updatedAt).toLocaleString()} </p>
                 )}
                 </div>
                 <div className=" text-right">
                  <div className="mt-2 flex flex-col items-end gap-1">
                    <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                   Aspect: {card.aspectRatio}
                 </span>

                  </div>
                  


                 </div>
                 
               </div>
               
             </div>
             {/* prosuct description */}
             {/* {
              card.productDescription && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Description</p>
               <div className="text-sm text-gray-300 bg-white/3 p-2 
               rounded-md wrap-break-word ">{card.productDescription}</div>

               </div>

              )
             } */}
             {/* user Prompt */}
             {/* {
              card.userPrompt && (
                <div className="mt-2">
               <div className="text-sm text-gray-300   p-2 
               ">{card.userPrompt}</div>

               </div>

              )
             } */}
               
               

        </div>
      </div>

        ))
      }

      </div>

      
      
     
    </div>
      </>)
    }
    
     </>
  );
}

 

 
 
