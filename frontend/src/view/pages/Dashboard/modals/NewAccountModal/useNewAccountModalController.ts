import { z } from 'zod';
import { useDashboard } from '../../components/DashboardContext/useDashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { currencyStringToNumber } from '../../../../../app/utils/currencyStringToNumber';
import toast from 'react-hot-toast';
import { bankAccountsService } from '../../../../../app/services/bankAccountsService';

const schema = z.object({
  initialBalance: z.string().nonempty('Saldo inicial é obrigatório'),
  name: z.string().nonempty('Nome da conta é obrigatório'),
  type: z.enum(['CASH', 'CHECKING', 'INVESTMENT']),
  color: z.string().nonempty('Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>


export function useNewAccountModalController() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const {isPending, mutateAsync} = useMutation(
    {mutationFn: bankAccountsService.create}
  );
  const queryClient = useQueryClient();

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        await mutateAsync({
          ...data,
          initialBalance: currencyStringToNumber(data.initialBalance)
        });

        queryClient.invalidateQueries({queryKey:['bankAccounts']});
        toast.success('Conta cadastrada com sucesso');
        closeNewAccountModal();
        reset();
      } catch {
        toast.error('Erro ao cadastrar a conta!');
      }
    });

  const { isNewAccountModalOpen, closeNewAccountModal } = useDashboard();

  return {
    isNewAccountModalOpen,
    closeNewAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isPending
  };
}
