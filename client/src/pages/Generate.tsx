import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SoftBackdrop from '../components/SoftBackdrop';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { colorSchemes, type AspectRatio, type IThumbnail, type ThumbnailStyle } from "../assets/assets";
import AspectRatioSelector from '../components/AspectRatioSelector';
import StyleSelector from '../components/StyleSelector';
import ColorSchemeSelector from '../components/ColorSchemeSelector';
import PreviewPannel from '../components/PreviewPannel';
import { userAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../config/api';

 

const Generate: React.FC = () => {
  // const [selectedScheme, setSelectedScheme] = useState('Vibrant');
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const {isLoggedIn} = userAuth()
  const {id} = useParams();
  const [title,setTitle] = useState('')
  const [additionalDatails,setAdditionalDatails] = useState('')
  const [thumbnail,setThumbnail] = useState<IThumbnail | null>(null)
  const [loading,setLoading] = useState(false)
  const [aspectRatios,SetAspectRatios] = useState<AspectRatio>('16:9')
  const [colorSchemeId,SetColorSchemeId] = useState<string>(colorSchemes[0].id)
  const [style,setStyle ] = useState<ThumbnailStyle>('Bold & Graphic')
  const [styleDropdownOpen,SetStyleDropdownOpen ] = useState(false)

  const handleGenerate = async () => {
    try {
      if(isLoggedIn) return toast.error('Please login to generate thumbnails')
      if(!title.trim()) return toast.error('Title is required')
        setLoading(true)

    const api_payload = {
      title, 
      prompt: additionalDatails,
      style,
      aspect_ratio: aspectRatios,
      color_scheme: colorSchemeId,
      text_overlay: true
    }
    setLoading(true)
    const {data} = await api.post('/api/thumbnail/generate', api_payload);
    if(data.thumbnail){
      navigate('/generate/' + data.thumbnail._id)
      toast.success(data.message)
    }
    } catch (error) {
      console.log(error)
      toast.error(' generation is temporarily unavailable due to API usage limits. Please try again shortly. ')

    } finally{
      setLoading(false)
    }
    

    
  }

const fetchThumbnail = async () => {
   
   try {
    const {data} = await api.get(`/api/user/thumbnail/${id}`);
    setThumbnail(data?.thumbnail as IThumbnail);
    setLoading(!data.thumbnail?.image_url);
    setAdditionalDatails(data?.thumbnail?.user_prompt)
    setTitle(data?.thumbnail?.title)
    SetColorSchemeId(data?.thumbnail?.color_scheme)
    SetAspectRatios(data?.thumbnail?.aspect_ratio)
    setStyle(data?.thumbnail?.style)

   } catch (error : any) {
    console.log(error)
    toast.error(error?.response?.data?.message || error?.message)
   } 
  }

useEffect(()=>{
  if(isLoggedIn &&id){
    fetchThumbnail()
  }
  if(id && loading&& isLoggedIn){
    const intervel = setInterval(() => {
      fetchThumbnail()
    },5000)
    return ()=> clearInterval(intervel)
  }

},[id, loading, isLoggedIn])

useEffect(()=>{
  if(!id && thumbnail){
    setThumbnail(null)

  }
},[pathname])

  return (
    <>  
    <SoftBackdrop/>
    <div className="pt-24 min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
         {/* Left Column: Form */}
        <div className={`space-y-6 ${id && 'pointer-events-none'} `}>
          <div className='p-6 rounded-2xl bg-white/8 border border-white/12
          shadow-xl space-y-6'>
            <div>
            <h2 className="text-xl font-bold text-zinc-100 mb-1">Create Your Thumbnail</h2>
            <p className="text-zinc-400 text-sm">Describe your vision and let AI bring it to life</p>

            </div>
             
          <div className="space-y-5">
               {/* Title Input */}
            <div className="space-y-2">
            <label className="block text-sm font-medium">Title or Topic</label>
            <input 
                type="text" 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                placeholder="e.g., 10 Tips for Better Sleep"
                className="w-full px-4 py-3 rounded-lg border
                border-white/12 bg-black/20
                text-sm text-zinc-100 placeholder:text-zinc-400
                focus:outline-none focus:ring-2
              focus:ring-pink-500 transition"
                maxLength={100}
              />
              <div className="flex justify-end">
              <span className="text-xs text-zinc-400">{title.length}/100</span>
              </div>
            </div>
               {/* Aspect Ratio */}
               <AspectRatioSelector 
               value={aspectRatios}
               onChange={SetAspectRatios}
               />
          

           {/* Style Dropdown */}
          <StyleSelector
          value={style}
          onChange={setStyle}
          isOpen={styleDropdownOpen}
          setIsOpen={SetStyleDropdownOpen}
          />

          {/* Color Schemes */}
          <ColorSchemeSelector
          value={colorSchemeId}
          onChange={SetColorSchemeId}
          />

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Model</label>
            <button className="w-full flex items-center justify-between bg-[#2a1f23] border border-white/10 rounded-xl px-4 py-3 text-sm">
              <span className="font-medium text-gray-300">Premium <span className="text-gray-500 ml-1 text-xs">(10 credits)</span></span>
              {/* <ChevronDown size={18} className="text-gray-500" /> */}
            </button>
          </div>

          {/* Additional Prompts */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Additional Prompts <span className="text-zinc-400 text-xs">(optional)</span></label>
            <textarea 
            value={additionalDatails}
            onChange={(e)=>setAdditionalDatails(e.target.value)}
            placeholder="Add any specific elements, mood, or style preferences..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg  border border-white/10 
            bg-white/6 text-zinc-100 placeholder:text-zinc-400
            focus:outline-none focus:ring-2 
            focus:ring-pink-500 resize-none transition"
            />
          </div>

          



          </div>

        

         {/* Action Button */}
          {
            !id && (
                <button 
                onClick={handleGenerate}
                className="text-[15px] w-full py-3.5 rounded-xl font-medium
                bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700
                disabled:cursor-not-allowed transition-colors"
                 >
                    {
                        loading ? 'Genrating ...'   : 'Generate Thumbnail'
                    }
             
          </button>

            ) 
          }
          
           
          </div>

        </div>

        {/* Right Column: Preview */}
        <div>
          <div className='p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl'>
          <h2 className='text-lg font-semibold text-zinc-100 '>Preview</h2>
          <PreviewPannel
          thumbnail={thumbnail}
          isLoading={loading}
          aspectRatio={aspectRatios}
          />
        </div>

        </div>
        
        
        </div>
    

      </main>
    </div>
    </>
  );
};

export default Generate;


