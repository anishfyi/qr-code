import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import QRCodeGenerator from './components/QRCodeGenerator/QRCodeGenerator';
import QRCodeScanner from './components/QRCodeScanner/QRCodeScanner';
import TabSwitcher from './components/common/TabSwitcher';

const tabs = [
  { id: 'generate', label: 'Generate QR', path: '/' },
  { id: 'scan', label: 'Scan QR', path: '/scan' },
];

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              QR Code Tool
            </h1>
            
            <div className="max-w-md mx-auto mb-8">
              <TabSwitcher tabs={tabs} />
            </div>

            <Routes>
              <Route path="/" element={<QRCodeGenerator />} />
              <Route path="/scan" element={<QRCodeScanner />} />
            </Routes>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
