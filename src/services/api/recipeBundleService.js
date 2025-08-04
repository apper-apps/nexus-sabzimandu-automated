import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Recipe ingredient mappings
const recipeBundles = {
  biryani: {
    name: "Chicken Biryani Bundle",
    nameUrdu: "چکن بریانی بنڈل",
    description: "Complete ingredients for authentic chicken biryani",
    descriptionUrdu: "مستند چکن بریانی کے لیے مکمل اجزاء",
    ingredients: [
      { productId: 6, quantity: 2, weight: "1kg" }, // Basmati Rice
      { productId: 4, quantity: 1, weight: "1kg" }, // Red Onions
      { productId: 11, quantity: 1, weight: "250g" }, // Fresh Ginger
      { productId: 195, quantity: 1, weight: "100g", name: "Garam Masala", price: 150 }, // Mock spice
      { productId: 196, quantity: 1, weight: "500g", name: "Yogurt", price: 120 } // Mock dairy
    ],
    totalPrice: 890,
    savings: 60,
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51b?w=400&h=400&fit=crop"
  },
  
  karahi: {
    name: "Chicken Karahi Bundle",
    nameUrdu: "چکن کڑاہی بنڈل", 
    description: "Fresh ingredients for spicy chicken karahi",
    descriptionUrdu: "مسالہ دار چکن کڑاہی کے لیے تازہ اجزاء",
    ingredients: [
      { productId: 1, quantity: 2, weight: "1kg" }, // Fresh Tomatoes
      { productId: 4, quantity: 1, weight: "500g" }, // Red Onions
      { productId: 8, quantity: 1, weight: "250g" }, // Green Chilies
      { productId: 11, quantity: 1, weight: "100g" }, // Fresh Ginger
      { productId: 197, quantity: 1, weight: "200ml", name: "Cooking Oil", price: 180 }
    ],
    totalPrice: 520,
    savings: 40,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop"
  },

  pulao: {
    name: "Vegetable Pulao Bundle",
    nameUrdu: "سبزی پلاؤ بنڈل",
    description: "Complete vegetables and rice for delicious pulao",
    descriptionUrdu: "لذیذ پلاؤ کے لیے مکمل سبزیاں اور چاول",
    ingredients: [
      { productId: 6, quantity: 1, weight: "1kg" }, // Basmati Rice
      { productId: 5, quantity: 1, weight: "500g" }, // Fresh Carrots
      { productId: 9, quantity: 1, weight: "500g" }, // Fresh Potatoes
      { productId: 2, quantity: 1, weight: "1 bunch" }, // Organic Spinach
      { productId: 4, quantity: 1, weight: "500g" } // Red Onions
    ],
    totalPrice: 450,
    savings: 35,
    image: "https://images.unsplash.com/photo-1596040033229-a50b7c8a54f9?w=400&h=400&fit=crop"
  },

  daal: {
    name: "Mixed Daal Bundle",
    nameUrdu: "مکس دال بنڈل",
    description: "Essential ingredients for healthy mixed lentils",
    descriptionUrdu: "صحت مند مکس دال کے لیے ضروری اجزاء",
    ingredients: [
      { productId: 1, quantity: 1, weight: "500g" }, // Fresh Tomatoes
      { productId: 4, quantity: 1, weight: "500g" }, // Red Onions
      { productId: 11, quantity: 1, weight: "100g" }, // Fresh Ginger
      { productId: 8, quantity: 1, weight: "100g" }, // Green Chilies
      { productId: 198, quantity: 1, weight: "1kg", name: "Mixed Lentils", price: 220 }
    ],
    totalPrice: 380,
    savings: 25,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop"
  }
};

const recipeKeywords = {
  biryani: ['biryani', 'برانی', 'pulao', 'پلاؤ', 'rice dish'],
  karahi: ['karahi', 'کڑاہی', 'chicken curry', 'مرغ'],
  pulao: ['pulao', 'پلاؤ', 'vegetable rice', 'سبزی چاول'],
  daal: ['daal', 'dal', 'دال', 'lentils', 'مسور']
};

const recipeBundleService = {
  async searchRecipes(query) {
    await delay(200);
    
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const matchedRecipes = [];

    Object.entries(recipeKeywords).forEach(([recipeKey, keywords]) => {
      const isMatch = keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm) || 
        searchTerm.includes(keyword.toLowerCase())
      );
      
      if (isMatch && recipeBundles[recipeKey]) {
        matchedRecipes.push({
          key: recipeKey,
          ...recipeBundles[recipeKey]
        });
      }
    });

    return matchedRecipes;
  },

  async getBundle(recipeKey) {
    await delay(300);
    
    if (!recipeBundles[recipeKey]) {
      throw new Error("Recipe bundle not found");
    }

    const bundle = { ...recipeBundles[recipeKey] };
    
    // Enrich with actual product data where available
    bundle.ingredients = bundle.ingredients.map(ingredient => {
      const product = productsData.find(p => p.Id === ingredient.productId);
      if (product) {
        return {
          ...ingredient,
          name: product.name,
          nameUrdu: product.nameUrdu,
          price: product.price,
          image: product.images[0],
          unit: product.unit,
          vendorName: product.vendorName
        };
      }
      return ingredient;
    });

    return bundle;
  },

  async getAllBundles() {
    await delay(200);
    
    return Object.entries(recipeBundles).map(([key, bundle]) => ({
      key,
      ...bundle
    }));
  }
};

export { recipeBundleService };