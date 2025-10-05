import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ArrowRightLeft, Settings, ArrowLeftRight, SquareCheck as CheckSquare, PackageCheck } from 'lucide-react';
import DS from '@/design-system';

type ActionType =
  | 'new-product'
  | 'stock-transfer'
  | 'adjustments'
  | 'ibt'
  | 'order-verifications'
  | 'book-ins';

const actions = [
  { id: 'new-product' as ActionType, label: 'New Product Creation', icon: Plus },
  { id: 'stock-transfer' as ActionType, label: 'Stock Transfer', icon: ArrowRightLeft },
  { id: 'adjustments' as ActionType, label: 'Adjustments', icon: Settings },
  { id: 'ibt' as ActionType, label: 'Inter-Branch Transfers', icon: ArrowLeftRight },
  { id: 'order-verifications' as ActionType, label: 'Order Verifications', icon: CheckSquare },
  { id: 'book-ins' as ActionType, label: 'Book-ins', icon: PackageCheck },
];

export function ControllerCard() {
  const [openModal, setOpenModal] = useState<ActionType | null>(null);

  const renderModalContent = () => {
    switch (openModal) {
      case 'new-product':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Product Name</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>SKU</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Category</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Unit Barcode</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
          </div>
        );
      case 'stock-transfer':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>From Warehouse</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>To Warehouse</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Product</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Quantity</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
          </div>
        );
      case 'adjustments':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Product</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Adjustment Type</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Quantity</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Reason</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
          </div>
        );
      case 'ibt':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Source Branch</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Destination Branch</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Products</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Transfer Date</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
          </div>
        );
      case 'order-verifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Order ID</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Customer</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Verification Status</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Notes</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
          </div>
        );
      case 'book-ins':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Supplier</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>PO Number</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Products Received</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
            <div>
              <Label style={{ color: DS.tokens.colors.text.subtle }}>Receipt Date</Label>
              <Input disabled style={{ marginTop: DS.tokens.spacing.sm }} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const action = actions.find(a => a.id === openModal);
    return action?.label || '';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
            Controller / Procurement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: DS.tokens.spacing.sm,
          }}>
            {actions.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant="outline"
                onClick={() => setOpenModal(id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: DS.tokens.spacing.xs,
                  height: 'auto',
                  padding: DS.tokens.spacing.md,
                  color: DS.tokens.colors.text.subtle,
                  borderColor: DS.tokens.colors.border,
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: '0.875rem', textAlign: 'center' }}>{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openModal !== null} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
          <DialogHeader>
            <DialogTitle style={{ color: DS.tokens.colors.text.primary }}>
              {getModalTitle()}
            </DialogTitle>
          </DialogHeader>
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
