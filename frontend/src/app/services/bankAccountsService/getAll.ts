import { BankAccount } from '../../entities/BankAccount';
import { httpClient } from '../httpClient';

type BankAccountReponse = Array<BankAccount>;

export async function getAll() {
  const { data } = await httpClient.get<BankAccountReponse>('/bank-accounts');

  return data;
}
