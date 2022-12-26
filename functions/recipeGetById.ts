import { Handler } from '@netlify/functions';
import { UserInfo } from '../types';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import Recipe from './models/recipe.model';
import './models/user.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  const recipeId = event.queryStringParameters.id;

  if (!recipeId) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('No id provided')),
    };
  }

  try {
    const foundRecipe = await Recipe.findById(recipeId).populate<{
      author: UserInfo;
    }>('author');

    return {
      statusCode: 200,
      body: JSON.stringify(foundRecipe),
    };
  } catch (error) {
    if (error?.name === 'CastError') {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('The provided id is not valid')),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not find recipe by id', error)
      ),
    };
  }
};
