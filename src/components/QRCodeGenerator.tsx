import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

interface QRCodeSettings {
  value: string
  size: number
  bgColor: string
  fgColor: string
  level: 'L' | 'M' | 'Q' | 'H'
}

const QRCodeGenerator = () => {
  const [settings, setSettings] = useState<QRCodeSettings>({
    value: '',
    size: 256,
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    level: 'M'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDownload = () => {
    if (!settings.value) {
      toast.error('Please enter text or URL first')
      return
    }

    const svg = document.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'qr-code.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Text or URL
          </label>
          <input
            type="text"
            id="value"
            name="value"
            value={settings.value}
            onChange={handleInputChange}
            placeholder="Enter text or URL"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
            Size (px)
          </label>
          <input
            type="number"
            id="size"
            name="size"
            value={settings.size}
            onChange={handleInputChange}
            min="100"
            max="1000"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fgColor" className="block text-sm font-medium text-gray-700 mb-1">
              Foreground Color
            </label>
            <input
              type="color"
              id="fgColor"
              name="fgColor"
              value={settings.fgColor}
              onChange={handleInputChange}
              className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>

          <div>
            <label htmlFor="bgColor" className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              id="bgColor"
              name="bgColor"
              value={settings.bgColor}
              onChange={handleInputChange}
              className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
            Error Correction Level
          </label>
          <select
            id="level"
            name="level"
            value={settings.level}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          {settings.value ? (
            <QRCodeSVG
              value={settings.value}
              size={Math.min(settings.size, window.innerWidth < 640 ? 200 : 256)}
              bgColor={settings.bgColor}
              fgColor={settings.fgColor}
              level={settings.level}
              includeMargin={true}
            />
          ) : (
            <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              QR Code Preview
            </div>
          )}
        </div>

        <button
          onClick={handleDownload}
          disabled={!settings.value}
          className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Download QR Code
        </button>
      </div>
    </div>
  )
}

export default QRCodeGenerator 