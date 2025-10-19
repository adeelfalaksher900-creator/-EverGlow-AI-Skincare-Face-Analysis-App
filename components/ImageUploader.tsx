import React, { useRef, useState } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageSelect: (imageBase64: string) => void;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragOver ? 'border-rose-500 bg-gray-800/50' : 'border-gray-600 hover:border-gray-500'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center text-gray-400">
        <UploadIcon className="w-12 h-12 mb-4" />
        <p className="font-semibold text-lg text-gray-200">Drag & drop your selfie here</p>
        <p>or click to upload</p>
        <p className="text-xs mt-2 text-gray-500">(PNG, JPG, WEBP up to 10MB)</p>
        <div className="my-4 text-gray-500 font-semibold">OR</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert("Camera functionality is a demo feature.");
          }}
          disabled={disabled}
          className="flex items-center justify-center bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Use Camera
        </button>
      </div>
    </div>
  );
};
