import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import updateProfileDocument from '../lib/uploadDocuments'

const FileUploader = ({ user, type }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
        console.log(droppedFile);
        console.log(user)
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
        updateProfileDocument( e.target.files[0], type)
        setFile( e.target.files[0])
    }
  };

  const removeFile = () => {
    setFile(null);
    inputRef.current.value = '';
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${file ? 'border-green-500 bg-green-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
        />

        {!file && (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            
            <p className="mt-4 text-lg font-medium text-gray-100">
              Drag and drop your file here
            </p>
            
            <p className="mt-2 text-sm text-gray-100">
              or
            </p>
            
            <button
              onClick={onButtonClick}
              className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300 mt-2"
            >
              Select File
            </button>
          </>
        )}

        {file && (
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {file.name}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <button
              onClick={removeFile}
              className="p-1 text-gray-500 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;