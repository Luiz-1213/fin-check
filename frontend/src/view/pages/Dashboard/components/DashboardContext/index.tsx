import { createContext, useCallback, useState } from 'react';
import { BankAccount } from '../../../../../app/entities/BankAccount';

interface DashboardContextValue{
  areValuesVisible: boolean
  isNewAccountModalOpen: boolean
  isEditAccountModalOpen: boolean
  isNewTransactionModalOpen: boolean
  newTransactionType: 'INCOME'| 'EXPENSE' | null
  accountBeingEdited: BankAccount | null
  toggleValuesVisibility(): void
  openNewAccountModal(): void
  openEditAccountModal(bankAccount: BankAccount): void
  closeNewAccountModal():void
  closeEditAccountModal():void
  openNewTransactionModal(type:'INCOME'| 'EXPENSE'): void
  closeNewTransactionModal():void
}

export const DashboardContext = createContext({} as DashboardContextValue);

export function DashboardProvider({children}: {children: React.ReactNode}){
  const [areValuesVisible, setAreValuesVisible] = useState(true);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [newTransactionType,setNewTransactionType] = useState<'INCOME'| 'EXPENSE' | null>(null);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [accountBeingEdited, setAccountBeingEdited] = useState<BankAccount | null>(null);


  const toggleValuesVisibility = useCallback(()=>{
    setAreValuesVisible((prevState)=> !prevState);
  }, []);

  const openNewAccountModal = useCallback(()=>{

    setIsNewAccountModalOpen(true);
  }, []);

  const closeNewAccountModal = useCallback(()=>{
    setIsNewAccountModalOpen(false);
  }, []);

  const openEditAccountModal = useCallback((bankAccount: BankAccount)=>{
    setAccountBeingEdited(bankAccount);
    setIsEditAccountModalOpen(true);
  }, []);

  const closeEditAccountModal = useCallback(()=>{
    setIsEditAccountModalOpen(false);
    setAccountBeingEdited(null);
  }, []);

  const openNewTransactionModal = useCallback((type:'INCOME'| 'EXPENSE')=>{
    setNewTransactionType(type);
    setIsNewTransactionModalOpen(true);
  }, []);

  const closeNewTransactionModal = useCallback(()=>{
    setNewTransactionType(null);
    setIsNewTransactionModalOpen(false);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        areValuesVisible,
        toggleValuesVisibility,
        openNewAccountModal,
        closeNewAccountModal,
        closeNewTransactionModal,
        openNewTransactionModal,
        isNewTransactionModalOpen,
        isNewAccountModalOpen,
        newTransactionType,
        isEditAccountModalOpen,
        accountBeingEdited,
        closeEditAccountModal,
        openEditAccountModal,
      }}>
      {children}

    </DashboardContext.Provider>);
}
