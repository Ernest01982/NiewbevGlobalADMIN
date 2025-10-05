import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { type ProductImportRow, type ValidationIssue, REQUIRED_COLUMNS } from '@/types/product';
import { validateProductImport } from '@/utils/productValidator';
import { normalizeProducts, normalizeBarcodes, downloadCSV } from '@/utils/csvExport';
import DS from '@/design-system';

export function CatalogImportsTab() {
  const [rows, setRows] = useState<ProductImportRow[]>([]);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [filename, setFilename] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ProductImportRow>(worksheet);

        setRows(jsonData);
        const validationIssues = validateProductImport(jsonData);
        setIssues(validationIssues);
      } catch (error) {
        console.error('Error parsing file:', error);
        setRows([]);
        setIssues([]);
      }
    };

    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadCSVs = () => {
    const products = normalizeProducts(rows);
    const barcodes = normalizeBarcodes(rows);

    downloadCSV('products.csv', products);
    downloadCSV('product_barcodes.csv', barcodes);
  };

  const handleSubmit = () => {
    const products = normalizeProducts(rows);
    const barcodes = normalizeBarcodes(rows);

    console.log('Submit payload:', {
      products,
      barcodes,
      timestamp: new Date().toISOString(),
    });
  };

  const errors = issues.filter((i) => i.type === 'error');
  const warnings = issues.filter((i) => i.type === 'warning');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.lg }}>
      <Card>
        <CardHeader>
          <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
            Catalog & Imports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: DS.tokens.colors.text.subtle }}>
            Manage product catalog, import data feeds, and synchronize inventory systems.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
            Product Master Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <div>
              <p style={{
                color: DS.tokens.colors.text.subtle,
                marginBottom: DS.tokens.spacing.md,
                fontSize: '0.875rem',
              }}>
                Upload .xlsx or .csv files with the following required columns:
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: DS.tokens.spacing.xs,
                marginBottom: DS.tokens.spacing.lg,
              }}>
                {REQUIRED_COLUMNS.map((col) => (
                  <span
                    key={col}
                    style={{
                      padding: `${DS.tokens.spacing.xs} ${DS.tokens.spacing.sm}`,
                      backgroundColor: DS.tokens.colors.bg.tertiary,
                      borderRadius: DS.tokens.radii.sm,
                      color: DS.tokens.colors.text.subtle,
                      fontSize: '0.75rem',
                    }}
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundColor: DS.tokens.brand.primary,
                color: DS.tokens.brand.bg,
                width: 'fit-content',
              }}
            >
              <Upload size={16} />
              Upload File
            </Button>

            {filename && (
              <div style={{
                padding: DS.tokens.spacing.md,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
                borderLeft: `3px solid ${DS.tokens.brand.primary}`,
              }}>
                <p style={{
                  color: DS.tokens.colors.text.primary,
                  fontSize: '0.875rem',
                  margin: 0,
                  marginBottom: DS.tokens.spacing.xs,
                }}>
                  <strong>File:</strong> {filename}
                </p>
                <p style={{
                  color: DS.tokens.colors.text.subtle,
                  fontSize: '0.875rem',
                  margin: 0,
                }}>
                  <strong>Rows:</strong> {rows.length}
                </p>
              </div>
            )}

            {errors.length > 0 && (
              <Alert style={{
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderColor: '#ef4444',
              }}>
                <AlertCircle size={16} style={{ color: '#ef4444' }} />
                <AlertDescription style={{ color: DS.tokens.colors.text.primary }}>
                  <strong style={{ color: '#ef4444' }}>{errors.length} Errors Found</strong>
                  <ul style={{
                    marginTop: DS.tokens.spacing.sm,
                    paddingLeft: DS.tokens.spacing.lg,
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}>
                    {errors.slice(0, 10).map((issue, idx) => (
                      <li key={idx} style={{ fontSize: '0.875rem', marginBottom: DS.tokens.spacing.xs }}>
                        Row {issue.row}, {issue.field}: {issue.message}
                      </li>
                    ))}
                    {errors.length > 10 && (
                      <li style={{ fontSize: '0.875rem', color: DS.tokens.colors.text.dim }}>
                        ...and {errors.length - 10} more
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {warnings.length > 0 && (
              <Alert style={{
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderColor: '#f59e0b',
              }}>
                <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
                <AlertDescription style={{ color: DS.tokens.colors.text.primary }}>
                  <strong style={{ color: '#f59e0b' }}>{warnings.length} Warnings Found</strong>
                  <ul style={{
                    marginTop: DS.tokens.spacing.sm,
                    paddingLeft: DS.tokens.spacing.lg,
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}>
                    {warnings.slice(0, 10).map((issue, idx) => (
                      <li key={idx} style={{ fontSize: '0.875rem', marginBottom: DS.tokens.spacing.xs }}>
                        Row {issue.row}, {issue.field}: {issue.message}
                      </li>
                    ))}
                    {warnings.length > 10 && (
                      <li style={{ fontSize: '0.875rem', color: DS.tokens.colors.text.dim }}>
                        ...and {warnings.length - 10} more
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {rows.length > 0 && (
              <div style={{
                display: 'flex',
                gap: DS.tokens.spacing.sm,
                flexWrap: 'wrap',
                marginTop: DS.tokens.spacing.md,
              }}>
                <Button
                  onClick={handleDownloadCSVs}
                  variant="outline"
                  style={{
                    color: DS.tokens.colors.text.subtle,
                    borderColor: DS.tokens.colors.border,
                  }}
                >
                  <Download size={16} />
                  Download CSVs
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={errors.length > 0}
                  style={{
                    backgroundColor: errors.length > 0
                      ? DS.tokens.colors.bg.tertiary
                      : DS.tokens.brand.primary,
                    color: errors.length > 0
                      ? DS.tokens.colors.text.dim
                      : DS.tokens.brand.bg,
                  }}
                >
                  Submit
                </Button>
              </div>
            )}
          </div>

          <div style={{
            marginTop: DS.tokens.spacing.xl,
            padding: DS.tokens.spacing.md,
            backgroundColor: DS.tokens.colors.bg.tertiary,
            borderRadius: DS.tokens.radii.md,
            borderLeft: `3px solid ${DS.tokens.colors.text.dim}`,
          }}>
            <p style={{
              color: DS.tokens.colors.text.subtle,
              fontSize: '0.875rem',
              margin: 0,
            }}>
              <strong>Note:</strong> This import mirrors the bulk-upload template used by backend ingest.
              Downloads generate normalized <code>products.csv</code> and <code>product_barcodes.csv</code> files
              with CASE and UNIT barcode kinds.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
