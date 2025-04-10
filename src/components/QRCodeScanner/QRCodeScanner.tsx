import { useState, useEffect } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import toast from 'react-hot-toast';

const QRCodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    // Check for camera permissions
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);

        // Get available devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableDevices(videoDevices);
        
        // Select the first device by default
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Camera permission error:', error);
        setHasPermission(false);
        toast.error('Camera access denied. Please enable camera permissions.');
      }
    };

    checkPermissions();
  }, []);

  const startScanning = async () => {
    try {
      const codeReader = new BrowserQRCodeReader();
      
      const controls = await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        'qr-video',
        (result, error, controls) => {
          if (result) {
            toast.success('QR Code detected!');
            console.log('QR Code result:', result.getText());
            // Handle the QR code result here
          }
          if (error) {
            console.error('Scanning error:', error);
          }
        }
      );

      setScannerControls(controls);
      setScanning(true);
    } catch (error) {
      console.error('Failed to start scanning:', error);
      toast.error('Failed to start scanning');
    }
  };

  const stopScanning = () => {
    if (scannerControls) {
      scannerControls.stop();
      setScannerControls(null);
    }
    setScanning(false);
  };

  const switchCamera = async () => {
    stopScanning();
    const currentIndex = availableDevices.findIndex(device => device.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % availableDevices.length;
    setSelectedDeviceId(availableDevices[nextIndex].deviceId);
  };

  if (hasPermission === false) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-700 dark:text-red-200">
          Camera access is required for scanning QR codes. Please enable camera permissions in your browser settings.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="relative aspect-video max-w-2xl mx-auto overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {scanning ? (
          <>
            <video
              id="qr-video"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-12 border-2 border-dashed border-blue-500 rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Camera preview will appear here
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={scanning ? stopScanning : startScanning}
          className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            scanning
              ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
              : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'
          }`}
        >
          {scanning ? 'Stop Scanning' : 'Start Scanning'}
        </button>

        {availableDevices.length > 1 && (
          <button
            onClick={switchCamera}
            disabled={!scanning}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Switch Camera
          </button>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner; 