export type Role =
  | 'global_admin'
  | 'admin'
  | 'manager'
  | 'controller'
  | 'checker'
  | 'receiver'
  | 'stocktaker'
  | 'picker'
  | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  warehouseScope?: string;
  routeCage?: string;
  status: 'active' | 'inactive';
}

export const ROLES: Role[] = [
  'global_admin',
  'admin',
  'manager',
  'controller',
  'checker',
  'receiver',
  'stocktaker',
  'picker',
  'driver',
];
