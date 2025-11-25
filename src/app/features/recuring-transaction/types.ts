import { TransactionType } from '../transaction/types';
import { BaseEntity } from '../../shared/types';
import { Account } from '../account/types';

export enum RecurrenceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export type RecuringTransaction = {
  id: number;
  amount: number;
  type: TransactionType;
  label: string;
  notes?: string | null;
  merchant?: string | null;
  account: Account;
  categoryId?: number | null;
  frequency: RecurrenceFrequency;
  startDate: Date;
  endDate?: Date | null;
  dayOfMonth?: number | null;
  monthOfYear?: number | null;
  dayOfWeek?: DayOfWeek | null;
  executionTime?: string | null;
  nextExecutionDate: string | null;
  isActive: boolean;
} & BaseEntity;

export type UpsertRecuringTransaction = {
  amount: number;
  type: TransactionType;
  label: string;
  notes?: string | null;
  merchant?: string | null;
  accountId: number;
  categoryId?: number | null;
  frequency: RecurrenceFrequency;
  startDate: Date;
  endDate?: Date | null;
  dayOfMonth?: number | null;
  monthOfYear?: number | null;
  dayOfWeek?: DayOfWeek | null;
  executionTime?: string | null;
  isActive: boolean;
};
