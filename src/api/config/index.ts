const apiUrl = `${location.protocol}//${location.host}/api`;

export const URI = {
  recipes: {
    get: `${apiUrl}/recipeGetAll`,
    getById: `${apiUrl}/recipeGetById`,
    getRandom: `${apiUrl}/recipeRandom`,
    getByUser: `${apiUrl}/recipeGetByUser`,
    add: `${apiUrl}/recipeAdd`,
    update: `${apiUrl}/recipeUpdate`,
    delete: `${apiUrl}/recipeDelete`,
    import: `${apiUrl}/recipeImport`,
  },
  auth: {
    register: `${apiUrl}/authSignup`,
    verify: `${apiUrl}/authVerifyUser`,
    login: `${apiUrl}/authSignin`,
    loginFromToken: `${apiUrl}/authSigninFromToken`,
    recover: `${apiUrl}/authRecoverPassword`,
    changePassword: `${apiUrl}/authChangePassword`,
  },
  user: {
    addFavRecipe: `${apiUrl}/userAddFavRecipe`,
    removeFavRecipe: `${apiUrl}/userRemoveFavRecipe`,
    getFavRecipes: `${apiUrl}/userGetFavRecipes`,
  },
  mealPlan: {
    get: `${apiUrl}/mealPlan/getMealPlan`,
    update: `${apiUrl}/mealPlan/updateMealPlan`,
  },
};
