
import React from 'react';
import { UI_STRINGS_TR } from '../constants';
import { RecipeIcon, ShoppingBagIcon, FilterIcon } from './icons';

interface Filter {
  id: string;
  name: string;
}

interface FilterSidebarProps {
  filters: Filter[];
  activeFilters: string[];
  onFilterChange: (filterId: string) => void;
  activeTab: 'recipes' | 'shoppingList';
  onTabChange: (tab: 'recipes' | 'shoppingList') => void;
  shoppingListCount: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  activeFilters, 
  onFilterChange,
  activeTab,
  onTabChange,
  shoppingListCount
}) => {
  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="bg-white dark:bg-gray-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg h-full">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            onClick={() => onTabChange('recipes')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'recipes' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <RecipeIcon className="w-5 h-5" />
            {UI_STRINGS_TR.recipesTab}
          </button>
          <button 
            onClick={() => onTabChange('shoppingList')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'shoppingList' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <ShoppingBagIcon className="w-5 h-5" />
            {UI_STRINGS_TR.shoppingListTab}
            {shoppingListCount > 0 && (
              <span className="absolute top-1 right-2 bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {shoppingListCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters (only show on recipes tab) */}
        {activeTab === 'recipes' && (
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              {UI_STRINGS_TR.filtersTitle}
            </h3>
            <div className="space-y-3">
              {filters.map(filter => (
                <label key={filter.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(filter.id)}
                    onChange={() => onFilterChange(filter.id)}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{filter.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
