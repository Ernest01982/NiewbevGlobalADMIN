import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Route as RouteIcon } from 'lucide-react';
import { WarehouseModal } from './WarehouseModal';
import { RouteModal } from './RouteModal';
import { type Warehouse, type Route } from '@/types/warehouse';
import DS from '@/design-system';

const SEEDED_WAREHOUSES: Warehouse[] = [
  { id: '1', code: 'WH-A', name: 'Central Distribution', city: 'Sydney' },
  { id: '2', code: 'WH-B', name: 'North Hub', city: 'Brisbane' },
];

const SEEDED_ROUTES: Route[] = [
  { id: '1', routeCode: 'R-01', warehouseId: '1', defaultCage: 'C-101' },
  { id: '2', routeCode: 'R-02', warehouseId: '1', defaultCage: 'C-102' },
  { id: '3', routeCode: 'R-05', warehouseId: '2', defaultCage: 'C-201' },
];

export function WarehousesRoutesTab() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(SEEDED_WAREHOUSES);
  const [routes, setRoutes] = useState<Route[]>(SEEDED_ROUTES);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [routeModalOpen, setRouteModalOpen] = useState(false);

  const handleCreateWarehouse = (data: { code: string; name: string; city: string }) => {
    const warehouse: Warehouse = {
      id: Date.now().toString(),
      ...data,
    };
    setWarehouses([...warehouses, warehouse]);
  };

  const handleCreateRoute = (data: {
    routeCode: string;
    warehouseId: string;
    defaultCage: string;
  }) => {
    const route: Route = {
      id: Date.now().toString(),
      ...data,
    };
    setRoutes([...routes, route]);
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? `${warehouse.code} - ${warehouse.name}` : 'Unknown';
  };

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: DS.tokens.spacing.lg,
      }}>
        <Card>
          <CardHeader>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: DS.tokens.spacing.sm,
            }}>
              <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
                Warehouses
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setWarehouseModalOpen(true)}
                style={{
                  backgroundColor: DS.tokens.brand.primary,
                  color: DS.tokens.brand.bg,
                }}
              >
                <Building2 size={16} />
                New Warehouse
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.sm }}>
              {warehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  style={{
                    padding: DS.tokens.spacing.md,
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    borderRadius: DS.tokens.radii.md,
                    borderLeft: `3px solid ${DS.tokens.brand.primary}`,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: DS.tokens.spacing.xs,
                  }}>
                    <span style={{
                      color: DS.tokens.colors.text.primary,
                      fontWeight: '600',
                    }}>
                      {warehouse.code}
                    </span>
                    <span style={{
                      color: DS.tokens.colors.text.dim,
                      fontSize: '0.875rem',
                    }}>
                      {warehouse.city}
                    </span>
                  </div>
                  <p style={{
                    color: DS.tokens.colors.text.subtle,
                    fontSize: '0.875rem',
                    margin: 0,
                  }}>
                    {warehouse.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: DS.tokens.spacing.sm,
            }}>
              <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
                Routes
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setRouteModalOpen(true)}
                style={{
                  backgroundColor: DS.tokens.brand.primary,
                  color: DS.tokens.brand.bg,
                }}
              >
                <RouteIcon size={16} />
                New Route
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.sm }}>
              {routes.map((route) => (
                <div
                  key={route.id}
                  style={{
                    padding: DS.tokens.spacing.md,
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    borderRadius: DS.tokens.radii.md,
                    borderLeft: `3px solid ${DS.tokens.brand.primary}`,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: DS.tokens.spacing.xs,
                  }}>
                    <span style={{
                      color: DS.tokens.colors.text.primary,
                      fontWeight: '600',
                    }}>
                      {route.routeCode}
                    </span>
                    <span style={{
                      color: DS.tokens.colors.text.dim,
                      fontSize: '0.875rem',
                    }}>
                      Cage: {route.defaultCage}
                    </span>
                  </div>
                  <p style={{
                    color: DS.tokens.colors.text.subtle,
                    fontSize: '0.875rem',
                    margin: 0,
                  }}>
                    {getWarehouseName(route.warehouseId)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <WarehouseModal
        open={warehouseModalOpen}
        onClose={() => setWarehouseModalOpen(false)}
        onCreate={handleCreateWarehouse}
      />

      <RouteModal
        open={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        onCreate={handleCreateRoute}
        warehouses={warehouses}
      />
    </>
  );
}
