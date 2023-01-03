import { Handler } from '@netlify/functions';
import middy from 'middy';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import { authMiddleware } from './middleware/authMiddleware';
import MealPlan, { IMealPlan } from './models/mealPlan.model';
import './models/recipe.model';

connectDB(process.env.MONGODB_URI);

const updateMealPlan: Handler = async (event) => {
  let mealPlan: IMealPlan;
  try {
    mealPlan = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Provided mealPlan is not a valid JSON object', error)
      ),
    };
  }

  if (!mealPlan || Object.keys(mealPlan).length === 0) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Cannot save empty objects')),
    };
  }

  const mealPlanId = event.queryStringParameters.id;
  try {
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      mealPlanId,
      mealPlan,
      {
        new: true,
      }
    );

    if (!updatedMealPlan) {
      return {
        statusCode: 500,
        body: JSON.stringify(
          new CustomError(
            'Document with provided id not found or not enough permissions to update it'
          )
        ),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(updatedMealPlan),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not find week plan by id or update it', error)
      ),
    };
  }
};

export const handler = middy(updateMealPlan).use(authMiddleware());
