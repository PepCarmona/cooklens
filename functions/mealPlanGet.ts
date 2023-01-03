import { Handler } from '@netlify/functions';
import middy from 'middy';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import {
  authMiddleware,
  HandlerEventAuthenticated,
} from './middleware/authMiddleware';
import MealPlan from './models/mealPlan.model';
import './models/recipe.model';

connectDB(process.env.MONGODB_URI);

const getMealPlan: Handler = async (event) => {
  const user = (event as HandlerEventAuthenticated).auth.user;

  try {
    const foundMealPlan = await MealPlan.findOne({ users: user._id }).populate(
      'days.meals.recipe'
    );

    if (foundMealPlan !== null) {
      return {
        statusCode: 200,
        body: JSON.stringify(foundMealPlan),
      };
    }

    const mealPlanDocument = new MealPlan({ users: [user._id] });
    try {
      const savedMealPlan = await mealPlanDocument.save();

      return {
        statusCode: 200,
        body: JSON.stringify(savedMealPlan),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(
          new CustomError('Could not save week plan', error)
        ),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Could not find week plan', error)),
    };
  }
};

export const handler = middy(getMealPlan).use(authMiddleware());
