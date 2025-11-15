
import React from 'react';
import { UI_STRINGS_TR } from '../constants';
import { TrashIcon } from './icons';

interface ShoppingListProps {
  items: string[];
  onRemoveItem: (item: string) => void;
  onClearList: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemoveItem, onClearList }) => {
  return (
    <div className="bg-white dark:bg-gray-900/70 p-8 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-2xl font-bold">{UI_STRINGS_TR.shoppingList.title}</h2>
        {items.length > 0 && (
          <button 
            onClick={onClearList}
            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            {UI_STRINGS_TR.shoppingList.clearList}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">{UI_STRINGS_TR.shoppingList.empty}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <span className="text-lg">{item}</span>
              <button 
                onClick={() => onRemoveItem(item)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title={`'${item}' öğesini kaldır`}
              >
                <TrashIcon className="w-5 h-5"/>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingList;
