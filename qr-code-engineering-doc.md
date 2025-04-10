# QR Code Scanner & Generator Engineering Document

## Overview
This document outlines the architecture and implementation details for creating a responsive QR code scanner and generator using React and Tailwind CSS. The application will feature a modern UI that works seamlessly across mobile and desktop devices.

## Requirements

### Functional Requirements
- Generate QR codes from user input (text, URLs, etc.)
- Scan QR codes using device camera
- Download generated QR codes as images
- Copy QR code content to clipboard
- Support for mobile and desktop devices

### Non-Functional Requirements
- Responsive design that works on all screen sizes
- Modern, clean UI with intuitive user experience
- Fast performance for both scanning and generating
- Accessibility compliance

## Technical Architecture

### Dependencies
```
npm install react-qr-code          # For generating QR codes
npm install react-qr-reader         # For scanning QR codes
npm install html-to-image           # For downloading QR codes as images
npm install @headlessui/react       # For UI components (optional)
npm install react-hot-toast         # For notifications
```

### Component Structure
```
src/
├── components/
│   ├── QRCodeGenerator/
│   │   ├── QRCodeGenerator.jsx
│   │   ├── QRCodeCustomizer.jsx
│   │   └── QRCodeDownload.jsx
│   ├── QRCodeScanner/
│   │   ├── QRCodeScanner.jsx
│   │   └── ScanResults.jsx
│   ├── common/
│   │   ├── TabSwitcher.jsx
│   │   ├── Button.jsx
│   │   └── Layout.jsx
│   └── index.js
├── hooks/
│   ├── useQRCode.js
│   └── useScanner.js
├── context/
│   └── QRCodeContext.js
└── App.jsx
```

## Detailed Design

### QR Code Generator

#### `QRCodeGenerator.jsx`
Main component for QR code generation functionality:
- Text input field for entering content
- QR code preview in real-time
- Options to customize QR code appearance
- Download and copy functionality

#### `QRCodeCustomizer.jsx`
Component for customizing QR code appearance:
- Color picker for foreground and background
- Size adjustment
- Error correction level selection
- Logo/image overlay option

#### `QRCodeDownload.jsx`
Component for saving the generated QR code:
- Download as PNG/JPEG/SVG
- Filename customization
- Copy to clipboard functionality

### QR Code Scanner

#### `QRCodeScanner.jsx`
Component for scanning QR codes:
- Camera access management
- Scanning overlay with guidelines
- Responsive camera view
- Handling permission requests
- Flashlight toggle (if supported)

#### `ScanResults.jsx`
Component for displaying and handling scan results:
- Display scanned content
- Detect content type (URL, text, contact, etc.)
- Action buttons (open URL, copy, etc.)
- History of scanned codes (optional)

### Common Components

#### `TabSwitcher.jsx`
Component for switching between generator and scanner views:
- Animated tab switching
- Responsive design for both mobile and desktop
- Active state styling

#### `Button.jsx`
Reusable styled button component:
- Various states (primary, secondary, disabled)
- Loading state
- Icon support

#### `Layout.jsx`
Main layout component:
- Header/footer
- Responsive container
- Theme-aware styling

### Custom Hooks

#### `useQRCode.js`
Hook for QR code generation functionality:
```javascript
import { useState, useCallback } from 'react';

export const useQRCode = () => {
  const [qrValue, setQRValue] = useState('');
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const [level, setLevel] = useState('L'); // Error correction level
  
  // Reset function
  const resetQRCode = useCallback(() => {
    setQRValue('');
    setSize(256);
    setBgColor('#FFFFFF');
    setFgColor('#000000');
    setLevel('L');
  }, []);
  
  return {
    qrValue,
    setQRValue,
    size,
    setSize,
    bgColor,
    setBgColor,
    fgColor,
    setFgColor,
    level,
    setLevel,
    resetQRCode,
  };
};
```

#### `useScanner.js`
Hook for QR code scanning functionality:
```javascript
import { useState, useCallback } from 'react';

export const useScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  
  // Handle scan
  const handleScan = useCallback((data) => {
    if (data) {
      setScanResult(data);
      setScanning(false);
      setScanHistory(prev => [{ data, timestamp: new Date() }, ...prev]);
    }
  }, []);
  
  // Handle errors
  const handleError = useCallback((err) => {
    console.error(err);
    if (err.name === 'NotAllowedError') {
      setHasPermission(false);
    }
  }, []);
  
  // Start scanning
  const startScanning = useCallback(() => {
    setScanning(true);
    setScanResult(null);
  }, []);
  
  // Stop scanning
  const stopScanning = useCallback(() => {
    setScanning(false);
  }, []);
  
  return {
    scanResult,
    scanning,
    hasPermission,
    scanHistory,
    handleScan,
    handleError,
    startScanning,
    stopScanning,
  };
};
```

## UI Design Guidelines

### Color Palette
- Primary: `#3B82F6` (blue-500)
- Secondary: `#10B981` (emerald-500)
- Background: `#FFFFFF` (white for light mode), `#1F2937` (gray-800 for dark mode)
- Text: `#1F2937` (gray-800 for light mode), `#F9FAFB` (gray-50 for dark mode)
- Accent: `#8B5CF6` (violet-500)
- Error: `#EF4444` (red-500)
- Success: `#10B981` (emerald-500)

### Typography
- Heading: `font-sans font-bold text-2xl md:text-3xl`
- Subheading: `font-sans font-semibold text-xl`
- Body: `font-sans text-base text-gray-700 dark:text-gray-300`
- Small: `font-sans text-sm text-gray-500 dark:text-gray-400`

### Spacing
- Container padding: `p-4 md:p-6 lg:p-8`
- Component spacing: `space-y-4 md:space-y-6`
- Section spacing: `mb-8 md:mb-12`

### Responsive Breakpoints
- Small: `sm:` (640px and up)
- Medium: `md:` (768px and up)
- Large: `lg:` (1024px and up)
- Extra Large: `xl:` (1280px and up)

## Implementation Guide

### 1. Set Up Core Components

Start by creating the main App component with tab switching functionality:

```jsx
// App.jsx
import { useState } from 'react';
import TabSwitcher from './components/common/TabSwitcher';
import QRCodeGenerator from './components/QRCodeGenerator/QRCodeGenerator';
import QRCodeScanner from './components/QRCodeScanner/QRCodeScanner';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          QR Code Tool
        </h1>
        
        <TabSwitcher 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          tabs={[
            { id: 'generate', label: 'Generate QR' },
            { id: 'scan', label: 'Scan QR' }
          ]} 
        />
        
        <div className="mt-6">
          {activeTab === 'generate' ? (
            <QRCodeGenerator />
          ) : (
            <QRCodeScanner />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 2. Implement QR Code Generator

```jsx
// components/QRCodeGenerator/QRCodeGenerator.jsx
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
      
      // Create download link
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
    <div className="space-y-6">
      <div className="space-y-4">
        <label htmlFor="qr-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          QR Code Content
        </label>
        <textarea
          id="qr-content"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter URL, text or any content..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
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
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div ref={qrCodeRef} className="p-4 bg-white rounded-lg">
            <QRCode
              value={value || ' '}
              size={size}
              bgColor={bgColor}
              fgColor={fgColor}
              level={level}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={handleDownload}
          disabled={!value}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Download QR Code
        </Button>
        <Button
          onClick={handleCopy}
          disabled={!value}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          Copy Content
        </Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
```

### 3. Implement QR Code Scanner

```jsx
// components/QRCodeScanner/QRCodeScanner.jsx
import { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import ScanResults from './ScanResults';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const QRCodeScanner = () => {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [device, setDevice] = useState('environment'); // 'environment' for rear camera, 'user' for front camera
  
  useEffect(() => {
    // Check for camera permissions
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          setHasPermission(false);
          toast.error('Camera access denied. Please enable camera permissions.');
        } else {
          console.error('Camera error:', error);
          toast.error('Failed to access camera.');
        }
      }
    };
    
    checkPermissions();
  }, []);
  
  const handleScan = (data) => {
    if (data) {
      setResult(data);
      setScanning(false);
      toast.success('QR code scanned successfully!');
    }
  };
  
  const handleToggleScanning = () => {
    if (scanning) {
      setScanning(false);
    } else {
      setScanning(true);
      setResult(null);
    }
  };
  
  const toggleCamera = () => {
    setDevice(device === 'environment' ? 'user' : 'environment');
  };
  
  return (
    <div className="space-y-6">
      {hasPermission === false && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Camera access is required for scanning. Please enable camera permissions in your browser settings.
        </div>
      )}
      
      {scanning ? (
        <div className="relative">
          <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-lg">
            <QrReader
              constraints={{ facingMode: device }}
              onResult={(result, error) => {
                if (result) {
                  handleScan(result?.text);
                }
                if (error) {
                  console.info(error);
                }
              }}
              className="w-full h-full"
            />
            {/* Scanning overlay with guidelines */}
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-blue-500 m-8 rounded-lg"></div>
          </div>
          
          <div className="mt-4 flex justify-center gap-4">
            <Button onClick={handleToggleScanning} className="bg-red-500 hover:bg-red-600 text-white">
              Stop Scanning
            </Button>
            <Button onClick={toggleCamera} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
              Flip Camera
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          {result ? (
            <ScanResults result={result} />
          ) : (
            <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
              <p className="text-gray-600 dark:text-gray-300 mb-4">No QR code scanned yet</p>
            </div>
          )}
          
          <Button 
            onClick={handleToggleScanning} 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={hasPermission === false}
          >
            {result ? 'Scan Another Code' : 'Start Scanning'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
```

### 4. Implement Common Components

#### Tab Switcher Component

```jsx
// components/common/TabSwitcher.jsx
const TabSwitcher = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
```

#### Button Component

```jsx
// components/common/Button.jsx
const Button = ({ 
  children, 
  onClick, 
  className = "", 
  disabled = false, 
  type = "button", 
  isLoading = false 
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const disabledClasses = "opacity-50 cursor-not-allowed";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${disabled || isLoading ? disabledClasses : ''} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
```

### 5. Implement Customizer and Results Components

#### QR Code Customizer Component

```jsx
// components/QRCodeGenerator/QRCodeCustomizer.jsx
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

const QRCodeCustomizer = ({ 
  bgColor, setBgColor, 
  fgColor, setFgColor, 
  size, setSize, 
  level, setLevel 
}) => {
  const errorCorrectionLevels = [
    { value: 'L', label: 'Low (7%)' },
    { value: 'M', label: 'Medium (15%)' },
    { value: 'Q', label: 'Quartile (25%)' },
    { value: 'H', label: 'High (30%)' },
  ];

  return (
    <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="font-medium text-gray-800 dark:text-white">Customize QR Code</h3>
      
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
      
      <div className="space-y-2">
        <label className="block text-sm text-gray-600 dark:text-gray-300">
          Error Correction
        </label>
        <div className="relative">
          <Menu as="div" className="relative inline-block text-left w-full">
            <div>
              <Menu.Button className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {errorCorrectionLevels.find(l => l.value === level)?.label}
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute z-10 mt-2 w-full rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {errorCorrectionLevels.map((errorLevel) => (
                    <Menu.Item key={errorLevel.value}>
                      {({ active }) => (
                        <button
                          onClick={() => setLevel(errorLevel.value)}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                          } block w-full text-left px-4 py-2 text-sm`}
                        >
                          {errorLevel.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default QRCodeCustomizer;
```

#### Scan Results Component

```jsx
// components/QRCodeScanner/ScanResults.jsx
import { useState, useEffect } from 'react';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const ScanResults = ({ result }) => {
  const [contentType, setContentType] = useState('text');
  
  useEffect(() => {
    // Detect the type of content in the QR code
    if (result) {
      const urlRegex = /^(https?:\/\/)/i;
      const emailRegex = /^mailto:/i;
      const phoneRegex = /^tel:/i;
      const smsRegex = /^sms:/i;
      
      if (urlRegex.test(result)) {
        setContentType('url');
      } else if (emailRegex.test(result)) {
        setContentType('email');
      } else if (phoneRegex.test(result)) {
        setContentType('phone');
      } else if (smsRegex.test(result)) {
        setContentType('sms');
      } else {
        setContentType('text');
      }
    }
  }, [result]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result)
      .then(() => toast.success('Content copied to clipboard'))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };
  
  const handleAction = () => {
    switch (contentType) {
      case 'url':
        window.open(result, '_blank');
        break;
      case 'email':
      case 'phone':
      case 'sms':
        window.location.href = result;
        break;
      default:
        // No action for text
        break;
    }
  };
  
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Scan Result</h3>
      
      <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 max-h-36 overflow-y-auto break-words">
        <p className="text-gray-800 dark:text-gray-200">{result}</p>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Detected content type: {contentType === 'url' ? 'Website URL' : 
          contentType === 'email' ? 'Email Address' : 
          contentType === 'phone' ? 'Phone Number' : 
          contentType === 'sms' ? 'SMS' : 'Text'}
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleCopy}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          Copy to Clipboard
        </Button>
        
        {contentType !== 'text' && (
          <Button
            onClick={handleAction}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {contentType === 'url' ? 'Open Website' : 
             contentType === 'email' ? 'Compose Email' : 
             contentType === 'phone' ? 'Call Number' : 
             contentType === 'sms' ? 'Send SMS' : 'Open'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScanResults;
```

## Mobile Responsiveness Considerations

1. **Viewport Configuration**
   Ensure your app has the correct viewport meta tag in your HTML head:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
   ```

2. **Responsive Layout Strategies**
   - Use Flexbox and Grid layouts for responsive design
   - Implement column stacking on smaller screens with Tailwind's responsive modifiers
   - Adjust font sizes and spacing for different screen sizes
   - Use Tailwind's container class with default responsive behavior

3. **Touch-Friendly UI Elements**
   - Ensure buttons and interactive elements have sufficient touch target size (min 44×44px)
   - Increase padding on mobile viewports
   - Add active states for touch feedback

4. **Camera Handling**
   - Test camera access on both iOS and Android
   - Handle permission requests gracefully
   - Provide fallback options if camera access is denied

## Browser Compatibility & Polyfills

The QR code scanner may require additional polyfills or fallbacks for older browsers:

## Browser Compatibility & Polyfills (continued)

1. **Camera API Support**
   - Provide fallback messaging for browsers that don't support `getUserMedia`
   - Consider a file upload alternative for QR code scanning on unsupported devices
   - Test extensively on iOS Safari which has stricter camera access policies

2. **Service Worker for Offline Support**
   Consider implementing a service worker for offline functionality:
   ```javascript
   // Register service worker for offline support
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('/service-worker.js')
         .then(registration => {
           console.log('Service Worker registered with scope:', registration.scope);
         })
         .catch(error => {
           console.error('Service Worker registration failed:', error);
         });
     });
   }
   ```

## Performance Optimization

1. **Code Splitting**
   - Use dynamic imports to load the QR Scanner component only when needed
   - Example:
   ```javascript
   const QRCodeScanner = React.lazy(() => import('./components/QRCodeScanner/QRCodeScanner'));
   
   // In your component:
   <Suspense fallback={<div>Loading scanner...</div>}>
     {activeTab === 'scan' && <QRCodeScanner />}
   </Suspense>
   ```

2. **Image Optimization**
   - Optimize generated QR codes for size and quality
   - Implement proper caching strategies for generated QR codes

3. **Resource Hints**
   - Use preconnect for third-party libraries
   - Example in HTML head:
   ```html
   <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
   ```

## Error Handling & Edge Cases

1. **QR Code Generation Errors**
   - Handle content that's too large for QR encoding
   - Provide feedback when custom options might affect scanability
   - Implement proper error boundaries

2. **Camera Permission Handling**
   - Detect when the user has blocked camera access and provide instructions
   - Check for device capability (some devices may not have cameras)
   - Track scanning session state (active/inactive)

3. **Download Failures**
   - Handle file system access errors
   - Provide alternative methods (e.g., copy the image data URL)

## Testing Strategy

1. **Unit Tests**
   - Test QR code generation with various input types
   - Test error handling and edge cases

2. **Integration Tests**
   - Test scanner and generator component integration
   - Test user flows from generation to download

3. **Mobile Testing**
   - Test on real iOS and Android devices
   - Test camera permission flows
   - Test on different screen sizes and orientations

4. **Automated Testing**
   Example Jest test for the QRCodeGenerator component:
   ```javascript
   import { render, screen, fireEvent } from '@testing-library/react';
   import QRCodeGenerator from './QRCodeGenerator';

   test('renders QR code generator with input field', () => {
     render(<QRCodeGenerator />);
     const inputElement = screen.getByPlaceholderText(/enter url, text or any content/i);
     expect(inputElement).toBeInTheDocument();
   });

   test('generates QR code when input is provided', () => {
     render(<QRCodeGenerator />);
     const inputElement = screen.getByPlaceholderText(/enter url, text or any content/i);
     fireEvent.change(inputElement, { target: { value: 'https://example.com' } });
     
     // QR code should be rendered
     const qrCodeElement = screen.getByRole('img');
     expect(qrCodeElement).toBeInTheDocument();
   });
   ```

## Accessibility Considerations

1. **Keyboard Navigation**
   - Ensure all interactive elements are keyboard accessible
   - Implement proper focus management
   - Use proper tab order

2. **Screen Reader Support**
   - Add ARIA labels for all UI components
   - Provide text alternatives for visual elements
   - Announce status changes (e.g., "QR code scanned successfully")

3. **Contrast and Typography**
   - Ensure sufficient color contrast for text and UI elements
   - Use readable font sizes and families
   - Support system font size settings

4. **Reduced Motion**
   - Respect user preferences for reduced motion
   - Example:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .scan-animation {
       animation: none;
     }
   }
   ```

## Advanced Features

### 1. History Management

Implement a scan history feature to store previously scanned QR codes:

```jsx
// hooks/useScanHistory.js
import { useState, useEffect } from 'react';

export const useScanHistory = () => {
  const [history, setHistory] = useState([]);
  
  // Load history from localStorage on init
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-scan-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse scan history', e);
      }
    }
  }, []);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('qr-scan-history', JSON.stringify(history));
  }, [history]);
  
  const addToHistory = (result) => {
    const newEntry = {
      id: Date.now(),
      content: result,
      timestamp: new Date().toISOString(),
    };
    
    setHistory(prevHistory => [newEntry, ...prevHistory].slice(0, 20)); // Keep only last 20 items
  };
  
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qr-scan-history');
  };
  
  const removeFromHistory = (id) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };
  
  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
};
```

### 2. QR Code Logo Overlay

Add support for adding a logo or image overlay to the QR code:

```jsx
// components/QRCodeGenerator/QRCodeWithLogo.jsx
import { useRef, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeWithLogo = ({ value, size, bgColor, fgColor, level, logoUrl, logoSize = 0.2 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const generateQR = async () => {
      try {
        // Generate QR code on canvas
        await QRCode.toCanvas(canvasRef.current, value || ' ', {
          width: size,
          height: size,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: level,
        });
        
        // Add logo if provided
        if (logoUrl) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          const logo = new Image();
          logo.onload = () => {
            // Calculate logo size and position
            const logoWidth = canvas.width * logoSize;
            const logoHeight = canvas.height * logoSize;
            const logoX = (canvas.width - logoWidth) / 2;
            const logoY = (canvas.height - logoHeight) / 2;
            
            // Create a white background for the logo
            ctx.fillStyle = bgColor;
            ctx.fillRect(logoX - 5, logoY - 5, logoWidth + 10, logoHeight + 10);
            
            // Draw the logo
            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
          };
          logo.src = logoUrl;
        }
      } catch (err) {
        console.error('Error generating QR code', err);
      }
    };
    
    generateQR();
  }, [value, size, bgColor, fgColor, level, logoUrl, logoSize]);
  
  return <canvas ref={canvasRef} />;
};

export default QRCodeWithLogo;
```

### 3. Dark Mode Support

Implement a dark mode toggle and theme context:

```jsx
// context/ThemeContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for user's preference
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && userPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newMode;
    });
  };
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

## Deployment Considerations

1. **Build Optimization**
   - Set up proper bundling and minification
   - Implement code splitting for smaller bundle sizes
   - Use tree shaking to eliminate unused code

2. **Environment-Specific Configuration**
   - Use environment variables for configuration
   - Set up separate configurations for development and production

3. **HTTPS**
   - Ensure deployment uses HTTPS (required for camera access)
   - Set up proper security headers

4. **Analytics & Monitoring**
   - Implement basic analytics to track usage
   - Set up error monitoring
   - Track performance metrics

## Future Enhancements

1. **Multiple QR Code Formats**
   - Support for different QR code types (DataMatrix, Aztec, etc.)
   - Support for different content formats (vCard, WiFi configuration, etc.)

2. **Batch QR Code Generation**
   - Generate multiple QR codes at once
   - Support for CSV import

3. **Advanced Customization**
   - Custom QR code shapes and styles
   - Animation effects for generated QR codes

4. **Sharing Integration**
   - Integration with Web Share API
   - Direct sharing to social media or messaging apps

## Implementation Timeline

| Week | Tasks |
|------|-------|
| 1 | Set up project structure, implement basic UI and routing |
| 1 | Implement QR code generator with basic functionality |
| 2 | Implement QR code scanner with camera integration |
| 2 | Add customization options for QR codes |
| 3 | Implement download and sharing functionality |
| 3 | Add scan history and result handling |
| 4 | Implement responsive design for mobile devices |
| 4 | Testing and bug fixes |
| 5 | Performance optimization and final polish |

## Conclusion

This engineering document provides a comprehensive guide for building a modern, responsive QR code scanner and generator using React and Tailwind CSS. The implementation focuses on providing a high-quality user experience across devices while maintaining clean code architecture and following best practices.

The modular component structure allows for easy maintenance and extension, while the responsive design ensures usability on both mobile and desktop devices. By following this guide, you can create a feature-rich QR code tool that meets the needs of various use cases.

## Appendix

### Useful Resources

- [React QR Code Documentation](https://www.npmjs.com/package/react-qr-code)
- [React QR Reader Documentation](https://www.npmjs.com/package/react-qr-reader)
- [MDN Web Camera API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [QR Code Standards](https://www.qrcode.com/en/about/)

### Troubleshooting Common Issues

1. **Camera Access Denied**
   - Check browser permissions settings
   - Ensure the app is running under HTTPS
   - Try using a different browser

2. **QR Code Not Scanning**
   - Ensure adequate lighting
   - Check if the QR code is within the scanning area
   - Try increasing the error correction level

3. **Performance Issues**
   - Reduce the scanning frequency
   - Optimize the camera resolution
   - Implement lazy loading for heavy components
