import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Warehouse,
  Package,
  Shield,
  FileText,
  Settings,
  BookOpen
} from 'lucide-react';
import { UsersTab } from './components/UsersTab';
import { WarehousesRoutesTab } from './components/WarehousesRoutesTab';
import { CatalogImportsTab } from './components/CatalogImportsTab';
import { PoliciesTab } from './components/PoliciesTab';
import { AuditTab } from './components/AuditTab';
import { SettingsTab } from './components/SettingsTab';
import { ControllerCard } from './components/ControllerCard';
import { ManagerCard } from './components/ManagerCard';
import { OpsCards } from './components/OpsCards';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { DEFAULT_POLICIES, type PolicySettings } from './types/policies';
import { type User } from './types/user';
import DS from './design-system';
import './App.css';

type TabId = 'dashboard' | 'users' | 'warehouses' | 'catalog' | 'policies' | 'audit' | 'settings' | 'readme';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof LayoutDashboard;
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'warehouses', label: 'Warehouses & Routes', icon: Warehouse },
  { id: 'catalog', label: 'Catalog & Imports', icon: Package },
  { id: 'policies', label: 'Policies', icon: Shield },
  { id: 'audit', label: 'Audit', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'readme', label: 'README', icon: BookOpen },
];

const SEEDED_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@niewbev.com',
    role: 'global_admin',
    status: 'active',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@niewbev.com',
    role: 'manager',
    warehouseScope: 'Warehouse A',
    status: 'active',
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya.p@niewbev.com',
    role: 'picker',
    warehouseScope: 'Warehouse B',
    routeCage: 'Route 5',
    status: 'active',
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [policies, setPolicies] = useState<PolicySettings>(DEFAULT_POLICIES);
  const [users, setUsers] = useState<User[]>(SEEDED_USERS);

  const handleSavePolicies = () => {
    toast.success('Policies saved successfully');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.lg }}>
            <Card>
              <CardHeader>
                <CardTitle style={{ color: DS.tokens.colors.text.primary }}>Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: DS.tokens.colors.text.subtle }}>
                  Overview of key metrics, recent activity, and system health indicators will appear here.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle style={{ color: DS.tokens.colors.text.primary }}>Role Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: DS.tokens.colors.text.subtle, marginBottom: DS.tokens.spacing.lg }}>
                  Quick access to role-specific actions and workflows.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.lg }}>
                  <ControllerCard />
                  <ManagerCard users={users} />
                  <OpsCards />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'users':
        return <UsersTab users={users} onUpdateUsers={setUsers} />;
      case 'warehouses':
        return <WarehousesRoutesTab />;
      case 'catalog':
        return <CatalogImportsTab />;
      case 'policies':
        return (
          <PoliciesTab
            policies={policies}
            onUpdate={setPolicies}
            onSave={handleSavePolicies}
          />
        );
      case 'audit':
        return <AuditTab />;
      case 'settings':
        return <SettingsTab />;
      case 'readme':
        return (
          <Card>
            <CardHeader>
              <CardTitle style={{ color: DS.tokens.colors.text.primary }}>README</CardTitle>
            </CardHeader>
            <CardContent style={{ textAlign: 'left' }}>
              <section style={{ marginBottom: DS.tokens.spacing.xl }}>
                <h2 style={{
                  color: DS.tokens.brand.primary,
                  marginBottom: DS.tokens.spacing.md,
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  Scope
                </h2>
                <p style={{ color: DS.tokens.colors.text.subtle, marginBottom: DS.tokens.spacing.md }}>
                  This Global Admin application provides centralized management for the {DS.tokens.brand.name} platform.
                  It includes user management, warehouse logistics, catalog operations, policy configuration, and audit capabilities.
                </p>
              </section>

              <section style={{ marginBottom: DS.tokens.spacing.xl }}>
                <h2 style={{
                  color: DS.tokens.brand.primary,
                  marginBottom: DS.tokens.spacing.md,
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  Design Tokens
                </h2>
                <div style={{
                  backgroundColor: DS.tokens.colors.bg.secondary,
                  padding: DS.tokens.spacing.md,
                  borderRadius: DS.tokens.radii.md,
                  marginBottom: DS.tokens.spacing.md
                }}>
                  <p style={{ color: DS.tokens.colors.text.subtle, marginBottom: DS.tokens.spacing.sm }}>
                    <strong>Brand Name:</strong> {DS.tokens.brand.name}
                  </p>
                  <p style={{ color: DS.tokens.colors.text.subtle, marginBottom: DS.tokens.spacing.sm }}>
                    <strong>Primary Color:</strong> {DS.tokens.brand.primary}
                  </p>
                  <p style={{ color: DS.tokens.colors.text.subtle, marginBottom: DS.tokens.spacing.sm }}>
                    <strong>Background:</strong> {DS.tokens.brand.bg}
                  </p>
                  <p style={{ color: DS.tokens.colors.text.subtle, marginBottom: DS.tokens.spacing.sm }}>
                    <strong>Text Colors:</strong> Primary ({DS.tokens.colors.text.primary}),
                    Subtle ({DS.tokens.colors.text.subtle}), Dim ({DS.tokens.colors.text.dim})
                  </p>
                  <p style={{ color: DS.tokens.colors.text.subtle }}>
                    <strong>Border Radius:</strong> sm ({DS.tokens.radii.sm}), md ({DS.tokens.radii.md}),
                    lg ({DS.tokens.radii.lg})
                  </p>
                </div>
              </section>

              <section style={{ marginBottom: DS.tokens.spacing.xl }}>
                <h2 style={{
                  color: DS.tokens.brand.primary,
                  marginBottom: DS.tokens.spacing.md,
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  Component Guidelines
                </h2>
                <ul style={{
                  color: DS.tokens.colors.text.subtle,
                  paddingLeft: DS.tokens.spacing.lg,
                  marginBottom: DS.tokens.spacing.md
                }}>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    All components must read from the Design System singleton via <code>DS.tokens</code>
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Use semantic HTML elements for proper accessibility
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Ensure all interactive elements have visible focus states
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Follow mobile-first responsive design principles
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Use shadcn/ui components as building blocks
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Lucide React icons for consistent iconography
                  </li>
                </ul>
              </section>

              <section style={{ marginBottom: DS.tokens.spacing.xl }}>
                <h2 style={{
                  color: DS.tokens.brand.primary,
                  marginBottom: DS.tokens.spacing.md,
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  Content Guidelines
                </h2>
                <p style={{
                  color: DS.tokens.colors.text.subtle,
                  padding: DS.tokens.spacing.md,
                  backgroundColor: DS.tokens.colors.bg.secondary,
                  borderRadius: DS.tokens.radii.md,
                  borderLeft: `4px solid ${DS.tokens.brand.primary}`
                }}>
                  <strong>No AI Wording Rule:</strong> All user-facing text must be clear, direct, and professional.
                  Avoid overly friendly, casual, or robotic language patterns. Write as humans do for humans.
                </p>
              </section>

              <section>
                <h2 style={{
                  color: DS.tokens.brand.primary,
                  marginBottom: DS.tokens.spacing.md,
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  Next Steps
                </h2>
                <ol style={{
                  color: DS.tokens.colors.text.subtle,
                  paddingLeft: DS.tokens.spacing.lg
                }}>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Implement authentication and user session management
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Connect to Supabase backend for data persistence
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Build out each tab with full CRUD functionality
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Add real-time updates for collaborative features
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Implement comprehensive error handling
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Add loading states and optimistic UI updates
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Create data visualization components for dashboard
                  </li>
                  <li style={{ marginBottom: DS.tokens.spacing.sm }}>
                    Implement advanced search and filtering
                  </li>
                </ol>
              </section>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: DS.tokens.brand.bg,
      color: DS.tokens.colors.text.primary
    }}>
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: DS.tokens.colors.bg.secondary,
        borderBottom: `1px solid ${DS.tokens.colors.border}`,
        padding: `${DS.tokens.spacing.md} ${DS.tokens.spacing.lg}`,
        zIndex: 50
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: DS.tokens.brand.primary,
          marginBottom: DS.tokens.spacing.md
        }}>
          {DS.tokens.brand.name}
        </h1>

        <nav
          role="navigation"
          aria-label="Main navigation"
          style={{
            display: 'flex',
            gap: DS.tokens.spacing.sm,
            overflowX: 'auto',
            paddingBottom: DS.tokens.spacing.sm
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                style={{
                  borderRadius: DS.tokens.radii.full,
                  backgroundColor: isActive ? DS.tokens.brand.primary : 'transparent',
                  color: isActive ? DS.tokens.brand.bg : DS.tokens.colors.text.subtle,
                  whiteSpace: 'nowrap',
                  gap: DS.tokens.spacing.xs,
                  padding: `${DS.tokens.spacing.sm} ${DS.tokens.spacing.md}`,
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </nav>
      </header>

      <main style={{
        padding: DS.tokens.spacing.lg,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {renderTabContent()}
      </main>
      <Toaster />
    </div>
  );
}

export default App;
