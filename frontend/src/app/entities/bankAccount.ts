export interface BankAccount{
  id: string
  name: string
  initialBalance: number
  type: 'CASH' | 'CHECKING' | 'INVESTMENT'
  color: string
  currentBalance: number
}