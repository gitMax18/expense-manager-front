import { BaseEntity } from '../../shared/types';

export type Category = {
  id: number;
  name: string;
  description: string;
} & BaseEntity;

export type UpsertCategory = {
  name: string;
  description: string;
};
