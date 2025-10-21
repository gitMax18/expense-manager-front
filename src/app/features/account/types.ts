export type Account = {
  id: string;
  name: string;
  description?: string;
  balance: number;
  currency: string;
  type: AccountType;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpsertAccountRequest = Omit<Account, 'id' | 'archived' | 'createdAt' | 'updatedAt'>;

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
}
