import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBankAccounts } from '../../../../../app/hooks/useBankAccounts';
import { useCategories } from '../../../../../app/hooks/useCategories';
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../../../../../app/services/transactionsService';
import toast from 'react-hot-toast';
import { currencyStringToNumber } from '../../../../../app/utils/currencyStringToNumber';
import { Transaction } from '../../../../../app/entities/Transaction';


const schema = z.object({
  value: z.union([
    z.string().nonempty('Informe o valor'),
    z.number()
  ]),
  name: z.string().nonempty('Informe o nome'),
  categoryId: z.string().nonempty('Informe a categoria'),
  bankAccountId: z.string().nonempty('Informe a conta'),
  date: z.date()
});

type FormData = z.infer<typeof schema>

export function useEditTransactionModalController(
  transaction: Transaction | null, onClose:()=> void
) {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,

  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues:{
      bankAccountId: transaction?.bankAccountId,
      categoryId: transaction?.categoryId,
      name: transaction?.name,
      value: transaction?.value,
      date:  transaction ? new Date(transaction.date) : new Date()
    }
  });

  const {accounts} = useBankAccounts();
  const {categories: categoriesList}= useCategories();
  const {
    isPending,
    mutateAsync: updateTransaction
  } = useMutation(
    {mutationFn: transactionsService.update}
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    isPending: isLoadingDelete,
    mutateAsync: removeTransaction
  } = useMutation(
    {mutationFn: transactionsService.remove}
  );

  const queryClient = useQueryClient();

  const handleSubmit = hookFormSubmit(
    async (data) => {
      if(!transaction) return;
      try {
        await updateTransaction({
          id: transaction.id,
          ...data,
          type: transaction.type,
          date: data.date.toISOString(),
          value: currencyStringToNumber(data.value)
        });

        queryClient.invalidateQueries({queryKey:['transactions']});
        queryClient.invalidateQueries({queryKey:['bankAccounts']});

        toast.success(
          transaction.type === 'EXPENSE'
            ? 'Despesa editada com sucesso!'
            : 'Receita editada com sucesso!'
        );
        onClose();
      } catch {
        toast.success(
          transaction.type === 'EXPENSE'
            ? 'Erro ao salvar a Despesa!'
            : 'Erro ao salvar a Receita!'
        );

      }
    });


  const categories = useMemo(()=>{
    return categoriesList.filter((category)=> category.type === transaction?.type);
  },[categoriesList, transaction]);


  function handleOpenDeleteModal(){
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal(){
    setIsDeleteModalOpen(false);
  }

  async function handleDeleteTransaction(){
    try {
      await removeTransaction(transaction!.id);

      queryClient.invalidateQueries({queryKey:['transactions']});
      queryClient.invalidateQueries({queryKey:['bankAccounts']});
      toast.success(
        transaction!.type === 'EXPENSE'
          ? 'A despesa foi deletada com sucesso!'
          : 'A receita foi deletada com sucesso!'
      );
      onClose();
    } catch {
      toast.error(
        transaction!.type === 'EXPENSE'
          ? 'Erro ao deletar a despesa!'
          : 'Erro ao deletar a receita!'
      );
    }
  }

  return {
    register,
    errors,
    control,
    accounts,
    categories,
    isLoading: isPending,
    handleSubmit,
    isDeleteModalOpen,
    isLoadingDelete,
    handleCloseDeleteModal,
    handleDeleteTransaction,
    handleOpenDeleteModal
  };
}
