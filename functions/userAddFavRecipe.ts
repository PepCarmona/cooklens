import { Handler } from '@netlify/functions';
import middy from 'middy';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import {
  authMiddleware,
  HandlerEventAuthenticated,
} from './middleware/authMiddleware';
import User from './models/user.model';

connectDB(process.env.MONGODB_URI);

const addFavRecipe: Handler = async (event) => {
  let recipeId: string;
  try {
    recipeId = JSON.parse(event.body)._id;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Provided recipe is not a valid JSON object', error)
      ),
    };
  }

  const user = (event as HandlerEventAuthenticated).auth.user;

  if (!recipeId) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('No recipe provided')),
    };
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, favRecipes: { $ne: recipeId } },
      { $push: { favRecipes: recipeId } },
      { new: true }
    );
    return {
      statusCode: 200,
      body: JSON.stringify(updatedUser),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not find user by id or update it', error)
      ),
    };
  }
};

export const handler = middy(addFavRecipe).use(authMiddleware());
