import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Warehouse } from '@/types/warehouse';
import DS from '@/design-system';

interface RouteModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (route: { routeCode: string; warehouseId: string; defaultCage: string }) => void;
  warehouses: Warehouse[];
}

export function RouteModal({ open, onClose, onCreate, warehouses }: RouteModalProps) {
  const [routeCode, setRouteCode] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [defaultCage, setDefaultCage] = useState('');

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 0);
    } else {
      setRouteCode('');
      setWarehouseId('');
      setDefaultCage('');
    }
  }, [open]);

  const handleCreate = () => {
    if (!routeCode || !warehouseId || !defaultCage) return;
    onCreate({ routeCode, warehouseId, defaultCage });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
        <DialogHeader>
          <DialogTitle style={{ color: DS.tokens.colors.text.primary }}>
            New Route
          </DialogTitle>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
          <div>
            <Label htmlFor="routeCode" style={{ color: DS.tokens.colors.text.subtle }}>
              Route Code
            </Label>
            <Input
              id="routeCode"
              ref={firstInputRef}
              value={routeCode}
              onChange={(e) => setRouteCode(e.target.value)}
              style={{
                marginTop: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                color: DS.tokens.colors.text.primary,
                borderColor: DS.tokens.colors.border,
              }}
            />
          </div>

          <div>
            <Label htmlFor="warehouse" style={{ color: DS.tokens.colors.text.subtle }}>
              Warehouse
            </Label>
            <Select value={warehouseId} onValueChange={setWarehouseId}>
              <SelectTrigger
                id="warehouse"
                style={{
                  marginTop: DS.tokens.spacing.sm,
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  color: DS.tokens.colors.text.primary,
                  borderColor: DS.tokens.colors.border,
                }}
              >
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
                {warehouses.map((w) => (
                  <SelectItem
                    key={w.id}
                    value={w.id}
                    style={{ color: DS.tokens.colors.text.primary }}
                  >
                    {w.code} - {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cage" style={{ color: DS.tokens.colors.text.subtle }}>
              Default Cage
            </Label>
            <Input
              id="cage"
              value={defaultCage}
              onChange={(e) => setDefaultCage(e.target.value)}
              style={{
                marginTop: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                color: DS.tokens.colors.text.primary,
                borderColor: DS.tokens.colors.border,
              }}
            />
          </div>
        </div>

        <DialogFooter style={{ marginTop: DS.tokens.spacing.md }}>
          <Button
            variant="ghost"
            onClick={onClose}
            style={{ color: DS.tokens.colors.text.subtle }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!routeCode || !warehouseId || !defaultCage}
            style={{
              backgroundColor: DS.tokens.brand.primary,
              color: DS.tokens.brand.bg,
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
