import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateProduct } from '@/lib/productService';
import { getStockholdingConfig, type StockholdingConfig } from '@/lib/settingsService';
import type { Product } from '@/types/product';
import DS from '@/design-system';

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: () => void;
}

export function ProductEditModal({ open, onClose, product, onUpdate }: ProductEditModalProps) {
  const [formData, setFormData] = useState({
    product_name: '',
    brand: '',
    category: '',
    case_size: '',
    pack_size: '',
    pack_count: 0,
    container: '',
    stockholding_weeks: 8,
  });
  const [stockholdingConfig, setStockholdingConfig] = useState<StockholdingConfig>({
    defaultWeeks: 8,
    minWeeks: 1,
    maxWeeks: 52,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name,
        brand: product.brand,
        category: product.category,
        case_size: product.case_size,
        pack_size: product.pack_size,
        pack_count: product.pack_count,
        container: product.container,
        stockholding_weeks: product.stockholding_weeks,
      });
    }
  }, [product]);

  useEffect(() => {
    loadStockholdingConfig();
  }, []);

  const loadStockholdingConfig = async () => {
    try {
      const config = await getStockholdingConfig();
      setStockholdingConfig(config);
    } catch (error) {
      console.error('Failed to load stockholding config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (formData.stockholding_weeks < stockholdingConfig.minWeeks) {
      toast.error(`Stockholding weeks must be at least ${stockholdingConfig.minWeeks}`);
      return;
    }

    if (formData.stockholding_weeks > stockholdingConfig.maxWeeks) {
      toast.error(`Stockholding weeks cannot exceed ${stockholdingConfig.maxWeeks}`);
      return;
    }

    setSaving(true);
    try {
      await updateProduct(product.id, formData);
      toast.success('Product updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (!product) return null;

  const isUsingDefault = formData.stockholding_weeks === stockholdingConfig.defaultWeeks;
  const isLow = formData.stockholding_weeks < stockholdingConfig.minWeeks * 1.5;
  const isHigh = formData.stockholding_weeks > stockholdingConfig.maxWeeks * 0.75;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{
        backgroundColor: DS.tokens.colors.bg.secondary,
        borderColor: DS.tokens.colors.border,
        maxWidth: '600px',
      }}>
        <DialogHeader>
          <DialogTitle style={{ color: DS.tokens.colors.text.primary }}>
            Edit Product: {product.product_alias}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: DS.tokens.spacing.md,
            maxHeight: '60vh',
            overflowY: 'auto',
            padding: DS.tokens.spacing.xs,
          }}>
            <div>
              <Label htmlFor="product_name" style={{ color: DS.tokens.colors.text.primary }}>
                Product Name
              </Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                required
                style={{
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  borderColor: DS.tokens.colors.border,
                  color: DS.tokens.colors.text.primary,
                }}
              />
            </div>

            <div>
              <Label htmlFor="brand" style={{ color: DS.tokens.colors.text.primary }}>
                Brand
              </Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                style={{
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  borderColor: DS.tokens.colors.border,
                  color: DS.tokens.colors.text.primary,
                }}
              />
            </div>

            <div>
              <Label htmlFor="category" style={{ color: DS.tokens.colors.text.primary }}>
                Category
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                style={{
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  borderColor: DS.tokens.colors.border,
                  color: DS.tokens.colors.text.primary,
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DS.tokens.spacing.md }}>
              <div>
                <Label htmlFor="case_size" style={{ color: DS.tokens.colors.text.primary }}>
                  Case Size
                </Label>
                <Input
                  id="case_size"
                  value={formData.case_size}
                  onChange={(e) => setFormData({ ...formData, case_size: e.target.value })}
                  required
                  style={{
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    borderColor: DS.tokens.colors.border,
                    color: DS.tokens.colors.text.primary,
                  }}
                />
              </div>

              <div>
                <Label htmlFor="pack_size" style={{ color: DS.tokens.colors.text.primary }}>
                  Pack Size
                </Label>
                <Input
                  id="pack_size"
                  value={formData.pack_size}
                  onChange={(e) => setFormData({ ...formData, pack_size: e.target.value })}
                  required
                  style={{
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    borderColor: DS.tokens.colors.border,
                    color: DS.tokens.colors.text.primary,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DS.tokens.spacing.md }}>
              <div>
                <Label htmlFor="pack_count" style={{ color: DS.tokens.colors.text.primary }}>
                  Pack Count
                </Label>
                <Input
                  id="pack_count"
                  type="number"
                  min="0"
                  value={formData.pack_count}
                  onChange={(e) => setFormData({ ...formData, pack_count: parseInt(e.target.value) || 0 })}
                  required
                  style={{
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    borderColor: DS.tokens.colors.border,
                    color: DS.tokens.colors.text.primary,
                  }}
                />
              </div>

              <div>
                <Label htmlFor="container" style={{ color: DS.tokens.colors.text.primary }}>
                  Container
                </Label>
                <Input
                  id="container"
                  value={formData.container}
                  onChange={(e) => setFormData({ ...formData, container: e.target.value })}
                  required
                  style={{
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    borderColor: DS.tokens.colors.border,
                    color: DS.tokens.colors.text.primary,
                  }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="stockholding_weeks" style={{ color: DS.tokens.colors.text.primary }}>
                Stockholding Weeks
              </Label>
              <Input
                id="stockholding_weeks"
                type="number"
                min={stockholdingConfig.minWeeks}
                max={stockholdingConfig.maxWeeks}
                step="0.5"
                value={formData.stockholding_weeks}
                onChange={(e) => setFormData({ ...formData, stockholding_weeks: parseFloat(e.target.value) || 8 })}
                required
                style={{
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  borderColor: DS.tokens.colors.border,
                  color: DS.tokens.colors.text.primary,
                }}
              />
              <div style={{
                marginTop: DS.tokens.spacing.xs,
                fontSize: '0.75rem',
                color: DS.tokens.colors.text.dim,
              }}>
                <div>Range: {stockholdingConfig.minWeeks} - {stockholdingConfig.maxWeeks} weeks</div>
                <div>Default: {stockholdingConfig.defaultWeeks} weeks</div>
                {isUsingDefault && (
                  <div style={{ color: DS.tokens.brand.primary, marginTop: DS.tokens.spacing.xs }}>
                    Using system default value
                  </div>
                )}
                {isLow && !isUsingDefault && (
                  <div style={{ color: '#f59e0b', marginTop: DS.tokens.spacing.xs }}>
                    Warning: Low value may cause stockouts
                  </div>
                )}
                {isHigh && !isUsingDefault && (
                  <div style={{ color: '#f59e0b', marginTop: DS.tokens.spacing.xs }}>
                    Warning: High value may increase holding costs
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter style={{ marginTop: DS.tokens.spacing.lg }}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              style={{
                color: DS.tokens.colors.text.subtle,
                borderColor: DS.tokens.colors.border,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: DS.tokens.brand.primary,
                color: DS.tokens.brand.bg,
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
