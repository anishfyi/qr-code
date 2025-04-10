import { NavLink } from 'react-router-dom';

interface Tab {
  id: string;
  label: string;
  path: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
}

const TabSwitcher = ({ tabs }: TabSwitcherProps) => {
  return (
    <div className="flex rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) => `
            flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200
            ${isActive 
              ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm transform scale-100'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transform scale-95 hover:scale-100'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>{tab.label}</span>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default TabSwitcher; 