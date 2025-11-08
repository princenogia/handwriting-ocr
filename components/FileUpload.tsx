'use client'

import { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onTextExtracted: (text: string) => void
  setIsProcessing: (processing: boolean) => void
  setProgress: (progress: number) => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function FileUpload({
  onTextExtracted,
  setIsProcessing,
  setProgress,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  /** 🖼️ Process image **/
  const processImageWithGemini = async (file: File) => {
    setIsProcessing(true)
    setProgress(10)
    onTextExtracted('')

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string
        setProgress(30)

        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData, mimeType: file.type }),
        })

        if (!response.ok) throw new Error('Failed to process image')

        const data = await response.json()
        onTextExtracted(data.text || 'No text found.')
        setProgress(100)
      }

      reader.onerror = () => {
        throw new Error('Failed to read file')
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Image OCR error:', error)
      onTextExtracted('Error processing image. Please try again.')
      setProgress(0)
    } finally {
      setTimeout(() => setIsProcessing(false), 500)
    }
  }

  /** 📄 Process PDF safely with lazy-loaded pdfjs-dist **/
  const processPDFWithGemini = async (file: File) => {
    setIsProcessing(true);
    setProgress(10);
    onTextExtracted("");
  
    try {
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        setProgress(40);
  
        // ✅ Send to your backend route (/api/pdf)
        const response = await fetch("/api/pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileData: base64 }),
        });
  
        if (!response.ok) throw new Error("Failed to process PDF");
  
        const data = await response.json();
        onTextExtracted(data.text || "No text found in PDF.");
        setProgress(100);
      };
  
      reader.onerror = () => {
        throw new Error("Failed to read file");
      };
  
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing PDF:", error);
      onTextExtracted("Error processing PDF. Please try again.");
      setProgress(0);
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };
  

  /** 🧩 Handle file input **/
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
  
    const file = acceptedFiles[0];
  
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 10MB limit. Please choose a smaller file.");
      return;
    }
  
    if (file.type === "application/pdf") {
      processPDFWithGemini(file); // ✅ triggers /api/pdf
    } else if (file.type.startsWith("image/")) {
      processImageWithGemini(file); // ✅ triggers /api/ocr
    } else {
      alert("Please upload a valid image (PNG, JPG, JPEG) or PDF file.");
    }
  }, []);
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'], 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  })

  const handleBrowseClick = () => fileInputRef.current?.click()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 transition-colors duration-200">
      <div
        {...getRootProps()}
        className={`text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? 'opacity-70' : ''
        }`}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isDragActive
                ? 'bg-blue-100 dark:bg-blue-900'
                : 'bg-blue-50 dark:bg-blue-900/30'
            }`}
          >
            <svg
              className="w-10 h-10 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Drop files here or click to browse
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Upload handwritten documents for text extraction
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleBrowseClick()
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 mb-6"
        >
          Browse Files
        </button>

        <div className="flex items-center justify-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              JPG, PNG
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              PDF
            </span>
          </div>
          <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Max 10MB
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
