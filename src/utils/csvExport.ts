import { type ProductImportRow, type NormalizedProduct, type NormalizedBarcode } from '@/types/product';

export function normalizeProducts(rows: ProductImportRow[]): NormalizedProduct[] {
  return rows.map((row) => ({
    product_alias: row['Product Alias']?.toString().trim() || '',
    principal_company: row['PrincipalCompany']?.toString().trim() || '',
    product_name: row['Product Name']?.toString().trim() || '',
    brand: row['Brand']?.toString().trim() || '',
    case_size: row['Case Size']?.toString().trim() || '',
    pack_size: row['Pack size']?.toString().trim() || '',
    category: row['Category']?.toString().trim() || '',
    pack_count: parseInt(row['Pack Count']?.toString().trim() || '0', 10),
    container: row['Container']?.toString().trim() || '',
  }));
}

export function normalizeBarcodes(rows: ProductImportRow[]): NormalizedBarcode[] {
  const barcodes: NormalizedBarcode[] = [];

  rows.forEach((row) => {
    const productAlias = row['Product Alias']?.toString().trim() || '';
    const caseBarcode = row['Case barcode']?.toString().trim().replace(/\s+/g, '');
    const unitBarcode = row['Unit Barcode']?.toString().trim().replace(/\s+/g, '');

    if (caseBarcode) {
      barcodes.push({
        sku: productAlias,
        barcode: caseBarcode,
        kind: 'CASE',
      });
    }

    if (unitBarcode) {
      barcodes.push({
        sku: productAlias,
        barcode: unitBarcode,
        kind: 'UNIT',
      });
    }
  });

  return barcodes;
}

export function downloadCSV(filename: string, data: any[]) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const stringValue = value?.toString() || '';
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
