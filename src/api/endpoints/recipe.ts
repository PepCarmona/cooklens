import { Endpoint } from '.';
import { URI } from '../../api/config';
import {
  IntegratedSite,
  PaginatedRecipes,
  ClientRecipe,
  SearchType,
} from '../../../types';

interface RecipesEndpointInterface {
  addRecipe(recipe: ClientRecipe): Promise<ClientRecipe>;
  editRecipe(recipe: ClientRecipe): Promise<ClientRecipe>;
  importRecipe(importURL: string): Promise<ClientRecipe>;
  searchRecipes(
    page: number,
    limit: number,
    searchType?: SearchType,
    searchText?: string
  ): Promise<PaginatedRecipes>;
  getRecipe(id: string): Promise<ClientRecipe>;
  getRandomRecipe(): Promise<ClientRecipe>;
  deleteRecipe(recipe: ClientRecipe): Promise<ClientRecipe>;
}

export class RecipesEndpoint
  extends Endpoint
  implements RecipesEndpointInterface
{
  public addRecipe(recipe: ClientRecipe): Promise<ClientRecipe> {
    return this.post(URI.recipes.add, recipe);
  }

  public editRecipe(recipe: ClientRecipe): Promise<ClientRecipe> {
    const url = new URL(URI.recipes.update);
    url.searchParams.append('id', recipe._id!);

    return this.put(url.toString(), recipe);
  }

  public importRecipe(importURL: string): Promise<ClientRecipe> {
    const url = new URL(URI.recipes.import);
    url.searchParams.append('url', importURL);

    return this.get(url.toString());
  }

  public searchRecipes(
    page: number,
    limit: number,
    searchType?: SearchType,
    searchText?: string
  ): Promise<PaginatedRecipes> {
    const url = new URL(URI.recipes.get);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (searchType && searchText) {
      url.searchParams.append('searchType', searchType);
      url.searchParams.append('searchText', searchText);
    }

    return this.get(url.toString());
  }

  public getRecipe(id: string): Promise<ClientRecipe> {
    const url = new URL(URI.recipes.getById);
    url.searchParams.append('id', id);

    return this.get(url.toString());
  }

  public getRandomRecipe(): Promise<ClientRecipe> {
    return this.get(URI.recipes.getRandom);
  }

  public getRecipesByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedRecipes> {
    const url = new URL(URI.recipes.getByUser);
    url.searchParams.append('id', userId);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    return this.get(url.toString());
  }

  public deleteRecipe(recipe: ClientRecipe): Promise<ClientRecipe> {
    const url = new URL(URI.recipes.delete);
    url.searchParams.append('id', recipe._id!);

    return this.delete(url.toString());
  }
}
