import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Upload, Download, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, CreditCard as Edit, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { type ProductImportRow, type ValidationIssue, type Product, REQUIRED_COLUMNS } from '@/types/product';
import { validateProductImport } from '@/utils/productValidator';
import { normalizeProducts, normalizeBarcodes, downloadCSV } from '@/utils/csvExport';
import { getAllProducts, upsertProductsWithBarcodes } from '@/lib/productService';
import { getStockholdingConfig, type StockholdingConfig } from '@/lib/settingsService';
import { ProductEditModal } from './ProductEditModal';
import DS from '@/design-system';

export function CatalogImportsTab() {
  const [rows, setRows] = useState<ProductImportRow[]>([]);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [filename, setFilename] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [stockholdingConfig, setStockholdingConfig] = useState<StockholdingConfig>({
    defaultWeeks: 8,
    minWeeks: 1,
    maxWeeks: 52,
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
    loadStockholdingConfig();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          (p) =>
            p.product_alias.toLowerCase().includes(query) ||
            p.product_name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadStockholdingConfig = async () => {
    try {
      const config = await getStockholdingConfig();
      setStockholdingConfig(config);
    } catch (error) {
      console.error('Failed to load stockholding config:', error);
    }
  };

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
        const validationIssues = validateProductImport(jsonData, stockholdingConfig);
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
    const normalizedProducts = normalizeProducts(rows, stockholdingConfig);
    const barcodes = normalizeBarcodes(rows);

    downloadCSV('products.csv', normalizedProducts);
    downloadCSV('product_barcodes.csv', barcodes);
  };

  const handleSubmit = async () => {
    const normalizedProducts = normalizeProducts(rows, stockholdingConfig);
    const barcodes = normalizeBarcodes(rows);

    setSubmitting(true);
    try {
      await upsertProductsWithBarcodes(normalizedProducts, barcodes);
      toast.success(`Successfully imported ${normalizedProducts.length} products`);
      setRows([]);
      setIssues([]);
      setFilename('');
      await loadProducts();
    } catch (error) {
      console.error('Failed to import products:', error);
      toast.error('Failed to import products');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleProductUpdated = () => {
    loadProducts();
  };

  const getStockholdingColor = (weeks: number) => {
    if (weeks === stockholdingConfig.defaultWeeks) return DS.tokens.brand.primary;
    if (weeks < stockholdingConfig.minWeeks * 1.5) return '#f59e0b';
    if (weeks > stockholdingConfig.maxWeeks * 0.75) return '#f59e0b';
    return '#10b981';
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: DS.tokens.spacing.sm,
          }}>
            <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
              Product Management
            </CardTitle>
            <Button
              onClick={loadProducts}
              variant="outline"
              size="sm"
              disabled={loading}
              style={{
                color: DS.tokens.colors.text.subtle,
                borderColor: DS.tokens.colors.border,
              }}
            >
              <RefreshCw size={16} />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: DS.tokens.spacing.md,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: DS.tokens.colors.text.dim,
                }}
              />
              <Input
                placeholder="Search products by SKU, name, brand, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  borderColor: DS.tokens.colors.border,
                  color: DS.tokens.colors.text.primary,
                  paddingLeft: '2.5rem',
                }}
              />
            </div>

            <div style={{
              padding: DS.tokens.spacing.sm,
              backgroundColor: DS.tokens.colors.bg.tertiary,
              borderRadius: DS.tokens.radii.md,
              fontSize: '0.875rem',
              color: DS.tokens.colors.text.subtle,
            }}>
              Showing {filteredProducts.length} of {products.length} products
            </div>

            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: DS.tokens.spacing.sm,
            }}>
              {loading ? (
                <div style={{
                  padding: DS.tokens.spacing.xl,
                  textAlign: 'center',
                  color: DS.tokens.colors.text.subtle,
                }}>
                  Loading products...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{
                  padding: DS.tokens.spacing.xl,
                  textAlign: 'center',
                  color: DS.tokens.colors.text.subtle,
                }}>
                  {products.length === 0
                    ? 'No products found. Import your first batch using the form below.'
                    : 'No products match your search.'}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      padding: DS.tokens.spacing.md,
                      backgroundColor: DS.tokens.colors.bg.tertiary,
                      borderRadius: DS.tokens.radii.md,
                      borderLeft: `3px solid ${getStockholdingColor(product.stockholding_weeks)}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: DS.tokens.spacing.md,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: DS.tokens.spacing.sm,
                        marginBottom: DS.tokens.spacing.xs,
                      }}>
                        <span style={{
                          color: DS.tokens.colors.text.primary,
                          fontWeight: '600',
                        }}>
                          {product.product_alias}
                        </span>
                        <span style={{
                          padding: `${DS.tokens.spacing.xs} ${DS.tokens.spacing.sm}`,
                          backgroundColor: DS.tokens.colors.bg.secondary,
                          borderRadius: DS.tokens.radii.sm,
                          fontSize: '0.75rem',
                          color: getStockholdingColor(product.stockholding_weeks),
                          fontWeight: '600',
                        }}>
                          {product.stockholding_weeks}w
                        </span>
                      </div>
                      <div style={{
                        color: DS.tokens.colors.text.subtle,
                        fontSize: '0.875rem',
                      }}>
                        {product.product_name}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: DS.tokens.spacing.md,
                        marginTop: DS.tokens.spacing.xs,
                        fontSize: '0.75rem',
                        color: DS.tokens.colors.text.dim,
                      }}>
                        <span>{product.brand}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditProduct(product)}
                      style={{
                        color: DS.tokens.colors.text.subtle,
                        borderColor: DS.tokens.colors.border,
                      }}
                    >
                      <Edit size={14} />
                      Edit
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
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
                  disabled={errors.length > 0 || submitting}
                  style={{
                    backgroundColor: errors.length > 0 || submitting
                      ? DS.tokens.colors.bg.tertiary
                      : DS.tokens.brand.primary,
                    color: errors.length > 0 || submitting
                      ? DS.tokens.colors.text.dim
                      : DS.tokens.brand.bg,
                  }}
                >
                  {submitting ? 'Importing...' : 'Submit'}
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
              with CASE and UNIT barcode kinds. The optional "Stockholding Weeks\" column defaults to {stockholdingConfig.defaultWeeks} weeks if not specified.
            </p>
          </div>
        </CardContent>
      </Card>

      <ProductEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={selectedProduct}
        onUpdate={handleProductUpdated}
      />
    </div>
  );
}
