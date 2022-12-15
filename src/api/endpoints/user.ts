import { Endpoint } from '.';
import { URI } from '../config';
import { PaginatedRecipes, ClientRecipe, User } from '../../../types';

interface UserEndpointInterface {
  addFavRecipe(recipe: ClientRecipe): Promise<User>;

  removeFavRecipe(recipe: ClientRecipe): Promise<User>;

  getFavRecipes(page: number, limit: number): Promise<PaginatedRecipes>;
}

export class UserEndpoint extends Endpoint implements UserEndpointInterface {
  public addFavRecipe(recipe: ClientRecipe): Promise<User> {
    return this.put(URI.user.addFavRecipe, recipe);
  }

  public removeFavRecipe(recipe: ClientRecipe): Promise<User> {
    return this.put(URI.user.removeFavRecipe, recipe);
  }

  public getFavRecipes(page: number, limit: number): Promise<PaginatedRecipes> {
    const url = new URL(URI.user.getFavRecipes);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    return this.get(url.toString());
  }
}
