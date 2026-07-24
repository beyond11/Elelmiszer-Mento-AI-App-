export interface StoreOffer {
  id: string;
  chain: 'Lidl' | 'Tesco' | 'Penny' | 'Spar' | 'Aldi' | 'Auchan' | 'Metro' | 'Egyéb';
  storeName: string;
  productName: string;
  originalPrice: number;
  discountedPrice: number;
  expiryText: string;
  lat: number;
  lng: number;
  category: 'Tejtermék' | 'Pékáru' | 'Hús' | 'Zöldség-Gyümölcs' | 'Készétel' | 'Egyéb';
  stockQuantity: number;
  imageUrl?: string;
}

export interface DonationPoint {
  id: string;
  name: string;
  organization: 'Magyar Vöröskereszt' | 'Élelmiszerbank' | 'Szeretetláda' | 'Egyház / Civil' | 'Egyéb';
  address: string;
  phone: string;
  hours: string;
  acceptedItems: string[];
  lat: number;
  lng: number;
  description: string;
}

export interface UserStats {
  totalSavingsHuf: number;
  totalCarbonSavedKg: number;
  totalMealsSaved: number;
  history: Array<{
    id: string;
    date: string;
    itemName: string;
    savingsHuf: number;
    carbonSavedKg: number;
    type: 'recept' | 'bolt' | 'adomany';
  }>;
}

export interface DetectedItem {
  name: string;
  quantityRating?: string;
  condition?: string;
}

export interface MealPlanItem {
  mealName: string;
  recipeTitle: string;
  description: string;
}

export interface RecipeItem {
  title: string;
  prepTime: string;
  difficulty: "Könnyű" | "Közepes" | "Nehéz" | string;
  ingredientsUsed: string[];
  otherNeeded?: string[];
  steps: string[];
}

export interface AiAnalysisResult {
  detectedItems: DetectedItem[];
  mealPlan: MealPlanItem[];
  recipes: RecipeItem[];
  savingsHuf: number;
  carbonSavedKg: number;
  practicalTips: string[];
}
