
import React from 'react';
import type { Recipe } from '../types';
import { UI_STRINGS_TR } from '../constants';
import { ClockIcon, FireIcon, ChartBarIcon } from './icons';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const { recipeName, difficulty, prepTime, calories, dietaryRestrictions } = recipe;

  const difficultyColor = {
    'Kolay': 'text-green-500 bg-green-100 dark:bg-green-900/50 dark:text-green-300',
    'Orta': 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Zor': 'text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-300',
  };

  return (
    <div className="bg-white dark:bg-gray-900/70 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="p-6 flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {dietaryRestrictions.map(tag => (
            <span key={tag} className="text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{recipeName}</h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-indigo-500" />
            <span>{UI_STRINGS_TR.recipeCard.difficulty}:</span>
            <span className={`font-semibold px-2 py-0.5 rounded-md ${difficultyColor[difficulty]}`}>{difficulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-indigo-500" />
            <span>{UI_STRINGS_TR.recipeCard.prepTime}:</span>
            <span className="font-semibold">{prepTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <FireIcon className="w-5 h-5 text-indigo-500" />
            <span>{UI_STRINGS_TR.recipeCard.calories}:</span>
            <span className="font-semibold">{calories} kcal</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 mt-auto">
        <button
          onClick={() => onSelect(recipe)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          {UI_STRINGS_TR.recipeCard.viewRecipe}
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
