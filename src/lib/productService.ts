import { supabase } from './supabase';
import type { Product, NormalizedProduct, ProductBarcode, NormalizedBarcode } from '@/types/product';

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('product_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getProductByAlias(productAlias: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('product_alias', productAlias)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createProduct(product: NormalizedProduct): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Partial<NormalizedProduct>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function upsertProducts(products: NormalizedProduct[]): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .upsert(
      products.map(p => ({
        ...p,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'product_alias' }
    )
    .select();

  if (error) throw error;
  return data || [];
}

export async function getBarcodesByProductId(productId: string): Promise<ProductBarcode[]> {
  const { data, error } = await supabase
    .from('product_barcodes')
    .select('*')
    .eq('product_id', productId);

  if (error) throw error;
  return data || [];
}

export async function createBarcode(barcode: Omit<ProductBarcode, 'id' | 'created_at'>): Promise<ProductBarcode> {
  const { data, error } = await supabase
    .from('product_barcodes')
    .insert(barcode)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBarcodesByProductId(productId: string): Promise<void> {
  const { error } = await supabase
    .from('product_barcodes')
    .delete()
    .eq('product_id', productId);

  if (error) throw error;
}

export async function upsertProductsWithBarcodes(
  products: NormalizedProduct[],
  barcodes: NormalizedBarcode[]
): Promise<{ products: Product[]; barcodes: ProductBarcode[] }> {
  const upsertedProducts = await upsertProducts(products);

  const productMap = new Map<string, string>();
  upsertedProducts.forEach(p => {
    productMap.set(p.product_alias, p.id);
  });

  const barcodesWithProductIds = barcodes
    .map(b => {
      const productId = productMap.get(b.sku);
      if (!productId) return null;
      return {
        product_id: productId,
        barcode: b.barcode,
        kind: b.kind,
      };
    })
    .filter((b): b is Omit<ProductBarcode, 'id' | 'created_at'> => b !== null);

  for (const product of upsertedProducts) {
    await deleteBarcodesByProductId(product.id);
  }

  if (barcodesWithProductIds.length > 0) {
    const { data: barcodesData, error: barcodesError } = await supabase
      .from('product_barcodes')
      .insert(barcodesWithProductIds)
      .select();

    if (barcodesError) throw barcodesError;

    return { products: upsertedProducts, barcodes: barcodesData || [] };
  }

  return { products: upsertedProducts, barcodes: [] };
}
