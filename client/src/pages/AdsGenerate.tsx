import React, { useState  } from 'react';
import {  Smartphone, Monitor, Wand2, Loader2Icon,  } from 'lucide-react';
import SoftBackdrop from '../components/SoftBackdrop';
import ImageUploadZone from '../components/ImageUploadZone';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../config/api';

// --- Types ---
type AspectRatio = '9:16' | '16:9';

interface FormDataState {
  name: string;
  productName: string;
  productDescription: string;
  aspectRatio: AspectRatio;
  userPrompt: string;
}


// --- Main Page Component ---
const AdsGenerate: React.FC = () => {
  const user = useUser()
  const {getToken} = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    productName: '',
    productDescription: '',
    aspectRatio: '9:16',
    userPrompt: '',
  });
  const [isGenerating, setIsGenerating] = useState(false)

  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);

  // const handleFileChange = (
  //   e: React.ChangeEvent<HTMLInputElement>, type:'product' | 'model')=>{
  //     if(e.target.files && e.target.files[0]){
  //          if(type === 'product'){
  //           setProductImage(e.target.files[0])
  //          }else{
  //           setModelImage(e.target.files[0])
  //          }
  //     }
  // }
  



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setFormData((prev) => ({ ...prev, aspectRatio: ratio }));
  };

  // Standard Form Submission Logic
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page reload
    if(!user) return toast('Please login to generate ')
      if(!productImage || !modelImage || !formData.name || !formData.productName
        || !formData.aspectRatio
      ) return toast('Please fill all the required fields')
     try {
      const dataToSend = new FormData();

    // 2. Append text fields from your formData state
    dataToSend.append('name', formData.name);
    dataToSend.append('aspectRatio', formData.aspectRatio);
    dataToSend.append('userPrompt', formData.userPrompt || "");
    dataToSend.append('productName', formData.productName);
    dataToSend.append('productDescription', formData.productDescription || "");
    dataToSend.append('images', productImage);
    dataToSend.append('images', modelImage);
    const token =  await getToken()
      setIsGenerating(true)

    const {data} = await api.post('/api/thumbnail/create',dataToSend,{
      headers:{Authorization:`Bearer ${token}`}
    })
    toast.success(data.message)
    navigate('/result/' + data.projectId )
       
     } catch (error:any) {
      // toast.error(error?.response?.data?.message || error.message)
      toast.error(' generation is temporarily unavailable due to API usage limits. Please try again shortly.')
     } finally {
      setIsGenerating(false)
     }
  };

  const inputBaseStyles = "w-full bg-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 border border-transparent focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 hover:border-gray-500";
  const labelBaseStyles = "block text-sm text-gray-300 mb-2 ml-1";

  return (
    <div className="!pt-34 min-h-screen p-6 md:p-12 flex justify-center relative">
      <SoftBackdrop />
      
      <div className="max-w-5xl w-full z-10">
        <header className="text-center mb-12">
          <h1 className="text-2xl md:text-5xl font-medium text-white mb-4">Create In-Context Image</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload your model and product images to generate stunning UGC and social media posts.
          </p>
        </header>

        {/* --- FORM WRAPPER --- */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <ImageUploadZone
                title="Product Image"
                file={productImage}
                setFile={setProductImage}
              />
              <ImageUploadZone
                title="Model Image"
                file={modelImage}
                setFile={setModelImage}
              />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <label htmlFor="name" className={labelBaseStyles}>Project Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required // Added basic validation
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name your project"
                  className={inputBaseStyles}
                />
              </div>

              <div>
                <label htmlFor="productName" className={labelBaseStyles}>Product Name</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter the name of the product"
                  className={inputBaseStyles}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label htmlFor="productDescription" className="block text-sm font-medium text-gray-300">Product Description</label>
                  <span className="text-xs text-purple-400">(optional)</span>
                </div>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter the description of the product"
                  className={`${inputBaseStyles} resize-none`}
                />
              </div>

              <div>
                <label className={labelBaseStyles}>Aspect Ratio</label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button" // Prevents submit
                    onClick={() => handleAspectRatioChange('9:16')}
                    className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all duration-200 
                      ${formData.aspectRatio === '9:16'
                        ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500 bg-[#1A1A2E]'
                      }`}
                  >
                    <Smartphone size={28} />
                  </button>

                  <button
                    type="button" // Prevents submit
                    onClick={() => handleAspectRatioChange('16:9')}
                    className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all duration-200
                      ${formData.aspectRatio === '16:9'
                        ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500 bg-[#1A1A2E]'
                      }`}
                  >
                    <Monitor size={28} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label htmlFor="userPrompt" className="block text-sm font-medium text-gray-300">User Prompt</label>
                  <span className="text-xs text-purple-400">(optional)</span>
                </div>
                <textarea
                  id="userPrompt"
                  name="userPrompt"
                  value={formData.userPrompt}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe how you want the narration to be."
                  className={`${inputBaseStyles} resize-none`}
                />
              </div>

              <div className="mt-6 flex justify-center lg:justify-start">
                <button
                  type="submit" // Triggers form onSubmit
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-pink-600 text-white font-semibold py-3 px-8 rounded-full
                  hover:from-indigo-500 hover:to-pink-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]
                  active:scale-95 transition-all duration-300"
                >
                  {
                    isGenerating ?
                    (<>
                    <Loader2Icon className='size-5 animate-spin'/>
                    Generating...
                    </>) :
                    (<>
                     <Wand2 size={20} />
                     Generate Image
                    </>)
                  }
                 
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdsGenerate;