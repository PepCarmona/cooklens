import { Handler } from '@netlify/functions';
import { ClientRecipe } from '../types';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import Recipe from './models/recipe.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  let recipe: ClientRecipe;
  try {
    recipe = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Provided recipe is not a valid JSON object', error)
      ),
    };
  }

  if (!recipe || Object.keys(recipe).length === 0) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Cannot save empty objects')),
    };
  }

  const recipeDocument = new Recipe(recipe);

  try {
    const savedRecipe = await recipeDocument.save();
    return {
      statusCode: 200,
      body: JSON.stringify(savedRecipe),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Unable to save item to database', error)
      ),
    };
  }
};
