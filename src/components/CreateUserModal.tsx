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
import { ROLES, type Role } from '@/types/user';
import DS from '@/design-system';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (user: {
    name: string;
    email: string;
    role: Role;
    warehouseScope?: string;
    routeCage?: string;
  }) => void;
}

export function CreateUserModal({ open, onClose, onCreate }: CreateUserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [warehouseScope, setWarehouseScope] = useState('');
  const [routeCage, setRouteCage] = useState('');

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 0);
    } else {
      setName('');
      setEmail('');
      setRole('');
      setWarehouseScope('');
      setRouteCage('');
    }
  }, [open]);

  const handleCreate = () => {
    if (!name || !email || !role) return;

    onCreate({
      name,
      email,
      role,
      warehouseScope: warehouseScope || undefined,
      routeCage: routeCage || undefined,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
        <DialogHeader>
          <DialogTitle style={{ color: DS.tokens.colors.text.primary }}>
            Create User
          </DialogTitle>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
          <div>
            <Label htmlFor="name" style={{ color: DS.tokens.colors.text.subtle }}>
              Full Name
            </Label>
            <Input
              id="name"
              ref={firstInputRef}
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
            <Label htmlFor="email" style={{ color: DS.tokens.colors.text.subtle }}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                marginTop: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                color: DS.tokens.colors.text.primary,
                borderColor: DS.tokens.colors.border,
              }}
            />
          </div>

          <div>
            <Label htmlFor="role" style={{ color: DS.tokens.colors.text.subtle }}>
              Role
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value as Role)}>
              <SelectTrigger
                id="role"
                style={{
                  marginTop: DS.tokens.spacing.sm,
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  color: DS.tokens.colors.text.primary,
                  borderColor: DS.tokens.colors.border,
                }}
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
                {ROLES.map((r) => (
                  <SelectItem
                    key={r}
                    value={r}
                    style={{ color: DS.tokens.colors.text.primary }}
                  >
                    {r.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="warehouse" style={{ color: DS.tokens.colors.text.subtle }}>
              Warehouse Scope
            </Label>
            <Input
              id="warehouse"
              value={warehouseScope}
              onChange={(e) => setWarehouseScope(e.target.value)}
              placeholder="Optional"
              style={{
                marginTop: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                color: DS.tokens.colors.text.primary,
                borderColor: DS.tokens.colors.border,
              }}
            />
          </div>

          <div>
            <Label htmlFor="route" style={{ color: DS.tokens.colors.text.subtle }}>
              Route/Cage
            </Label>
            <Input
              id="route"
              value={routeCage}
              onChange={(e) => setRouteCage(e.target.value)}
              placeholder="Optional"
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
            disabled={!name || !email || !role}
            style={{
              backgroundColor: DS.tokens.brand.primary,
              color: DS.tokens.brand.bg,
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
