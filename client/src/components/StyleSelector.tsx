import { SquareIcon, ImageIcon, PenToolIcon, CpuIcon, SparkleIcon, ChevronDownIcon } from 'lucide-react';
import { thumbnailStyles, type ThumbnailStyle } from '../assets/assets';
import type React from 'react';

const StyleSelector = ({value, onChange ,isOpen ,setIsOpen}:
    {value:ThumbnailStyle;
    onChange:(style:ThumbnailStyle)=> void;
    isOpen:boolean;
    setIsOpen:(open: boolean)=>void}) => {

    const styleDescriptions: Record<ThumbnailStyle, string> = {
        "Bold & Graphic" : "High contrast, bold typography, striking visuals",
        "Minimalist" : "Clean simple, lots of white space",
        "Photorealistic" : "Photo-based, natural looking",
        "Illustrated" : "Hand-drawn, artistic, creative",
        "Tech/Futuristic" : "Modern, sleek, tech-inspired",
    }
    const styleIcons : Record<ThumbnailStyle, React.ReactNode> = {
        "Bold & Graphic" : <SparkleIcon  className="h-4 w-4" />,
        "Minimalist" :<SquareIcon  className="h-4 w-4" /> ,
        "Photorealistic" :<ImageIcon  className="h-4 w-4" /> ,
        "Illustrated" :<PenToolIcon  className="h-4 w-4" /> ,
        "Tech/Futuristic" : <CpuIcon  className="h-4 w-4" />,
    }
  return (
    <div className="space-y-3 relative dark">
        <label className="text-sm font-medium block">Thumbnail Style</label>
        <button
         className="w-full flex items-center justify-between
        bg-white/8 border border-white/10
        rounded-md px-4 py-3 hover:bg-white/12 transition 
        text-left text-zinc-200"
        type='button'
        onClick={()=>setIsOpen(!isOpen)}   
           >
          <div className="Space-y-1">
           <div className='flex items-center gap-2 font-medium'>
            {styleIcons[value]}
            <span>{value}</span>
           </div>
           <p className='text-xs text-zinc-400'>{styleDescriptions[value]}</p>

          </div>
          
          <ChevronDownIcon size={18} className={["h-5 w-5 text-zinc-400 transition transform",
            isOpen && 'rotate-180'].join(' ')} />
        </button>
        {isOpen && (
            <div className='absolute bottom-0 z-50 mt-1 w-full rounded-md border
            border-white/12 bg-black/20 backdrop-blur-3xl shadow-lg'>
                {thumbnailStyles.map((style)=>(
                    <button 
                    key={style}
                    type='button'
                    onClick={()=>{onChange(style); setIsOpen(false)}}
                    className='flex items-start gap-3 px-4 py-3 text-left w-full
                    transition hover:bg-black/30 '>
                        <div className='mt-0.5'>{styleIcons[style]}</div>
                        <div>
                            <p className='font-medium'>{style}</p>
                            <p className='text-xs text-zinc-400'>{styleDescriptions[style]}</p>

                        </div>
                        


                    </button>
                ))}
            </div>
        ) }
    </div>
  )
}

export default StyleSelector