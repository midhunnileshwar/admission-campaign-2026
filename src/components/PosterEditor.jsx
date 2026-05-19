import React, { useState, useCallback, useRef, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../utils/canvasUtils'
import { Download, RefreshCcw } from 'lucide-react'

const PosterEditor = ({ imageSrc, templateSrc, onReset }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isExporting, setIsExporting] = useState(false)

  // Name customization state variables
  const [showName, setShowName] = useState(true)
  const [studentName, setStudentName] = useState('')
  const [fontSize, setFontSize] = useState(60)
  const [nameX, setNameX] = useState(768)
  const [nameY, setNameY] = useState(1700) // Positioned nicely below the photo hole by default
  const [textColor, setTextColor] = useState('#c20000') // Vibrant red color for maximum design appeal

  // Drag and drop positioning state & handlers
  const previewRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = useCallback((clientX, clientY) => {
    if (!previewRef.current) return
    const rect = previewRef.current.getBoundingClientRect()
    
    // Convert current cursor coordinates to percentage coordinates relative to preview container
    let pctX = (clientX - rect.left) / rect.width
    let pctY = (clientY - rect.top) / rect.height
    
    // Clamp to ensure the name text stays within reasonable boundaries of the poster template
    pctX = Math.max(0.05, Math.min(0.95, pctX))
    pctY = Math.max(0.05, Math.min(0.95, pctY))
    
    // Map to canvas coordinate grid (1536 x 2572)
    setNameX(Math.round(pctX * 1536))
    setNameY(Math.round(pctY * 2572))
  }, [])

  const handleStart = useCallback((e) => {
    setIsDragging(true)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    handleDrag(clientX, clientY)
  }, [handleDrag])

  const handleMove = useCallback((e) => {
    if (!isDragging) return
    // Prevent default touch behaviors like scrolling when adjusting name position on mobile
    if (e.cancelable) {
      e.preventDefault()
    }
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    handleDrag(clientX, clientY)
  }, [isDragging, handleDrag])

  const handleEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Listen globally for mouse and touch interactions during drag operations
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleMove, { passive: false })
      window.addEventListener('touchend', handleEnd)
      
      return () => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleEnd)
        window.removeEventListener('touchmove', handleMove)
        window.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDragging, handleMove, handleEnd])

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleDownload = async () => {
    try {
      setIsExporting(true)
      const croppedImageBlobUrl = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        templateSrc,
        {
          showName,
          studentName,
          fontSize,
          nameX,
          nameY,
          textColor
        }
      )
      
      // Trigger download
      const link = document.createElement('a')
      link.download = `admission-poster-${studentName ? studentName.replace(/\s+/g, '-') : 'announcement'}.png`
      link.href = croppedImageBlobUrl
      link.click()
    } catch (e) {
      console.error(e)
      alert("പോസ്റ്റർ നിർമ്മിക്കാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-6 animate-fade-in pb-8">
      
      {/* Interactive Poster Area */}
      <div 
        ref={previewRef}
        className="relative w-full overflow-hidden shadow-2xl rounded-2xl bg-white border border-slate-200"
        style={{ 
          aspectRatio: '1536/2572',
          containerType: 'inline-size' // creates a container context for cqw font scaling
        }}
      >
        {/* 
          Cropper Container 
          Matches the exact size and position of the transparent hole in Base.png:
          Hole: x=319, y=680, width=899, height=796 (on a 1536x2572 canvas)
          Percentages styled via cqw relative to width of parent for exact layout ratio on all screens:
          left: 319 / 1536 = 20.7682cqw
          top: 680 / 1536 = 44.2708cqw
          width: 899 / 1536 = 58.5286cqw
          height: 796 / 1536 = 51.8229cqw
        */}
        <div 
          className="absolute"
          style={{
            left: '20.7682cqw',
            top: '44.2708cqw',
            width: '58.5286cqw',
            height: '51.8229cqw',
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={899 / 796}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
            style={{
              containerStyle: { background: 'transparent' },
              cropAreaStyle: { border: 'none', boxShadow: 'none' }
            }}
          />
        </div>

        {/* Poster Template Overlay */}
        <img 
          src={templateSrc} 
          alt="Poster Template" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none drop-shadow-lg"
        />

        {/* Live Malayalam Name Overlay */}
        {showName && studentName && (
          <div
            className={`absolute select-none text-center font-bold transition-all duration-75 rounded-md p-1 ${
              isDragging 
                ? 'ring-2 ring-blue-500 ring-dashed bg-blue-50/20 shadow-md scale-105' 
                : 'hover:ring-2 hover:ring-slate-400 hover:ring-dashed'
            }`}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            style={{
              left: `${(nameX / 1536) * 100}%`,
              top: `${(nameY / 2572) * 100}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${(fontSize / 1536) * 100}cqw`, // scales dynamically with width
              color: textColor,
              fontFamily: "'Anek Malayalam', sans-serif",
              whiteSpace: 'nowrap',
              WebkitTextStroke: `${(fontSize / 1536) * 100 * 0.15}cqw #ffffff`, // proportional outline
              paintOrder: 'stroke fill',
              cursor: 'move',
              touchAction: 'none',
              pointerEvents: 'auto',
            }}
          >
            {studentName}
          </div>
        )}
      </div>

      {/* Sizing & Position Controls */}
      <div className="w-full bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
        <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-2">
          കുട്ടിയുടെ പേര് ചേർക്കുക
        </h3>
        
        {/* Toggle checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showNameCheckbox"
            checked={showName}
            onChange={(e) => setShowName(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="showNameCheckbox" className="text-sm font-semibold text-slate-700">
            പേര് പോസ്റ്ററിൽ കാണിക്കുക
          </label>
        </div>

        {showName && (
          <>
            {/* Text Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                കുട്ടിയുടെ പേര് (മലയാളത്തിൽ)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="അഭിമന്യു വി."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 bg-slate-50"
              />
              <p className="text-xs text-slate-500">
                കുട്ടിയുടെ പേര് മലയാളത്തിൽ ടൈപ്പ് ചെയ്യുക. പേരിന്റെ സ്ഥാനം മാറ്റാൻ പോസ്റ്ററിന് മുകളിലുള്ള പേരിൽ വിരൽ തൊട്ട് വലിച്ചിടുക!
              </p>
            </div>

            {/* Sizing and Position Sliders */}
            <div className="grid grid-cols-1 gap-4">
              {/* Font Size */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600 flex justify-between">
                  <span>അക്ഷരങ്ങളുടെ വലുപ്പം</span>
                  <span className="text-blue-600">{fontSize}px</span>
                </label>
                <input
                  type="range"
                  value={fontSize}
                  min={20}
                  max={120}
                  step={1}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Text Color */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600 flex justify-between">
                  <span>അക്ഷരങ്ങളുടെ നിറം</span>
                  <span className="text-blue-600">{textColor}</span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {['#000000', '#c20000', '#002e7a', '#006400', '#ffffff'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className="w-5 h-5 rounded-full border border-slate-300 transition-transform active:scale-95"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Photo Crop Controls */}
      <div className="w-full bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700 flex justify-between">
            <span>ഫോട്ടോയുടെ സൂം</span>
            <span className="text-blue-600">{Math.round(zoom * 100)}%</span>
          </label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        
        <p className="text-xs text-slate-500 text-center">
          സൂചന: പോസ്റ്ററിലെ ഫോട്ടോ വിരലുകൾ കൊണ്ട് സൂം ചെയ്യാനും വലിച്ചിടാനും സാധിക്കും!
        </p>

        <div className="flex gap-3 mt-2">
          <button 
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95"
          >
            <RefreshCcw className="w-5 h-5" />
            ഫോട്ടോ മാറ്റുക
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70"
          >
            <Download className="w-5 h-5" />
            {isExporting ? 'ഡൗൺലോഡ് ചെയ്യുന്നു...' : 'ഡൗൺലോഡ് ചെയ്യുക'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PosterEditor
