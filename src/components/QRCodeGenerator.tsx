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
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Text or URL
          </label>
          <input
            type="text"
            id="value"
            name="value"
            value={settings.value}
            onChange={handleInputChange}
            placeholder="Enter text or URL"
            className="input mt-1"
          />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">
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
            className="input mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fgColor" className="block text-sm font-medium text-gray-700">
              Foreground Color
            </label>
            <input
              type="color"
              id="fgColor"
              name="fgColor"
              value={settings.fgColor}
              onChange={handleInputChange}
              className="mt-1 h-10 w-full rounded-md border border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="bgColor" className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <input
              type="color"
              id="bgColor"
              name="bgColor"
              value={settings.bgColor}
              onChange={handleInputChange}
              className="mt-1 h-10 w-full rounded-md border border-gray-300"
            />
          </div>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">
            Error Correction Level
          </label>
          <select
            id="level"
            name="level"
            value={settings.level}
            onChange={handleInputChange}
            className="input mt-1"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          {settings.value ? (
            <QRCodeSVG
              value={settings.value}
              size={settings.size}
              bgColor={settings.bgColor}
              fgColor={settings.fgColor}
              level={settings.level}
              includeMargin={true}
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center text-gray-400">
              QR Code Preview
            </div>
          )}
        </div>

        <button
          onClick={handleDownload}
          disabled={!settings.value}
          className="btn btn-primary flex items-center gap-2"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Download QR Code
        </button>
      </div>
    </div>
  )
}

export default QRCodeGenerator 