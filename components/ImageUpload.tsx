
import React, { useRef, useState } from 'react';
import { UI_STRINGS_TR } from '../constants';
import { UploadIcon } from './icons';
import Spinner from './Spinner';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="text-center p-8 max-w-2xl w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">{UI_STRINGS_TR.appTitle}</h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">{UI_STRINGS_TR.appSubtitle}</p>
      
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative w-full p-10 border-4 border-dashed rounded-xl cursor-pointer transition-colors duration-300
          ${dragActive ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Spinner />
            <p className="mt-4 text-lg font-semibold text-indigo-600 dark:text-indigo-300">{UI_STRINGS_TR.analyzing}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-gray-500 dark:text-gray-400">
            <UploadIcon className="w-16 h-16" />
            <p className="text-xl font-semibold">{UI_STRINGS_TR.uploadPrompt}</p>
            <p>veya sürükleyip bırakın</p>
            <span className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              {UI_STRINGS_TR.uploadButton}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
