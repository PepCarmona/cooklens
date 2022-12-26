import { Handler } from '@netlify/functions';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import Recipe from './models/recipe.model';
import { MetadataRecipeIntegration } from './integration/metadata';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  const urlString = event.queryStringParameters.url;

  if (!urlString) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('URL query parameter not provided')),
    };
  }

  const recipeIntegration = new MetadataRecipeIntegration(urlString);

  try {
    await recipeIntegration.populate();
    if (recipeIntegration === null) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Recipe integration failed')),
      };
    }

    try {
      const foundRecipe = await Recipe.findOne({ url: recipeIntegration.url });
      if (foundRecipe !== null) {
        return {
          statusCode: 500,
          body: JSON.stringify(
            new CustomError(
              'There already exists a recipe imported from this same url'
            )
          ),
        };
      }

      if (!event.queryStringParameters.save) {
        return {
          statusCode: 200,
          body: JSON.stringify(recipeIntegration),
        };
      }

      const DB_recipe = new Recipe(recipeIntegration);

      try {
        const savedRecipe = await DB_recipe.save();
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
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Could not find recipe', error)),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Recipe integration failed', error)),
    };
  }
};
