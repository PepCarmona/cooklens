import { Handler } from '@netlify/functions';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import got from 'got';

import {
  healthTypes,
  cuisineTypes,
  dishTypes,
  mealTypes,
  Response,
} from './integration/edamam/types';
import { compareStringsContent } from './helpers/comparison';
import { EdamamRecipeIntegration } from './integration/edamam';
import { getFunctionHost } from './helpers/context';
import { PaginatedResult } from './helpers/pagination';

interface EdamamParams {
  query?: string;
  health?: string;
  cuisine?: string;
  meal?: string;
  dish?: string;
  _cont?: string;
}

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event, context) => {
  const params: EdamamParams = {
    query: event.queryStringParameters.query ?? '*',
    health: event.queryStringParameters.health,
    cuisine: event.queryStringParameters.cuisine,
    meal: event.queryStringParameters.meal,
    dish: event.queryStringParameters.dish,
    _cont: event.queryStringParameters._cont,
  };

  const options: Record<string, any> = {
    url: 'https://api.edamam.com/api/recipes/v2',
    searchParams: {
      type: 'public',
      app_id: process.env.EDAMAM_SEARCH_ID,
      app_key: process.env.EDAMAM_SEARCH_KEY,
      q: params.query,
    },
  };

  if (params.health) {
    if (!healthTypes.find((x) => compareStringsContent(x, params.health!))) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Not allowed health type')),
      };
    }

    options.searchParams.health = params.health;
  }

  if (params.cuisine) {
    if (!cuisineTypes.find((x) => compareStringsContent(x, params.cuisine!))) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Not allowed cuisine type')),
      };
    }

    options.searchParams.cuisineType = params.cuisine;
  }

  if (params.meal) {
    if (!mealTypes.find((x) => compareStringsContent(x, params.meal!))) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Not allowed meal type')),
      };
    }

    options.searchParams.mealType = params.meal;
  }

  if (params.dish) {
    if (!dishTypes.find((x) => compareStringsContent(x, params.dish!))) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Not allowed dish type')),
      };
    }

    options.searchParams.dishType = params.dish;
  }

  if (params._cont) {
    options.searchParams._cont = params._cont;
  }

  try {
    const edamamResponse: Response = await got(options).json();

    const recipes = edamamResponse.hits.map(async ({ recipe }) => {
      const integratedRecipe = new EdamamRecipeIntegration(recipe.url);

      await integratedRecipe.populate(recipe);

      return integratedRecipe;
    });

    const result = await Promise.all(recipes);

    const paginatedResult: PaginatedResult<EdamamRecipeIntegration> = {
      result,
      next: getNextUrl(edamamResponse, getFunctionHost(event, context), params),
      prev: null,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(paginatedResult),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('got error', error)),
    };
  }
};

function getNextUrl(
  response: Response,
  functionHost: string,
  params: EdamamParams
) {
  const edamamNextUrl = response._links.next?.href;

  if (!edamamNextUrl) {
    return null;
  }

  const nextUrl = new URL(functionHost + '/recipes/explore');
  if (params.query !== '*') {
    nextUrl.searchParams.append('query', params.query);
  }
  if (params.health) {
    nextUrl.searchParams.append('health', params.health);
  }
  if (params.cuisine) {
    nextUrl.searchParams.append('cuisine', params.cuisine);
  }
  if (params.meal) {
    nextUrl.searchParams.append('meal', params.meal);
  }
  if (params.dish) {
    nextUrl.searchParams.append('dish', params.dish);
  }

  const _cont = new URL(edamamNextUrl).searchParams.get('_cont');

  if (_cont) {
    nextUrl.searchParams.append('_cont', _cont);
  }

  return nextUrl.toString();
}
