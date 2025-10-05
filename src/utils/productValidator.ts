import { type ProductImportRow, type ValidationIssue, REQUIRED_COLUMNS } from '@/types/product';

export function validateProductImport(rows: ProductImportRow[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenCaseBarcodes = new Set<string>();
  const seenUnitBarcodes = new Set<string>();

  rows.forEach((row, index) => {
    const rowNum = index + 2;

    REQUIRED_COLUMNS.forEach((col) => {
      const value = row[col as keyof ProductImportRow];
      if (!value || value.toString().trim() === '') {
        issues.push({
          row: rowNum,
          field: col,
          message: 'Missing required field',
          type: 'error',
        });
      }
    });

    const packCount = row['Pack Count'];
    if (packCount && !/^\d+$/.test(packCount.toString().trim())) {
      issues.push({
        row: rowNum,
        field: 'Pack Count',
        message: 'Must be a numeric value',
        type: 'error',
      });
    }

    const caseBarcode = row['Case barcode']?.toString().trim();
    if (caseBarcode) {
      if (caseBarcode.includes(' ')) {
        issues.push({
          row: rowNum,
          field: 'Case barcode',
          message: 'Barcode contains spaces',
          type: 'error',
        });
      }
      if (caseBarcode.length < 8) {
        issues.push({
          row: rowNum,
          field: 'Case barcode',
          message: 'Barcode is shorter than 8 characters',
          type: 'warning',
        });
      }
      if (seenCaseBarcodes.has(caseBarcode)) {
        issues.push({
          row: rowNum,
          field: 'Case barcode',
          message: 'Duplicate barcode',
          type: 'warning',
        });
      }
      seenCaseBarcodes.add(caseBarcode);
    }

    const unitBarcode = row['Unit Barcode']?.toString().trim();
    if (unitBarcode) {
      if (unitBarcode.includes(' ')) {
        issues.push({
          row: rowNum,
          field: 'Unit Barcode',
          message: 'Barcode contains spaces',
          type: 'error',
        });
      }
      if (unitBarcode.length < 8) {
        issues.push({
          row: rowNum,
          field: 'Unit Barcode',
          message: 'Barcode is shorter than 8 characters',
          type: 'warning',
        });
      }
      if (seenUnitBarcodes.has(unitBarcode)) {
        issues.push({
          row: rowNum,
          field: 'Unit Barcode',
          message: 'Duplicate barcode',
          type: 'warning',
        });
      }
      seenUnitBarcodes.add(unitBarcode);
    }
  });

  return issues;
}
