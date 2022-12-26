import { Handler } from '@netlify/functions';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import Recipe from './models/recipe.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  const recipeId = event.queryStringParameters.id;

  if (!recipeId) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Document Id not provided')),
    };
  }

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deletedRecipe) {
      return {
        statusCode: 404,
        body: JSON.stringify(
          new CustomError('Document with provided id not found')
        ),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(deletedRecipe),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not find recipe by id or delete it', error)
      ),
    };
  }
};
