'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface OCRProgressProps {
  isAnalyzing: boolean
  onComplete: () => void
}

interface AnalysisStage {
  id: string
  name: string
  description: string
  duration: number
  icon: string
}

const analysisStages: AnalysisStage[] = [
  {
    id: 'preprocessing',
    name: 'Image Preprocessing',
    description: 'Enhancing image quality and removing noise',
    duration: 2000,
    icon: '🔧'
  },
  {
    id: 'detection',
    name: 'Text Detection',
    description: 'Identifying text regions and bounding boxes',
    duration: 3000,
    icon: '🔍'
  },
  {
    id: 'recognition',
    name: 'Character Recognition',
    description: 'Converting handwritten text to digital characters',
    duration: 4000,
    icon: '📝'
  },
  {
    id: 'language',
    name: 'Language Processing',
    description: 'Analyzing Hindi script and context',
    duration: 2500,
    icon: '🌐'
  },
  {
    id: 'validation',
    name: 'Result Validation',
    description: 'Cross-referencing and accuracy verification',
    duration: 2000,
    icon: '✅'
  }
]

export default function OCRProgress({ isAnalyzing, onComplete }: OCRProgressProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStage(0)
      setProgress(0)
      setIsComplete(false)
      return
    }

    let totalDuration = 0
    let currentProgress = 0

    const runAnalysis = async () => {
      for (let i = 0; i < analysisStages.length; i++) {
        setCurrentStage(i)
        
        // Animate progress for this stage
        const stageDuration = analysisStages[i].duration
        const startProgress = currentProgress
        const endProgress = ((i + 1) / analysisStages.length) * 100
        
        const progressInterval = setInterval(() => {
          currentProgress += (endProgress - startProgress) / (stageDuration / 50)
          if (currentProgress >= endProgress) {
            currentProgress = endProgress
            clearInterval(progressInterval)
          }
          setProgress(currentProgress)
        }, 50)

        await new Promise(resolve => setTimeout(resolve, stageDuration))
        clearInterval(progressInterval)
        setProgress(endProgress)
      }

      setIsComplete(true)
      setTimeout(() => {
        onComplete()
      }, 1000)
    }

    runAnalysis()
  }, [isAnalyzing, onComplete])

  if (!isAnalyzing && !isComplete) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto p-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl">🤖</span>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              OCR Analysis in Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced AI is processing your document
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Current Stage */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mr-3"
                />
                <span className="text-3xl">{analysisStages[currentStage]?.icon}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {analysisStages[currentStage]?.name}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {analysisStages[currentStage]?.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Stage Indicators */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {analysisStages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStage
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-center mt-6"
            >
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Analysis Complete!
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
