import { Controller } from 'react-hook-form';
import { Button } from '../../../../components/Button';
import { DatePickerInput } from '../../../../components/DatePickerInput';
import { Input } from '../../../../components/Input';
import { InputCurrency } from '../../../../components/InputCurrency';
import { Modal } from '../../../../components/Modal';
import { Select } from '../../../../components/Select';
import { useEditTransactionModalController } from './useEditTransactionModalController';
import { Transaction } from '../../../../../app/entities/Transaction';
import { ConfirmDeleteModal } from '../../../../components/ConfirmDeleteModal';
import { TrashIcon } from '../../../../components/icons/TrashIcon';


interface EditTransactionModalProps{
  transaction: Transaction | null
  open: boolean
  onClose(): void
}


export  function EditTransactionModal({ transaction, onClose, open}:EditTransactionModalProps) {

  const {
    control,
    handleSubmit,
    errors,
    register,
    accounts,
    categories,
    isLoading,
    isDeleteModalOpen,
    isLoadingDelete,
    handleCloseDeleteModal,
    handleDeleteTransaction,
    handleOpenDeleteModal
  } = useEditTransactionModalController(transaction, onClose);

  const isExpense = transaction?.type === 'EXPENSE';

  if(isDeleteModalOpen){
    return <ConfirmDeleteModal
      isLoading={isLoadingDelete}
      onConfirm={handleDeleteTransaction}
      onClose={handleCloseDeleteModal}
      title={`Tem certeza que deseja excluir esta ${isExpense ? 'despesa' : 'receita'}?`}
    />;
  }



  return (
    <Modal
      title={ isExpense ? 'Editar Despesa' : 'Editar Receita'}
      open={open}
      onClose={onClose}
      rightAction={
        (<button onClick={handleOpenDeleteModal}>
          <TrashIcon className='w-6 h-6 text-red-900'/>
        </button>)
      }
    >
      <form onSubmit={handleSubmit}>
        <div>
          <span className='text-gray-600 text-xs tracking-[-0.5px]'>Valor da {isExpense ? 'Despesa' : 'Receita'}</span>
          <div className='flex gap-2 items-center'>
            <span className='text-gray-600 text-lg tracking-[-0.5px]'>R$</span>
            <Controller
              name='value'
              defaultValue="0"
              control={control}
              render={({field: {onChange, value}})=> (
                <InputCurrency
                  error={errors.value?.message}
                  onChange={onChange}
                  value={value}
                />)}
            />
          </div>
        </div>
        <div className='mt-10 flex flex-col gap-4'>
          <Input
            type='text'
            placeholder={isExpense ? 'Nome da Despesa' : 'Nome da Receita'}
            {...register('name')}
            error={errors.name?.message}
          />

          <Controller
            name='categoryId'
            control={control}
            defaultValue=''
            render={({field: {onChange, value}})=> (
              <Select
                placeholder={'Categoria'}
                error={errors.categoryId?.message}
                onChange={onChange}
                value={value}
                options={
                  categories.map((category)=> (
                    {
                      value: category.id ,
                      label: category.name
                    }))
                }>

              </Select>
            )}
          />

          <Controller
            name='bankAccountId'
            control={control}
            defaultValue=''
            render={({field: {onChange, value}})=> (
              <Select
                onChange={onChange}
                value={value}
                placeholder={isExpense ? 'Pagar com' : 'Receber com '}
                error={errors.bankAccountId?.message}
                options={
                  accounts.map((account)=> (
                    {
                      value: account.id ,
                      label: account.name
                    }))
                }>
              </Select>
            )}
          />
          <Controller
            control={control}
            name='date'
            defaultValue={new Date()}
            render={({field:{onChange, value}})=> (
              <DatePickerInput
                error={errors.date?.message}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        <Button
          type='submit'
          className='w-full mt-6'
          isLoading={isLoading}
        >Salvar</Button>
      </form>

    </Modal>
  );
}
