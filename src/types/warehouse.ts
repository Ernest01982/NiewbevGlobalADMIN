export interface Warehouse {
  id: string;
  code: string;
  name: string;
  city: string;
}

export interface Route {
  id: string;
  routeCode: string;
  warehouseId: string;
  defaultCage: string;
}
