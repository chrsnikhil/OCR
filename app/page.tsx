'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import OCRProgress from '@/components/OCRProgress'
import OCRResults from '@/components/OCRResults'

type AppState = 'upload' | 'analyzing' | 'results'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload')
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selectedImageName, setSelectedImageName] = useState<string>('')

  const handleImageSelect = (imageUrl: string, imageName: string) => {
    setSelectedImage(imageUrl)
    setSelectedImageName(imageName)
    setAppState('analyzing')
  }

  const handleAnalysisComplete = () => {
    setAppState('results')
  }

  const handleReset = () => {
    setAppState('upload')
    setSelectedImage('')
    setSelectedImageName('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Advanced OCR System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform handwritten documents into digital text with our cutting-edge optical character recognition technology
          </p>
        </div>

        {/* Main Content */}
        {appState === 'upload' && (
          <ImageUpload onImageSelect={handleImageSelect} />
        )}

        {appState === 'analyzing' && (
          <OCRProgress 
            isAnalyzing={true} 
            onComplete={handleAnalysisComplete} 
          />
        )}

        {appState === 'results' && (
          <OCRResults 
            imageUrl={selectedImage}
            imageName={selectedImageName}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  )
}
