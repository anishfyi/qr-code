const TabSwitcher = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div 
      role="tablist"
      className="flex rounded-lg bg-gray-700/50 p-1"
      aria-label="QR code tool tabs"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium 
            transition-all duration-200 min-w-[120px]
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            focus:ring-offset-gray-800
            ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
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