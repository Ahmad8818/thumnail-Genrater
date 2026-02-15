
import SoftBackdrop from "../components/SoftBackdrop";
// import { dummyGenerations } from "../AdsAssets/assets";
import { useEffect, useState } from "react";
import type { Project } from "../AdsTypes";
import { EllipsisIcon, ImageIcon, Loader2Icon, PlaySquareIcon, Share2Icon, Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../config/api";
import toast from "react-hot-toast";
 

export default function AdsMyGeneration() {
  const {user, isLoaded} = useUser();
  const {getToken} = useAuth();
  const [generation, setGeneration] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [menuOpen,setMenuOpen] = useState(false)
  const [forCommunity,setForCommunity] = useState(false)

  

  const fetchMyGeneration = async () => {
     try {
      const token = getToken()
      const {data} = await api.get(`/api/user/projects`,{
        headers:{Authorization:`Bearer ${token}`}
      })
      setGeneration(data.projects)
      setLoading(false)

     } catch (error:any) {
      // toast.error(error?.response?.data?.message || error?.message)
      toast.error('no Product Found Please generate first')
      console.log(error)
     } finally {
      setLoading(false)
     }
  }
  useEffect(()=>{
    if(user){
    fetchMyGeneration()
    }else if(isLoaded && !user){
      navigate('/')
    }
  },[user])


  const handleDelete = async (id:string) => {
    const confirm = window.confirm('Are you shure ypu want to delete this project?');
    if(!confirm) return
    try {
      const token = getToken();
      const { data } = await api.delete(`/api/thumbnail/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
      })
      setGeneration((generation)=> generation.filter((gen)=>gen.id !== id) )
      toast.success(data.message)
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error?.message)
      console.log(error)
    }
  }
  const togglePublished = async (projectId:string) => {   
     try {
      const token = getToken();
      const { data } = await api.get(`/api/user/published/${projectId}`,{
        headers:{Authorization:`Bearer ${token}`}
      })
      setGeneration((generation)=> generation.map((gen)=> gen.id === projectId ? {...gen, isPulished: data.isPublished}: gen))
      toast.success(data.isPublished ? 'project published' :'project unPublished' )
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error?.message)
      console.log(error)
    }
  }
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
        <h1 className="text-4xl font-semibold">My Generation</h1>
        <p className="text-white/60 mt-2">
          view and manage your Ai-generated Content
        </p>
        </header>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 ">        
        {
        generation.map((card)=>(
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
            {/* action menu for my-generation only access this  */}
            {
              !forCommunity &&(
                <div
                onMouseDownCapture={()=>{setMenuOpen(true)}}
                onMouseLeave={()=>{setMenuOpen(false)}}
                 className="absolute right-3 top-3 sm:opacity-0
            group-hover:opacity-100 transition flex items-center gap-2">
             <div className="absolute top-3 right-3">
              <EllipsisIcon className="ml-auto bg-black/10 rounded-full p-1 size-7"/>
             </div>
             <div className="flex flex-col items-end w-32 text-sm">
              <ul className={`text-xs ${menuOpen ? 'block' : 'hidden'}
              verflow-hidden right-0 peer-focus:block hover:block w-40 
              bg-black/50 backdrop-blur text-white border border-gray-500/50
               rounded-lg shadow-md mt-2 py-1 z-10 `}>
                {
                  card.generatedImage && 
                  <a href="#" 
                  download 
                  className="flex gap-2 items-center px-4 py-2 
                  hover:bg-black/10 cursor-pointer">
                    <ImageIcon  size={14}/>Download Image</a>
                }
                {
                  card.generatedVideo && 
                  <a href="#" 
                  download 
                  className="flex gap-2 items-center px-4 py-2 
                  hover:bg-black/10 cursor-pointer">
                    <PlaySquareIcon  size={14}/>Download Video</a>
                }
                {
                  (card.generatedVideo || card.generatedImage) && 
                  <>  
                  <button
                  onClick={()=>navigator.share(
                    {url:card.generatedVideo ||
                      card.generatedImage,
                      title:card.productName,
                      text:card.productDescription
                    
                  })}
                  className="w-full flex gap-2 items-center px-4 py-2 hover:bg-black/10
                  cursor-pointer"
                  >
                    <Share2Icon size={14}/>
                    Share

                  </button>
                  <button
                  onClick={()=>handleDelete(card.id)}
                  className="w-full flex gap-2 items-center px-4 py-2
                  hover:bg-red-950/10 text-red-400 cursor-pointer"> 
                    <Trash2Icon size={14}/>
                    Delete
                  </button>
                  </>
                  
                }

              </ul>

             </div>

            </div>

              )
            }
            


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
             {
              card.productDescription && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Description</p>
               <div className="text-sm text-gray-300 bg-white/3 p-2 
               rounded-md wrap-break-word ">{card.productDescription}</div>

               </div>

              )
             }
             {/* user Prompt */}
             {
              card.userPrompt && (
                <div className="mt-2">
               <div className="text-sm text-gray-300   p-2 
               ">{card.userPrompt}</div>

               </div>

              )
             }


             {/* buttons */}
             {
              !forCommunity && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  
                  <button 
                  onClick={()=>{navigate(`/result/${card.id}`); scrollTo(0,0)}}
                  className="m-3 text-xs justify-center p-3 border border-white/10 bg-black/40 rounded-4xl">
                    View Details
                  </button>
                  <button 
                  className="rounded-md bg-indigo-500 m-3 p-3"
                  onClick={()=>togglePublished(card.id)}>
                    { card.isPublished ? 'Unpublished': ' published'}
                  </button>

                </div>
              )
             }
               
               

        </div>
      </div>

        ))
      }
      </div>
      {
        generation.length === 0 &&(
          <div className="text-center py-20 bg-white/5 rounded-xl
          border border-white/10">
            <h3 className="text-xl font-medium mb-2">No Generation yet</h3>
          <p className="text-gray-400 mb-6">Start creating product photo today </p>
          <button 
          className="bg-indigo-500 rounded-4xl text-white font-medium p-2"
          onClick={()=> navigate('/generate-Ads')} > Create New Generation</button>
          </div>
          
        )
      }

      
      
     
    </div>
      </>)
    }
    
     </>
  );
}




 