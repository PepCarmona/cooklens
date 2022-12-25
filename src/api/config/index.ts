const apiUrl = `${location.protocol}//${location.host}/api`;

export const URI = {
  recipes: {
    get: `${apiUrl}/recipeGetAll`,
    getById: `${apiUrl}/recipes/getById`,
    getRandom: `${apiUrl}/recipeRandom`,
    getByUser: `${apiUrl}/recipes/getByUser`,
    add: `${apiUrl}/recipes/add`,
    update: `${apiUrl}/recipes/update`,
    delete: `${apiUrl}/recipes/delete`,
    import: `${apiUrl}/recipes/import`,
    integratedSites: `${apiUrl}/recipes/integrated-sites`,
  },
  auth: {
    register: `${apiUrl}/auth/signup`,
    verify: `${apiUrl}/auth/verifyUser`,
    login: `${apiUrl}/auth/signin`,
    loginFromToken: `${apiUrl}/auth/signinFromToken`,
  },
  user: {
    addFavRecipe: `${apiUrl}/user/addFavRecipe`,
    removeFavRecipe: `${apiUrl}/user/removeFavRecipe`,
    getFavRecipes: `${apiUrl}/user/getFavRecipes`,
  },
  mealPlan: {
    get: `${apiUrl}/mealPlan/getMealPlan`,
    update: `${apiUrl}/mealPlan/updateMealPlan`,
  },
};
