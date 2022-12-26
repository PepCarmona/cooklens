import { Handler } from '@netlify/functions';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import Recipe, { IRecipe } from './models/recipe.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  const recipeId = event.queryStringParameters.id;
  let recipe: IRecipe;
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
  if (!recipeId) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Document Id not provided')),
    };
  }

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, recipe, {
      new: true,
    });
    if (!updatedRecipe) {
      return {
        statusCode: 500,
        body: JSON.stringify(
          new CustomError('Document with provided id not found')
        ),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(updatedRecipe),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not find recipe by id or update it', error)
      ),
    };
  }
};
