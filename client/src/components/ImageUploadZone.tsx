
import React, {  useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload , X } from 'lucide-react';
import type { ImageUploadZoneProps } from '../AdsTypes';


// interface ImageUploadZoneProps {
//   title: string;
//   file: File | null ;
//   setFile: (file: File | null) => void;
// //   onClear:()=>void;
// //   onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
// }

const ImageUploadZone = ({ title, file, setFile, 
    //  onChange,
    //  onClear
      } : ImageUploadZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { 
    getRootProps,
     getInputProps,
      isDragActive
     } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div
      {...getRootProps()}
      className={`relative h-64 w-full rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer group
        ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-400 hover:bg-white/5'}
        flex flex-col items-center justify-center p-4 text-center overflow-hidden`}
    >
      <input {...getInputProps()} />

      {previewUrl ? (
        <>
          <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-white font-medium truncate max-w-[90%]">{file?.name}</p>
            <button
              type="button" // Important: specify type="button" so it doesn't trigger form submit
              onClick={removeFile}
              className="mt-2 p-1 bg-red-500/80 rounded-full hover:bg-red-600 transition text-white"
            >
              <X size={20} />
            </button>
             
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 p-4 rounded-full bg-white/5 text-gray-300 group-hover:text-purple-300 group-hover:scale-110 transition-all">
            <Upload size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
        </>
      )}
    </div>
  );
};
export default ImageUploadZone
