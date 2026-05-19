import React, { useState, useRef } from 'react'
import PosterEditor from './components/PosterEditor'
import { UploadCloud } from 'lucide-react'

function App() {
  const [imageSrc, setImageSrc] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        setError('ദയവായി ഒരു സാധുവായ ചിത്ര ഫയൽ തിരഞ്ഞെടുക്കുക.')
        return
      }
      setError('')
      const reader = new FileReader()
      reader.addEventListener('load', () => setImageSrc(reader.result))
      reader.readAsDataURL(file)
    }
  }

  const handleReset = () => {
    setImageSrc(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-screen-md mx-auto px-4 py-4 flex items-center justify-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent text-center">
            സെന്റ് ആൻസ് എ.യു.പി. സ്കൂൾ നീലേശ്വരം - അഡ്മിഷൻ പോസ്റ്റർ
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-md mx-auto px-4 py-8">
        
        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in mt-10">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">
                അഡ്മിഷൻ പോസ്റ്റർ നിർമ്മിക്കുക
              </h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                നിങ്ങളുടെ കുട്ടിയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്ത്, സുഹൃത്തുക്കളുമായും ബന്ധുക്കളുമായും പങ്കുവെക്കാൻ മനോഹരമായ ഒരു അഡ്മിഷൻ പോസ്റ്റർ നിർമ്മിക്കൂ.
              </p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-sm aspect-square bg-white border-2 border-dashed border-blue-300 rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">
                ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക
              </h3>
              <p className="text-sm text-slate-400 text-center">
                ഫോട്ടോ ഗാലറിയിൽ നിന്നും തിരഞ്ഞെടുക്കുവാൻ ഇവിടെ ടാപ്പ് ചെയ്യുക.
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg">
                {error}
              </p>
            )}
            
          </div>
        ) : (
          <PosterEditor 
            imageSrc={imageSrc} 
            templateSrc="Base.png" 
            onReset={handleReset} 
          />
        )}
        
      </main>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}

export default App
