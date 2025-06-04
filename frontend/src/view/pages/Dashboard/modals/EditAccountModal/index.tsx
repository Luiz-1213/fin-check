import { Controller } from 'react-hook-form';
import { Button } from '../../../../components/Button';
import ColorsDropdownInput from '../../../../components/ColorsDropdownInput';
import { Input } from '../../../../components/Input';
import { InputCurrency } from '../../../../components/InputCurrency';
import { Modal } from '../../../../components/Modal';
import { Select } from '../../../../components/Select';
import { useEditAccountModalController } from './useEditAccountModalController';
import { TrashIcon } from '../../../../components/icons/TrashIcon';
import { ConfirmDeleteModal } from '../../../../components/ConfirmDeleteModal';


export  function EditAccountModal() {
  const {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isPending,
    isDeleteModalOpen,
    isLoadingDelete,
    handleCloseDeleteModal,
    handleOpenDeleteModal,
    handleDeleteAccount
  } = useEditAccountModalController();

  if(isDeleteModalOpen){
    return <ConfirmDeleteModal
      isLoading={isLoadingDelete}
      onConfirm={handleDeleteAccount}
      onClose={handleCloseDeleteModal}
      title={'Tem certeza que deseja excluir essa conta?'}
      description='Ao excluir a conta, também serão excluidos todos os registros de receita e despesas relacionados.'

    />;
  }



  return (
    <Modal
      title="Editar Conta"
      open={isEditAccountModalOpen}
      onClose={closeEditAccountModal}
      rightAction={
        (<button onClick={handleOpenDeleteModal}>
          <TrashIcon className='w-6 h-6 text-red-900'/>
        </button>)}
    >

      <form onSubmit={handleSubmit}>
        <div>
          <span className='text-gray-600 text-xs tracking-[-0.5px]'>Saldo inicial</span>
          <div className='flex gap-2 items-center'>
            <span className='text-gray-600 text-lg tracking-[-0.5px]'>R$</span>
            <Controller
              name='initialBalance'
              defaultValue={0}
              control={control}
              render={({field: {onChange, value}})=> (
                <InputCurrency
                  error={errors.initialBalance?.message}
                  onChange={onChange}
                  value={value}
                />)}
            />
          </div>
        </div>
        <div className='mt-10 flex flex-col gap-4'>
          <Input
            type='text'
            placeholder='Nome da conta'
            error={errors.name?.message}
            {...register('name')}
          />
          <Controller
            name='type'
            control={control}
            defaultValue='CHECKING'
            render={({field:{onChange, value}})=>(
              <Select
                onChange={onChange}
                value={value}
                placeholder={'Tipo'}
                error={errors.type?.message}
                options={[
                  {
                    value: 'CHECKING',
                    label: 'Conta Corrente'
                  },
                  {
                    value: 'INVESTMENT',
                    label: 'Investimentos'
                  },
                  {
                    value: 'CASH',
                    label: 'Dinheiro Físico'
                  },
                ]}>

              </Select>)}>

          </Controller>

          <Controller
            name='color'
            control={control}
            defaultValue=''
            render={({field:{onChange, value}})=>(
              <ColorsDropdownInput
                error={errors.color?.message}
                onChange={onChange}
                value={value}
              />)}>

          </Controller>

        </div>
        <Button
          type='submit'
          className='w-full mt-6'
          isLoading={isPending}
        >Salvar</Button>
      </form>

    </Modal>
  );
}
