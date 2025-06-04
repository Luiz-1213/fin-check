import { z } from 'zod';
import { useDashboard } from '../../components/DashboardContext/useDashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { currencyStringToNumber } from '../../../../../app/utils/currencyStringToNumber';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { bankAccountsService } from '../../../../../app/services/bankAccountsService';

const schema = z.object({
  initialBalance: z.union([
    z.string().nonempty('Saldo inicial é obrigatório'),
    z.number()
  ]),
  name: z.string().nonempty('Nome da conta é obrigatório'),
  type: z.enum(['CASH', 'CHECKING', 'INVESTMENT']),
  color: z.string().nonempty('Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>


export function useEditAccountModalController() {
  const {
    isEditAccountModalOpen,
    closeEditAccountModal,
    accountBeingEdited,
  } = useDashboard();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues:{
      name: accountBeingEdited?.name,
      type: accountBeingEdited?.type,
      color: accountBeingEdited?.color,
      initialBalance: accountBeingEdited?.currentBalance
    }
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    isPending,
    mutateAsync: updateAccount
  } = useMutation(
    {mutationFn: bankAccountsService.update}
  );
  const {
    isPending: isLoadingDelete,
    mutateAsync: removeAccount
  } = useMutation(
    {mutationFn: bankAccountsService.remove}
  );
  const queryClient = useQueryClient();

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        await updateAccount({
          id: accountBeingEdited!.id,
          ...data,
          initialBalance: currencyStringToNumber(data.initialBalance)
        });

        queryClient.invalidateQueries({queryKey:['bankAccounts']});
        toast.success('A conta foi editada com sucesso!');
        closeEditAccountModal();
      } catch {
        toast.error('Erro ao salvar as alterações!');
      }
    });

  function handleOpenDeleteModal(){
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal(){
    setIsDeleteModalOpen(false);
  }

  async function handleDeleteAccount(){
    try {
      await removeAccount(accountBeingEdited!.id);

      queryClient.invalidateQueries({queryKey:['bankAccounts']});
      toast.success('A conta foi deletada com sucesso!');
      closeEditAccountModal();
    } catch {
      toast.error('Erro ao deletar a conta!');
    }
  }




  return {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isPending,
    accountBeingEdited,
    isDeleteModalOpen,
    isLoadingDelete,
    handleCloseDeleteModal,
    handleOpenDeleteModal,
    handleDeleteAccount
  };
}
