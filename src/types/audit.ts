export interface AuditEntry {
  id: string;
  timestamp: string;
  entity: string;
  action: string;
  actor: string;
  details: string;
}

export const MOCK_AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: '1',
    timestamp: '2025-10-05T14:23:00Z',
    entity: 'User',
    action: 'Created',
    actor: 'sarah.chen@niewbev.com',
    details: 'Created user: marcus.j@niewbev.com',
  },
  {
    id: '2',
    timestamp: '2025-10-05T13:15:00Z',
    entity: 'Warehouse',
    action: 'Updated',
    actor: 'admin@niewbev.com',
    details: 'Updated warehouse WH-A configuration',
  },
  {
    id: '3',
    timestamp: '2025-10-05T12:05:00Z',
    entity: 'Policy',
    action: 'Updated',
    actor: 'sarah.chen@niewbev.com',
    details: 'Modified stock holding policy to 4 weeks',
  },
  {
    id: '4',
    timestamp: '2025-10-05T11:30:00Z',
    entity: 'Product',
    action: 'Imported',
    actor: 'system@niewbev.com',
    details: 'Imported 150 products from CSV',
  },
  {
    id: '5',
    timestamp: '2025-10-05T10:45:00Z',
    entity: 'Route',
    action: 'Created',
    actor: 'marcus.j@niewbev.com',
    details: 'Created route R-03 for warehouse WH-A',
  },
];
