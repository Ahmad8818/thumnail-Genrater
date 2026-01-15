import { Square, RectangleHorizontal, RectangleVertical} from 'lucide-react';
import React  from 'react';
import { aspectRatios , type AspectRatio } from '../assets/assets';
const AspectRatioSelector = ({value, onChange}:{value:
    AspectRatio; onChange:(ratio:AspectRatio)=> void}) => {
  const iconMap = {
    '16:9':<RectangleHorizontal size={18}/>,
    '1:1': <Square size={18} />,
    '9:16': <RectangleVertical size={18} /> 


  } as Record<AspectRatio, React.ReactNode>

  return (
    <div className="space-y-3 dark ">
            <label className=" block text-sm font-medium text-zinc-200">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map((ratio)=>{
                const selected = value === ratio
                return(
                  <button
                  className={`flex items-center gap-2 rounded-md border
                    px-5 py-2.5 text-sm transition border-white/10
                    ${selected ? 'bg-white/10':'hover:bg-white/6' }`}
                  key={ratio}
                  type='button' 
                  onClick={()=>{onChange(ratio)}}>
                    {iconMap[ratio]}  
                    <span className='tracking-widest'>{ratio}</span>
                    
                  </button>  
                )
              })}
            </div>
          </div>
  )
}

export default AspectRatioSelector