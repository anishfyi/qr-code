import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');

  const handleDownload = async () => {
    if (!text) {
      toast.error('Please enter some text first');
      return;
    }

    try {
      const qrCodeElement = document.getElementById('qr-code');
      if (!qrCodeElement) {
        throw new Error('QR Code element not found');
      }

      const dataUrl = await toPng(qrCodeElement);
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('QR Code downloaded successfully');
    } catch (err) {
      console.error('Failed to download QR code:', err);
      toast.error('Failed to download QR code');
    }
  };

  const handleCopy = async () => {
    if (!text) {
      toast.error('Please enter some text first');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="space-y-4">
        <label 
          htmlFor="qr-content" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          QR Code Content
        </label>
        <textarea
          id="qr-content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter URL, text or any content..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-800 dark:text-white">Customize QR Code</h3>
            
            {/* Size adjustment */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600 dark:text-gray-300">
                Size (px)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="8"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px]">
                  {size}px
                </span>
              </div>
            </div>

            {/* Background color */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600 dark:text-gray-300">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer" 
                  style={{ backgroundColor: bgColor }}
                >
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{bgColor}</span>
              </div>
            </div>

            {/* Foreground color */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600 dark:text-gray-300">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer" 
                  style={{ backgroundColor: fgColor }}
                >
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{fgColor}</span>
              </div>
            </div>

            {/* Error correction level */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600 dark:text-gray-300">
                Error Correction
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div 
            id="qr-code"
            className="p-4 bg-white rounded-lg shadow-md"
          >
            <QRCodeSVG
              value={text || ' '}
              size={size}
              bgColor={bgColor}
              fgColor={fgColor}
              level={level}
              includeMargin
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleDownload}
          disabled={!text}
          className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download QR Code
        </button>
        <button
          onClick={handleCopy}
          disabled={!text}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Copy Content
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator; 