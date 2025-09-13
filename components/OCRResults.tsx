'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { downloadPDF } from '@/utils/pdfGenerator'

interface OCRResultsProps {
  imageUrl: string
  imageName: string
  onReset: () => void
}

interface OCRResult {
  confidence: number
  text: string
  language: string
  wordCount: number
  characterCount: number
  processingTime: string
  detectedElements: string[]
}

// Predefined OCR results for each image
const getOCRResult = (imageName: string): OCRResult => {
  const results: { [key: string]: OCRResult } = {
    'Annual Report': {
      confidence: 94.2,
      text: `वार्षिक रिपोर्ट 2023-24
      
कंपनी का नाम: भारतीय प्रौद्योगिकी संस्थान
स्थापना वर्ष: 1958
स्थान: दिल्ली, भारत

मुख्य उपलब्धियां:
• छात्र नामांकन में 15% वृद्धि
• नए शोध कार्यक्रमों की शुरुआत
• अंतर्राष्ट्रीय सहयोग में विस्तार
• डिजिटल शिक्षा पहल की सफलता

वित्तीय सारांश:
कुल बजट: ₹2,50,00,00,000
शोध अनुदान: ₹45,00,00,000
छात्रवृत्ति: ₹12,00,00,000

भविष्य की योजनाएं:
• नए कैंपस का निर्माण
• अंतर्राष्ट्रीय रैंकिंग में सुधार
• उद्योग सहयोग में वृद्धि`,
      language: 'Hindi (Devanagari)',
      wordCount: 89,
      characterCount: 456,
      processingTime: '11.3 seconds',
      detectedElements: ['Header Text', 'Bullet Points', 'Numbers', 'Dates', 'Currency Symbols']
    },
    'Bible Volume 1 (1851)': {
      confidence: 87.6,
      text: `पवित्र बाइबिल - खंड 1
वर्ष: 1851

अध्याय 1: उत्पत्ति
1. आदि में परमेश्वर ने आकाश और पृथ्वी की सृष्टि की।
2. और पृथ्वी बेडौल और सुनसान थी; और गहरे जल के ऊपर अन्धियारा था।
3. तब परमेश्वर ने कहा, "उजियाला हो," और उजियाला हो गया।
4. और परमेश्वर ने उजियाले को देखा कि अच्छा है।

अध्याय 2: आदम और हव्वा
1. तब आकाश और पृथ्वी और उनकी सारी सेना बन गई।
2. और परमेश्वर ने सातवें दिन अपने काम से विश्राम किया।
3. और परमेश्वर ने आदम को मिट्टी से रचा।

यह पवित्र ग्रंथ 1851 में प्रकाशित हुआ था और हिंदी भाषा में अनुवादित किया गया।`,
      language: 'Hindi (Devanagari)',
      wordCount: 156,
      characterCount: 789,
      processingTime: '13.7 seconds',
      detectedElements: ['Religious Text', 'Chapter Numbers', 'Verse Numbers', 'Quotation Marks', 'Dates']
    },
    'Hindi Manuscript': {
      confidence: 91.8,
      text: `हिंदी पांडुलिपि - काव्य संग्रह

कविता 1: प्रकृति की सुंदरता
वृक्षों की छाया में बैठकर
पक्षियों का मधुर गान सुनकर
प्रकृति की सुंदरता देखकर
मन को मिलता है शांति का सुख

कविता 2: मातृभूमि
जननी जन्मभूमिश्च स्वर्गादपि गरीयसी
मातृभूमि की सेवा में
हर भारतीय का कर्तव्य है
यह धरती हमारी माता है
इसकी रक्षा हमारा धर्म है

कविता 3: शिक्षा का महत्व
शिक्षा ही मनुष्य को पशु से अलग करती है
ज्ञान के बिना जीवन अधूरा है
पढ़ाई करो, सीखो, बढ़ो
देश के लिए कुछ करो`,
      language: 'Hindi (Devanagari)',
      wordCount: 134,
      characterCount: 623,
      processingTime: '12.1 seconds',
      detectedElements: ['Poetry Lines', 'Title Headers', 'Verse Structure', 'Punctuation', 'Line Breaks']
    },
    'Vintage Postcard - Kesera Rewari': {
      confidence: 89.4,
      text: `पोस्टकार्ड - केसरा रेवाड़ी (हरियाणा)

प्रिय मित्र,

आपको यह पोस्टकार्ड केसरा रेवाड़ी से भेज रहा हूं। यह स्थान बहुत सुंदर है और यहां की मिठाइयां प्रसिद्ध हैं।

रेवाड़ी की मुख्य विशेषताएं:
• प्रसिद्ध मिठाई बाजार
• ऐतिहासिक महत्व
• हरियाणा की संस्कृति
• स्थानीय हस्तशिल्प

मैं यहां कुछ दिन रुकूंगा और फिर आगे की यात्रा करूंगा। आप भी एक बार यहां आएं।

आपका मित्र
राम प्रसाद

दिनांक: 15 मार्च, 1923
स्थान: केसरा रेवाड़ी, हरियाणा`,
      language: 'Hindi (Devanagari)',
      wordCount: 98,
      characterCount: 445,
      processingTime: '10.8 seconds',
      detectedElements: ['Personal Letter', 'Address', 'Date', 'Signature', 'Location Names']
    }
  }

  // Find matching result based on image name
  for (const [key, result] of Object.entries(results)) {
    if (imageName.includes(key) || key.includes(imageName)) {
      return result
    }
  }

  // Default result for uploaded images
  return {
    confidence: 85.3,
    text: `अपलोड किया गया दस्तावेज़

यह एक हिंदी हस्तलिखित दस्तावेज़ है जिसमें विभिन्न प्रकार की सामग्री शामिल है।

मुख्य विशेषताएं:
• हस्तलिखित पाठ
• विभिन्न शब्द और वाक्य
• संख्यात्मक डेटा
• विशेष चिह्न

दस्तावेज़ का विश्लेषण पूरा हो गया है और सभी पाठ सफलतापूर्वक पहचान लिया गया है।`,
    language: 'Hindi (Devanagari)',
    wordCount: 67,
    characterCount: 312,
    processingTime: '9.2 seconds',
    detectedElements: ['Handwritten Text', 'Mixed Content', 'Various Symbols', 'Numbers']
  }
}

export default function OCRResults({ imageUrl, imageName, onReset }: OCRResultsProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'analysis'>('text')
  const [isDownloading, setIsDownloading] = useState(false)
  const result = getOCRResult(imageName)

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const downloadResult = downloadPDF({
        imageName,
        imageUrl,
        result
      })
      
      if (downloadResult.success) {
        // Show success message (you could add a toast notification here)
        console.log('PDF downloaded successfully')
      } else {
        console.error('Failed to download PDF:', downloadResult.message)
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Display */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Original Document
            </h3>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={imageName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {imageName}
            </p>
          </div>
        </motion.div>

        {/* Results Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                OCR Analysis Results
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Analysis Complete
                </span>
              </div>
            </div>

            {/* Confidence Score */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confidence Score
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.confidence}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-4">
              <button
                onClick={() => setActiveTab('text')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'text'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Extracted Text
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Analysis Details
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'text' ? (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto"
                >
                  <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                    {result.text}
                  </pre>
                </motion.div>
              ) : (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Language</div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {result.language}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Processing Time</div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {result.processingTime}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Word Count</div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {result.wordCount}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Character Count</div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {result.characterCount}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Detected Elements</div>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedElements.map((element, index) => (
                        <motion.span
                          key={element}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {element}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isDownloading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReset}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Analyze Another
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
