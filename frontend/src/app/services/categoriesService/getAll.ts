
import { Category } from '../../entities/Categories';
import { httpClient } from '../httpClient';

type CategoryReponse = Array<Category>

export async function getAll() {
  const { data } = await httpClient.get<CategoryReponse>('/categories');

  return data;
}
