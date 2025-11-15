
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

import { analyzeImageAndSuggestRecipes } from './services/geminiService';
import type { Recipe } from './types';
import { DIETARY_FILTERS, UI_STRINGS_TR } from './constants';
import ImageUpload from './components/ImageUpload';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import RecipeList from './components/RecipeList';
import ShoppingList from './components/ShoppingList';
import CookingModeModal from './components/CookingModeModal';
import Spinner from './components/Spinner';

type ActiveTab = 'recipes' | 'shoppingList';

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] =useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('recipes');
  
  const handleImageUpload = useCallback(async (file: File) => {
    setImage(file);
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setFilteredRecipes([]);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const suggestedRecipes = await analyzeImageAndSuggestRecipes(base64String);
          setRecipes(suggestedRecipes);
          setFilteredRecipes(suggestedRecipes);
          setActiveTab('recipes');
        } catch (err) {
          setError(UI_STRINGS_TR.analysisError);
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(UI_STRINGS_TR.imageProcessingError);
      console.error(err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredRecipes(recipes);
      return;
    }

    const newFilteredRecipes = recipes.filter(recipe => 
      activeFilters.every(filter => 
        recipe.dietaryRestrictions.includes(filter)
      )
    );
    setFilteredRecipes(newFilteredRecipes);
  }, [activeFilters, recipes]);

  const handleFilterChange = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };
  
  const handleAddToShoppingList = useCallback((item: string) => {
    setShoppingList(prev => {
      if (!prev.includes(item)) {
        return [...prev, item];
      }
      return prev;
    });
  }, []);

  const handleRemoveFromShoppingList = useCallback((item: string) => {
    setShoppingList(prev => prev.filter(i => i !== item));
  }, []);
  
  const handleClearShoppingList = useCallback(() => {
    setShoppingList([]);
  }, []);

  const resetApp = () => {
    setImage(null);
    setRecipes([]);
    setFilteredRecipes([]);
    setIsLoading(false);
    setError(null);
    setActiveFilters([]);
    setSelectedRecipe(null);
    setActiveTab('recipes');
  };

  if (!image) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
        <Header onLogoClick={resetApp} isHome={true} />
        <ImageUpload onImageUpload={handleImageUpload} isLoading={isLoading} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <Header onLogoClick={resetApp} isHome={false} />
      
      <main className="container mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        <FilterSidebar 
          filters={DIETARY_FILTERS}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          shoppingListCount={shoppingList.length}
        />

        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <Spinner />
                <p className="mt-4 text-lg font-semibold">{UI_STRINGS_TR.loadingMessage}</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center">
                <p className="text-red-500 text-xl">{error}</p>
                <button 
                  onClick={resetApp}
                  className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {UI_STRINGS_TR.tryAgain}
                </button>
            </div>
          ) : (
            <>
              {activeTab === 'recipes' ? (
                <RecipeList recipes={filteredRecipes} onRecipeSelect={setSelectedRecipe} />
              ) : (
                <ShoppingList 
                  items={shoppingList} 
                  onRemoveItem={handleRemoveFromShoppingList} 
                  onClearList={handleClearShoppingList} 
                />
              )}
            </>
          )}
        </div>
      </main>

      {selectedRecipe && (
        <CookingModeModal 
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToShoppingList={handleAddToShoppingList}
        />
      )}
    </div>
  );
};

export default App;
