import React, { useCallback, useState } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';

const FileUpload = ({ onFileSelect, isAnalyzing, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file) => {
    // Validate file type
    if (!file.name.endsWith('.sol') && !file.name.endsWith('.vy')) {
      alert('Please select a Solidity (.sol) or Vyper (.vy) file');
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      alert('File too large. Maximum size is 50MB');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".sol,.vy"
          onChange={handleFileInput}
          disabled={isAnalyzing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragging
                ? 'Drop your contract file here'
                : 'Upload your smart contract'
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Drag and drop your .sol or .vy file, or click to browse
            </p>
          </div>

          <div className="text-xs text-gray-400">
            <p>Supported formats: Solidity (.sol), Vyper (.vy)</p>
            <p>Maximum file size: 50MB</p>
          </div>
        </div>
      </div>

      {/* Selected File Info */}
      {selectedFile && !isAnalyzing && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <File className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-blue-700">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Upload Error</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Tips */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          💡 Quick Start Tips
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">1</span>
            <span>Upload your Solidity contract (.sol file)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">2</span>
            <span>AI analyzes for vulnerabilities in 15-30 seconds</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            <span>Get detailed security report with fix suggestions</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">4</span>
            <span>Download comprehensive audit report</span>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-green-600 font-bold">✓</span>
          </div>
          <p className="text-xs font-medium text-gray-900">AI-Powered</p>
          <p className="text-xs text-gray-500">GPT-4 analysis</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-blue-600 font-bold">⚡</span>
          </div>
          <p className="text-xs font-medium text-gray-900">Fast Analysis</p>
          <p className="text-xs text-gray-500">30 second results</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-purple-600 font-bold">🛡️</span>
          </div>
          <p className="text-xs font-medium text-gray-900">Comprehensive</p>
          <p className="text-xs text-gray-500">9+ vulnerability types</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;