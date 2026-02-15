import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import type { Project } from "../AdsTypes"
import { dummyGenerations } from "../AdsAssets/assets"
import { ImageIcon, Loader2Icon, RefreshCwIcon, SparkleIcon, VideoIcon } from "lucide-react"
import SoftBackdrop from "../components/SoftBackdrop"
import { useAuth, useUser } from "@clerk/clerk-react"
import api from "../config/api"
import toast from "react-hot-toast"

const Result = () => {
    const {projectId} =  useParams()
    const {getToken} = useAuth()
    const {user, isLoaded} = useUser()
    const navigate = useNavigate()
    const [projectData, setProjectData] = useState<Project> ({} as Project)
    const [loading , setLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)

    // const fetchProjectData = async () => {
    //     setTimeout(()=>{
    //         setProjectData(dummyGenerations[0])
    //         setLoading(false)
    //     },3000)
    // }
    const fetchProjectData = async () => {
        try {
            const token =  await getToken()
            const {data} = await api.get(`/api/user/thumbnail/${projectId}`,{
                headers:{Authorization:`Bearer ${token}`}
            
            })
            setProjectData(data.project)
            setIsGenerating(data.project.isGenerating)
            setLoading(false)
        } catch (error:any) {
            toast.error(error?.response?.data?.message || error.message)
            console.log(error)
        }
        setTimeout(()=>{
            setProjectData(dummyGenerations[0])
            setLoading(false)
        },3000)
    }
    
    
    const handleGenerateVideo = async () => {
        setIsGenerating(true)
        try {
            const token = await getToken()
            const { data } = await api.post('/api/thumbnail/video',{projectId},{
                headers:{Authorization:`Bearer ${token}`}
            })

            setProjectData(prev =>({...prev, generatedVideo:data.videoUrl,
                isGenerating:false
            }))
            toast.success(data.message)
            setIsGenerating(false)
        } catch (error:any) {
            toast.error(error?.response?.data?.message || error.message)
            console.log(error)
        }

    }
    useEffect(()=>{
        if(user && !projectData.id){
            fetchProjectData()

        }else if(isLoaded && !user){
            navigate('/')
        }
        
    },[user])

    // fetch project every 10 second
    useEffect(()=>{
        if(user && isGenerating){
            const intervel = setInterval(()=>{
                fetchProjectData()
            },10000)
            return ()=> clearInterval(intervel)
        }
    },[user, isGenerating])
  return( 
  loading ? (
    <> 
<SoftBackdrop/>
    <div className="flex items-center justify-center w-full h-screen">
       <Loader2Icon className="animate-spin text-shadow-indigo-100 size-9"/>
    </div>
    </>
  ) :(
    <>  
<SoftBackdrop/>
   <div className="min-h-screen text-white p-6 md:p-12 mt-20">
    <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-medium">Generation Result </h1>
            <Link to='/generate-Ads'
            className="bg-white/10 p-3  me-4 rounded-lg text-sm text-white flex items-center gap-2 ">
            <RefreshCwIcon className="w-4 h-4" />
            <p className="max-sm:hidden">New Generation</p>
            </Link>
        </header>
        {/* grid layout */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* main Result display */}
            <div className="lg:col-span-2 space-y-6">
                <div className="p-2 glass-pannel inline-block rounded-2xl">
                    <div className={`${projectData.aspectRatio === '9:16' ? 'aspect-9/16' : 'aspect-video' } relative overflow-hidden
                    sm:max-h-200 rounded-xl bg-gray-900 ` }>
                        {
                            projectData?.generatedVideo ? (
                              <video
                              src={projectData.generatedVideo}
                              poster={projectData.productName}
                              autoPlay
                              controls
                              loop
                              className="cursor-pointer h-full w-full object-cover "
                               />

                            ) :(
                                <img
                                  src={projectData.generatedImage}
                                  alt={projectData.productName}
                                  className={`  h-full w-full object-cover cursor-pointer`}
                                 />

                            )
                        }
                    </div>
                </div>

            </div>
            {/* sidebar Action */}
            <div className="space-y-6">
                {/* download button */}
                <div className="bg-white/10 p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4">Actions</h3>
                    <div className="flex flex-col gap-3">
                        <a href={projectData.generatedImage} download>
                            <button 
                            disabled={!projectData.generatedImage}
                            className="
                             text-xs p-3 border border-white/10 bg-white/20  
                            w-full flex gap-2 justify-center rounded-md py-3
                            disabled:opacity-50 disabled:cursor-not-allowed">
                                <ImageIcon className="size-4.5"/>
                                Download Image
                            </button>
                        </a>
                        <a href={projectData.generatedVideo} download>
                            <button 
                            disabled={!projectData.generatedVideo }
                            className="
                             text-xs p-3 border border-white/10 bg-white/20  
                            w-full flex gap-2 justify-center rounded-md py-3
                            disabled:opacity-50 disabled:cursor-not-allowed">
                                <VideoIcon className="size-4.5"/>
                                Download Video 
                            </button>
                        </a>
                    </div>
                </div>
                {/* generate video button */}
                <div className="bg-white/10 p-6 rounded-2xl relative overflow-hidden
                ">
                    <div className="absolute top-0 right-0 p-4 opacity-10 ">
                        <VideoIcon className="size-24"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Video Magic</h3>
                    <p className="text-gray-400 text-sm mb-6">Turn this static image into a dynamic video 
                        for social media.  </p>
                        {
                            !projectData.generatedVideo ?(
                               <button 
                  className="w-full flex items-center justify-center rounded-xl border border-indigo-300/40 gap-1 bg-indigo-500 m-3 p-3"
                  onClick={handleGenerateVideo}
                  disabled={isGenerating}>
                    {
                        isGenerating ? (
                          <>Generating Video ... </>  
                        ) :(
                            <>  
                    <SparkleIcon className="size-4"/>Generated Video
                    </>
                        )
                    }
                  </button>
                            ):(
                                <div
                                className="p-3 bg-green-500/10 border border-green-500/20 
                                rounded-xl text-green-400 text-center text-sm font-medium"
                                >Video Generated Successfully!</div>
                            )
                        }
                </div>

            </div>

        </div>

    </div>

   </div>
   </>
  )
   )
}

export default Result