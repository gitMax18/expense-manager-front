import { BaseEntity } from '../../shared/types';
import { Account } from '../account/types';

export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
}

export type Transaction = {
  id: number;
  amount: number;
  type: TransactionType;
  label?: string;
  notes?: string | null;
  merchant?: string | null;
  account: Account;
  categoryId?: number | null;
} & BaseEntity;

export type UpsertTransaction = {
  amount: number;
  type: TransactionType;
  label: string;
  notes?: string | null;
  merchant?: string | null;
  accountId: number;
  categoryId?: number | null;
};
