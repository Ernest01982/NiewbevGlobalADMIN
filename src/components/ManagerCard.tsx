import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';
import { type User } from '@/types/user';
import DS from '@/design-system';

interface Route {
  id: string;
  routeCode: string;
  warehouse: string;
  status: string;
}

const mockRoutes: Route[] = [
  { id: '1', routeCode: 'R-01', warehouse: 'WH-A', status: 'Active' },
  { id: '2', routeCode: 'R-02', warehouse: 'WH-A', status: 'Active' },
  { id: '3', routeCode: 'R-05', warehouse: 'WH-B', status: 'Active' },
];

interface ManagerCardProps {
  users: User[];
}

export function ManagerCard({ users }: ManagerCardProps) {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedUser, setSelectedUser] = useState('');

  const handleAssign = (route: Route) => {
    setSelectedRoute(route);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    console.log('Assigning user', selectedUser, 'to route', selectedRoute?.routeCode);
    setAssignModalOpen(false);
    setSelectedUser('');
  };

  const roleBasedUsers = users.filter(u =>
    ['receiver', 'picker', 'stocktaker', 'driver', 'checker'].includes(u.role)
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
            Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <p style={{
              color: DS.tokens.colors.text.subtle,
              fontSize: '0.875rem',
              marginBottom: DS.tokens.spacing.sm,
            }}>
              Allocate Receiver / Pickers / Stock Takers / Driver / Checkers / Return Checker
            </p>

            <div style={{ overflowX: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Route</TableHead>
                    <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Warehouse</TableHead>
                    <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Status</TableHead>
                    <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell style={{ color: DS.tokens.colors.text.primary, fontWeight: '500' }}>
                        {route.routeCode}
                      </TableCell>
                      <TableCell style={{ color: DS.tokens.colors.text.subtle }}>
                        {route.warehouse}
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: DS.tokens.brand.primary,
                            color: DS.tokens.brand.bg,
                          }}
                        >
                          {route.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleAssign(route)}
                          style={{
                            backgroundColor: DS.tokens.brand.primary,
                            color: DS.tokens.brand.bg,
                          }}
                        >
                          <UserPlus size={14} />
                          Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={assignModalOpen} onOpenChange={(open) => !open && setAssignModalOpen(false)}>
        <DialogContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
          <DialogHeader>
            <DialogTitle style={{ color: DS.tokens.colors.text.primary }}>
              Assign User to Route {selectedRoute?.routeCode}
            </DialogTitle>
          </DialogHeader>

          <div>
            <Label htmlFor="user" style={{ color: DS.tokens.colors.text.subtle }}>
              Select User
            </Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger
                id="user"
                style={{
                  marginTop: DS.tokens.spacing.sm,
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  color: DS.tokens.colors.text.primary,
                  borderColor: DS.tokens.colors.border,
                }}
              >
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
                {roleBasedUsers.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.id}
                    style={{ color: DS.tokens.colors.text.primary }}
                  >
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter style={{ marginTop: DS.tokens.spacing.md }}>
            <Button
              variant="ghost"
              onClick={() => setAssignModalOpen(false)}
              style={{ color: DS.tokens.colors.text.subtle }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAssign}
              disabled={!selectedUser}
              style={{
                backgroundColor: DS.tokens.brand.primary,
                color: DS.tokens.brand.bg,
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
