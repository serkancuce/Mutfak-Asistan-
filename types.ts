
export interface Recipe {
  recipeName: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  prepTime: string;
  calories: number;
  ingredients: string[];
  instructions: string[];
  dietaryRestrictions: string[];
}
