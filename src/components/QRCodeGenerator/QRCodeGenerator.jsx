import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import QRCodeCustomizer from './QRCodeCustomizer';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const QRCodeGenerator = () => {
  const [value, setValue] = useState('');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState('L');
  const qrCodeRef = useRef(null);
  
  const handleDownload = async () => {
    if (!value) {
      toast.error('Please enter content for the QR code');
      return;
    }
    
    try {
      const dataUrl = await toPng(qrCodeRef.current);
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success('QR code downloaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download QR code');
    }
  };
  
  const handleCopy = () => {
    if (!value) {
      toast.error('Please enter content for the QR code');
      return;
    }
    
    navigator.clipboard.writeText(value)
      .then(() => toast.success('Content copied to clipboard'))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label 
          htmlFor="qr-content" 
          className="block text-sm font-medium text-gray-200"
        >
          QR Code Content
        </label>
        <textarea
          id="qr-content"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter URL, text or any content..."
          className="w-full px-4 py-3 rounded-lg border border-gray-700 
            bg-gray-800 text-white placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            min-h-[100px] resize-y"
          aria-label="QR code content input"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="order-2 md:order-1">
          <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-medium text-white">
              Customize QR Code
            </h3>
            <QRCodeCustomizer 
              bgColor={bgColor}
              setBgColor={setBgColor}
              fgColor={fgColor}
              setFgColor={setFgColor}
              size={size}
              setSize={setSize}
              level={level}
              setLevel={setLevel}
            />
          </div>
        </div>
        
        <div className="order-1 md:order-2 flex flex-col items-center justify-start">
          <div 
            ref={qrCodeRef} 
            className="bg-white rounded-lg p-4 w-full max-w-[300px] mx-auto md:max-w-none"
          >
            <QRCode
              value={value || ' '}
              size={size}
              bgColor={bgColor}
              fgColor={fgColor}
              level={level}
              className="w-full h-auto"
            />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Button
              onClick={handleDownload}
              disabled={!value}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2
                rounded-lg font-medium transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download QR Code
            </Button>
            <Button
              onClick={handleCopy}
              disabled={!value}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2
                rounded-lg font-medium transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Copy Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator; 