import { useEffect, useState } from 'react';
import { useDashboard } from '../DashboardContext/useDashboard';
import { useTransactions } from '../../../../../app/hooks/useTransactions';
import { TransactionFilters } from '../../../../../app/services/transactionsService/getAll';
import { Transaction } from '../../../../../app/entities/Transaction';

export function useTransactionsController() {
  const { areValuesVisible } = useDashboard();
  const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
  const [transactionBeingEdited, setTransactionBeingEdited] = useState<Transaction | null>(null);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    month: new Date().getMonth() ,
    year:  new Date().getFullYear()
  });



  function handleChangeFilters<TFilter extends keyof TransactionFilters>(filter: TFilter){
    return (value: TransactionFilters[TFilter] ) =>{
      if(value === filters[filter]) return;

      setFilters(prevState =>({
        ...prevState,
        [filter]: value
      }));
    };
  }

  const {refetchTransactions, transactions, isLoading, isInitialLoading} = useTransactions(filters);

  useEffect(()=>{
    refetchTransactions();
  },[filters, refetchTransactions]);


  function handleApplyFilters({bankAccountId, year}:{bankAccountId: string | undefined, year: number}){

    handleChangeFilters('bankAccountId')(bankAccountId);
    handleChangeFilters('year')(year);
    setIsFiltersModalOpen(false);

  }

  function handleOpenFiltersModal() {
    setIsFiltersModalOpen(true);
  }

  function handleCloseFiltersModal() {
    setIsFiltersModalOpen(false);
  }

  function handleOpenEditModal(transaction : Transaction){
    setIsEditTransactionModalOpen(true);
    setTransactionBeingEdited(transaction);
  }

  function handleCloseEditModal(){
    setIsEditTransactionModalOpen(false);
    setTransactionBeingEdited(null);
  }

  return {
    areValuesVisible,
    isInitialLoading,
    isLoading,
    transactions,
    isFiltersModalOpen,
    transactionBeingEdited,
    isEditTransactionModalOpen,
    handleCloseFiltersModal,
    handleOpenFiltersModal,
    handleChangeFilters,
    handleApplyFilters,
    handleOpenEditModal,
    handleCloseEditModal,
    filters,
  };
}
