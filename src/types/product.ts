export interface ProductImportRow {
  'Product Alias': string;
  'PrincipalCompany': string;
  'Product Name': string;
  'Brand': string;
  'Case Size': string;
  'Pack size': string;
  'Category': string;
  'Pack Count': string;
  'Container': string;
  'Case barcode': string;
  'Unit Barcode': string;
  'Stockholding Weeks'?: string;
}

export interface ValidationIssue {
  row: number;
  field: string;
  message: string;
  type: 'warning' | 'error';
}

export interface NormalizedProduct {
  product_alias: string;
  principal_company: string;
  product_name: string;
  brand: string;
  case_size: string;
  pack_size: string;
  category: string;
  pack_count: number;
  container: string;
  stockholding_weeks: number;
}

export interface Product extends NormalizedProduct {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductBarcode {
  id: string;
  product_id: string;
  barcode: string;
  kind: 'CASE' | 'UNIT';
  created_at?: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
  updated_at?: string;
}

export interface NormalizedBarcode {
  sku: string;
  barcode: string;
  kind: 'CASE' | 'UNIT';
}

export const REQUIRED_COLUMNS = [
  'Product Alias',
  'PrincipalCompany',
  'Product Name',
  'Brand',
  'Case Size',
  'Pack size',
  'Category',
  'Pack Count',
  'Container',
  'Case barcode',
  'Unit Barcode',
];
