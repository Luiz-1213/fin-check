
import { Transaction } from '../../entities/Transaction';
import { httpClient } from '../httpClient';

type TransactionsReponse = Array<Transaction>

export interface TransactionFilters {
  month: number
  year: number
  bankAccountId?: string
  type?:'INCOME'| 'EXPENSE'
}

export async function getAll(filters: TransactionFilters) {

  const { data } = await httpClient.get<TransactionsReponse>('/transactions', {params: filters});

  return data;
}
