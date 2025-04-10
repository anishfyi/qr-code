import { useState } from 'react';
import TabSwitcher from './components/common/TabSwitcher';
import QRCodeGenerator from './components/QRCodeGenerator/QRCodeGenerator';
import QRCodeScanner from './components/QRCodeScanner/QRCodeScanner';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          QR Code Tool
        </h1>
        
        <div className="bg-gray-800 rounded-xl p-1 mb-8">
          <TabSwitcher 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            tabs={[
              { id: 'generate', label: 'Generate QR' },
              { id: 'scan', label: 'Scan QR' }
            ]} 
          />
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-6">
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