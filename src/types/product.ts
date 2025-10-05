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
