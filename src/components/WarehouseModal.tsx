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
import DS from '@/design-system';

interface WarehouseModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (warehouse: { code: string; name: string; city: string }) => void;
}

export function WarehouseModal({ open, onClose, onCreate }: WarehouseModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 0);
    } else {
      setCode('');
      setName('');
      setCity('');
    }
  }, [open]);

  const handleCreate = () => {
    if (!code || !name || !city) return;
    onCreate({ code, name, city });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
        <DialogHeader>
          <DialogTitle style={{ color: DS.tokens.colors.text.primary }}>
            New Warehouse
          </DialogTitle>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
          <div>
            <Label htmlFor="code" style={{ color: DS.tokens.colors.text.subtle }}>
              Code
            </Label>
            <Input
              id="code"
              ref={firstInputRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                marginTop: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                color: DS.tokens.colors.text.primary,
                borderColor: DS.tokens.colors.border,
              }}
            />
          </div>

          <div>
            <Label htmlFor="name" style={{ color: DS.tokens.colors.text.subtle }}>
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                marginTop: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                color: DS.tokens.colors.text.primary,
                borderColor: DS.tokens.colors.border,
              }}
            />
          </div>

          <div>
            <Label htmlFor="city" style={{ color: DS.tokens.colors.text.subtle }}>
              City
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
            disabled={!code || !name || !city}
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
