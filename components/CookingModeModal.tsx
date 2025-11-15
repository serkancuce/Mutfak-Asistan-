
import React, { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '../types';
import { UI_STRINGS_TR } from '../constants';
import { PlusCircleIcon, VolumeUpIcon, StopIcon, XIcon } from './icons';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onAddToShoppingList: (item: string) => void;
}

const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, onClose, onAddToShoppingList }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopSpeaking();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function to stop speaking when the modal is closed
    return () => {
      stopSpeaking();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [stopSpeaking]);

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const textToRead = [
      recipe.recipeName,
      UI_STRINGS_TR.cookingMode.ingredients,
      ...recipe.ingredients,
      UI_STRINGS_TR.cookingMode.instructions,
      ...recipe.instructions
    ].join('. ');

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'tr-TR';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{UI_STRINGS_TR.cookingMode.title}</h2>
            <h3 className="text-xl font-semibold">{recipe.recipeName}</h3>
          </div>
          <div className="flex items-center gap-4">
             <button
              onClick={handleReadAloud}
              className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors ${
                isSpeaking 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isSpeaking ? <StopIcon className="w-5 h-5"/> : <VolumeUpIcon className="w-5 h-5" />}
              <span>{isSpeaking ? UI_STRINGS_TR.cookingMode.stopReading : UI_STRINGS_TR.cookingMode.readAloud}</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <XIcon className="w-8 h-8"/>
            </button>
          </div>
        </header>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h4 className="text-lg font-bold mb-4 border-b pb-2 border-gray-300 dark:border-gray-600">{UI_STRINGS_TR.cookingMode.ingredients}</h4>
              <ul className="space-y-2 text-lg">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center justify-between gap-2">
                    <span>{ingredient}</span>
                    <button 
                      onClick={() => onAddToShoppingList(ingredient)} 
                      title={UI_STRINGS_TR.cookingMode.addToShoppingList}
                      className="text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                      <PlusCircleIcon className="w-6 h-6"/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-lg font-bold mb-4 border-b pb-2 border-gray-300 dark:border-gray-600">{UI_STRINGS_TR.cookingMode.instructions}</h4>
              <ol className="space-y-4 text-lg list-decimal list-inside">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingModeModal;
