type NutritionInfo = {
    calories: number,
    fat: number,
    carb: number,
    protein: number,
}

type NutritionListEntry = {
    dessert: string;
    nutritionInfo: NutritionInfo;
}