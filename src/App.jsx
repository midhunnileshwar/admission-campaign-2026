import React, { useState, useRef } from 'react'
import PosterEditor from './components/PosterEditor'
import { UploadCloud } from 'lucide-react'

function App() {
  const [imageSrc, setImageSrc] = useState(null)
  const [error, setError] = useState('')
  const [showAd, setShowAd] = useState(true)
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
    <div className="min-h-screen bg-slate-50 bg-grid-pattern font-anek selection:bg-blue-200 flex flex-col relative">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="School_Logo-removebg-preview.png" 
              alt="School Logo" 
              className="h-12 w-auto object-contain mr-3 drop-shadow-sm"
            />
            <div>
              <h1 className="text-sm md:text-base font-extrabold text-slate-800 leading-tight">
                സെന്റ് ആൻസ് എ.യു.പി. സ്കൂൾ നീലേശ്വരം
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-bold tracking-wide uppercase">
                അഡ്മിഷൻ പോസ്റ്റർ നിർമ്മാണം 2026-27
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-md mx-auto px-4 py-8 flex-grow w-full flex flex-col justify-center">
        
        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center space-y-8 py-6 md:py-12">
            
            {/* Branding Welcome Area */}
            <div className="flex flex-col items-center text-center space-y-4 max-w-lg mx-auto">
              <img 
                src="School_Logo-removebg-preview.png" 
                alt="School Logo" 
                className="w-28 h-28 object-contain drop-shadow-lg animate-float"
              />
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-600 bg-clip-text text-transparent leading-snug">
                  അഡ്മിഷൻ പോസ്റ്റർ നിർമ്മാണം
                </h2>
                <p className="text-sm md:text-base text-slate-600 font-medium px-4">
                  നിങ്ങളുടെ കുട്ടിയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്ത് പ്രവേശന പോസ്റ്റർ തയ്യാറാക്കൂ. സുഹൃത്തുക്കൾക്കും ബന്ധുക്കൾക്കും പങ്കുവെക്കൂ!
                </p>
              </div>
            </div>

            {/* Upload Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-sm aspect-[4/3] bg-white border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-[2rem] flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-blue-50/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group shadow-md relative overflow-hidden"
            >
              {/* Decorative radial gradient light */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-inner group-hover:bg-blue-100/80">
                <UploadCloud className="w-8 h-8" />
              </div>
              
              <h3 className="text-lg font-extrabold text-slate-700 mb-1 group-hover:text-blue-600 transition-colors">
                ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക
              </h3>
              <p className="text-xs font-semibold text-slate-400 text-center leading-relaxed">
                ഫോട്ടോ ഗാലറിയിൽ നിന്നും തിരഞ്ഞെടുക്കുവാൻ ഇവിടെ ടാപ്പ് ചെയ്യുക
              </p>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-100 px-5 py-2.5 rounded-xl shadow-sm">
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

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 bg-white/50 py-4 text-center mt-12">
        <p className="text-xs text-slate-400 font-semibold">
          © {new Date().getFullYear()} സെന്റ് ആൻസ് എ.യു.പി. സ്കൂൾ നീലേശ്വരം. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.
        </p>
      </footer>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Advertisement Pop-up */}
      {showAd && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-xs z-50 animate-slide-up">
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden group">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowAd(false)}
              className="absolute top-2.5 right-2.5 w-6 h-6 bg-black/60 hover:bg-black/85 text-white rounded-full flex items-center justify-center z-10 transition-colors shadow-sm cursor-pointer"
              title="പരസ്യം അടയ്ക്കുക"
            >
              <span className="text-[10px] font-bold leading-none">✕</span>
            </button>
            
            {/* Banner Link */}
            <a 
              href="https://thean-nellikka.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block relative"
            >
              <img 
                src="Untitled-1@3x.png" 
                alt="പരസ്യം" 
                className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
              
              {/* Hover indicator overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="bg-white text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1">
                  സന്ദർശിക്കുക 🔗
                </span>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
