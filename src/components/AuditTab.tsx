import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { MOCK_AUDIT_ENTRIES } from '@/types/audit';
import DS from '@/design-system';

export function AuditTab() {
  const [entityFilter, setEntityFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredEntries = MOCK_AUDIT_ENTRIES.filter((entry) => {
    if (entityFilter !== 'all' && entry.entity !== entityFilter) return false;
    if (actorFilter && !entry.actor.toLowerCase().includes(actorFilter.toLowerCase())) return false;
    if (dateFilter && !entry.timestamp.startsWith(dateFilter)) return false;
    return true;
  });

  const entities = Array.from(new Set(MOCK_AUDIT_ENTRIES.map((e) => e.entity)));

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
          Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.lg }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: DS.tokens.spacing.md,
          }}>
            <div>
              <Label htmlFor="entity" style={{ color: DS.tokens.colors.text.subtle }}>
                Entity
              </Label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger
                  id="entity"
                  style={{
                    marginTop: DS.tokens.spacing.sm,
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    color: DS.tokens.colors.text.primary,
                    borderColor: DS.tokens.colors.border,
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
                  <SelectItem value="all" style={{ color: DS.tokens.colors.text.primary }}>
                    All Entities
                  </SelectItem>
                  {entities.map((entity) => (
                    <SelectItem
                      key={entity}
                      value={entity}
                      style={{ color: DS.tokens.colors.text.primary }}
                    >
                      {entity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="actor" style={{ color: DS.tokens.colors.text.subtle }}>
                Actor
              </Label>
              <Input
                id="actor"
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                placeholder="Filter by actor email"
                style={{
                  marginTop: DS.tokens.spacing.sm,
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  color: DS.tokens.colors.text.primary,
                  borderColor: DS.tokens.colors.border,
                }}
              />
            </div>

            <div>
              <Label htmlFor="date" style={{ color: DS.tokens.colors.text.subtle }}>
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  marginTop: DS.tokens.spacing.sm,
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  color: DS.tokens.colors.text.primary,
                  borderColor: DS.tokens.colors.border,
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Timestamp</TableHead>
                  <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Entity</TableHead>
                  <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Action</TableHead>
                  <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Actor</TableHead>
                  <TableHead style={{ color: DS.tokens.colors.text.subtle }}>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell style={{ color: DS.tokens.colors.text.subtle, fontSize: '0.875rem' }}>
                      {formatTimestamp(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: DS.tokens.colors.bg.tertiary,
                          color: DS.tokens.colors.text.subtle,
                        }}
                      >
                        {entry.entity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: DS.tokens.brand.primary,
                          color: DS.tokens.brand.bg,
                        }}
                      >
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ color: DS.tokens.colors.text.subtle, fontSize: '0.875rem' }}>
                      {entry.actor}
                    </TableCell>
                    <TableCell style={{ color: DS.tokens.colors.text.dim, fontSize: '0.875rem' }}>
                      {entry.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div style={{
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
              <strong>Note:</strong> This is a static placeholder. In production, audit entries will stream
              from the backend in real-time and support pagination for historical records.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
