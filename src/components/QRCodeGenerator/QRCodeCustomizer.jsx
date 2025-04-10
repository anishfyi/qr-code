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
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm text-gray-300">
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
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
              accent-blue-500"
            aria-label="QR code size"
          />
          <span className="text-sm font-medium text-gray-300 min-w-[60px] text-right">
            {size}px
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm text-gray-300">
          Background Color
        </label>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg border border-gray-600 overflow-hidden
              shadow-inner"
          >
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-full cursor-pointer border-0 bg-transparent"
              aria-label="Background color picker"
            />
          </div>
          <span className="text-sm text-gray-400 font-mono uppercase">
            {bgColor}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm text-gray-300">
          Foreground Color
        </label>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg border border-gray-600 overflow-hidden
              shadow-inner"
          >
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full h-full cursor-pointer border-0 bg-transparent"
              aria-label="Foreground color picker"
            />
          </div>
          <span className="text-sm text-gray-400 font-mono uppercase">
            {fgColor}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm text-gray-300">
          Error Correction
        </label>
        <Menu as="div" className="relative">
          <Menu.Button className="w-full px-4 py-2 text-left text-sm font-medium
            bg-gray-700 rounded-lg text-gray-200 hover:bg-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500">
            {errorCorrectionLevels.find(l => l.value === level)?.label}
            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </Menu.Button>
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-10 mt-1 w-full rounded-lg bg-gray-700
              shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {errorCorrectionLevels.map((errorLevel) => (
                  <Menu.Item key={errorLevel.value}>
                    {({ active }) => (
                      <button
                        onClick={() => setLevel(errorLevel.value)}
                        className={`${
                          active ? 'bg-gray-600 text-white' : 'text-gray-200'
                        } w-full text-left px-4 py-2 text-sm`}
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
  );
};

export default QRCodeCustomizer; 