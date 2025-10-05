import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Upload } from 'lucide-react';
import { CreateUserModal } from './CreateUserModal';
import { type User, ROLES } from '@/types/user';
import DS from '@/design-system';

interface UsersTabProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

export function UsersTab({ users, onUpdateUsers }: UsersTabProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateUser = (newUser: {
    name: string;
    email: string;
    role: typeof ROLES[number];
    warehouseScope?: string;
    routeCage?: string;
  }) => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      status: 'active',
    };
    onUpdateUsers([...users, user]);
  };

  const handleBulkInvite = () => {
    console.log('Bulk invite CSV handler stub');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: DS.tokens.spacing.md,
          }}>
            <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
              Users & Roles
            </CardTitle>
            <div style={{
              display: 'flex',
              gap: DS.tokens.spacing.sm,
              flexWrap: 'wrap',
            }}>
              <Button
                onClick={() => setModalOpen(true)}
                style={{
                  backgroundColor: DS.tokens.brand.primary,
                  color: DS.tokens.brand.bg,
                }}
              >
                <UserPlus size={16} />
                Create User
              </Button>
              <Button
                variant="outline"
                onClick={handleBulkInvite}
                style={{
                  color: DS.tokens.colors.text.subtle,
                  borderColor: DS.tokens.colors.border,
                }}
              >
                <Upload size={16} />
                Bulk Invite (CSV)
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Name</TableHead>
                  <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Role</TableHead>
                  <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Scope</TableHead>
                  <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: DS.tokens.colors.text.primary, fontWeight: '500' }}>
                          {user.name}
                        </span>
                        <span style={{ color: DS.tokens.colors.text.dim, fontSize: '0.875rem' }}>
                          {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: DS.tokens.colors.bg.tertiary,
                          color: DS.tokens.colors.text.subtle,
                        }}
                      >
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {user.warehouseScope && (
                          <span style={{ color: DS.tokens.colors.text.subtle, fontSize: '0.875rem' }}>
                            {user.warehouseScope}
                          </span>
                        )}
                        {user.routeCage && (
                          <span style={{ color: DS.tokens.colors.text.dim, fontSize: '0.875rem' }}>
                            {user.routeCage}
                          </span>
                        )}
                        {!user.warehouseScope && !user.routeCage && (
                          <span style={{ color: DS.tokens.colors.text.dim, fontSize: '0.875rem' }}>
                            Global
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: user.status === 'active'
                            ? DS.tokens.brand.primary
                            : DS.tokens.colors.bg.tertiary,
                          color: user.status === 'active'
                            ? DS.tokens.brand.bg
                            : DS.tokens.colors.text.dim,
                        }}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div style={{
            marginTop: DS.tokens.spacing.xl,
            padding: DS.tokens.spacing.md,
            backgroundColor: DS.tokens.colors.bg.tertiary,
            borderRadius: DS.tokens.radii.md,
            borderLeft: `3px solid ${DS.tokens.colors.text.dim}`,
          }}>
            <h3 style={{
              color: DS.tokens.colors.text.subtle,
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: DS.tokens.spacing.sm,
            }}>
              Dev Tests
            </h3>
            <ul style={{
              color: DS.tokens.colors.text.dim,
              fontSize: '0.875rem',
              paddingLeft: DS.tokens.spacing.lg,
              margin: 0,
            }}>
              <li>Role list length: {ROLES.length} (expected: 9)</li>
              <li>Modal can open and close: {modalOpen ? 'Open' : 'Closed'}</li>
              <li>User count: {users.length}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <CreateUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </>
  );
}
