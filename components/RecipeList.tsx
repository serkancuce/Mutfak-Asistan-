
import React from 'react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { UI_STRINGS_TR } from '../constants';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onRecipeSelect }) => {
  if (recipes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900/70 p-8 rounded-2xl shadow-lg">
        <p className="text-xl text-gray-500 dark:text-gray-400">{UI_STRINGS_TR.noRecipesFound}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {recipes.map((recipe, index) => (
        <RecipeCard key={`${recipe.recipeName}-${index}`} recipe={recipe} onSelect={onRecipeSelect} />
      ))}
    </div>
  );
};

export default RecipeList;
