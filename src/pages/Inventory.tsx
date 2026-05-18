import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  ArrowRight, 
  Save, 
  RefreshCw,
  History,
  TrendingDown,
  TrendingUp,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const inventoryItems = [
  {
    id: '1',
    name: 'Kablosuz Kulaklık X Pro',
    sku: 'EAR-XPRO-001',
    totalStock: 45,
    warehouses: { main: 40, secondary: 5 },
    minStock: 20,
    marketplaces: [
      { name: 'Trendyol', stock: 45 },
      { name: 'WooCommerce', stock: 45 },
    ]
  },
  {
    id: '2',
    name: 'Akıllı Saat Series 7',
    sku: 'WATCH-S7-BLK',
    totalStock: 12,
    warehouses: { main: 12, secondary: 0 },
    minStock: 10,
    marketplaces: [
      { name: 'Trendyol', stock: 12 },
      { name: 'WooCommerce', stock: 12 },
    ]
  },
  {
    id: '3',
    name: 'USB-C Hub 7-in-1',
    sku: 'HUB-71-SLV',
    totalStock: 3,
    warehouses: { main: 3, secondary: 0 },
    minStock: 15,
    marketplaces: [
      { name: 'Trendyol', stock: 3 },
      { name: 'Hepsiburada', stock: 3 },
    ]
  },
];

export const Inventory = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/v1/products');
      const data = await res.json();
      if (data.success) {
        setItems(data.products);
      }
    } catch (err) {
      console.error("Inventory fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  const totalStockCount = items.reduce((sum, item) => sum + (item.stock || 0), 0);
  const lowStockCount = items.filter(item => (item.stock || 0) <= (item.minStock || 10)).length;

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold">Envanter Yönetimi</h1>
        <p className="text-sm text-muted-foreground">Stok seviyelerini izleyin ve tüm kanallarda senkronize tutun.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium flex items-center justify-between">
                 Toplam Stok Adedi
                 <Package className="w-4 h-4 text-primary" />
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{totalStockCount.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground mt-1">Sistemdeki toplam fiziksel adet</p>
            </CardContent>
         </Card>
         <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium flex items-center justify-between text-amber-700 dark:text-amber-400">
                 Kritik Stok Uyarıları
                 <AlertTriangle className="w-4 h-4" />
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{lowStockCount}</div>
               <p className="text-xs text-amber-600/80 dark:text-amber-400/60 mt-1">Eşik değerin altındaki ürünler</p>
            </CardContent>
         </Card>
         <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                 Aktif Senkronizasyon
                 <RefreshCw className="w-4 h-4" />
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Aktif</div>
               <p className="text-xs text-emerald-600/80 dark:text-emerald-400/60 mt-1">Tüm kanallar anlık güncelleniyor</p>
            </CardContent>
         </Card>
      </div>

      <Card>
        <CardHeader className="border-b px-6 py-4">
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input placeholder="Stok kodu veya ürün ara..." className="pl-10 h-9" />
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm"><History className="w-4 h-4 mr-2" /> Stok Geçmişi</Button>
                 <Button variant="outline" size="sm" onClick={fetchItems} className="text-primary border-primary/20 bg-primary/5 hover:bg-primary/10">
                   <RefreshCw className="w-4 h-4 mr-2" /> Yenile
                 </Button>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
           <Table>
              <TableHeader>
                 <TableRow>
                    <TableHead>Ürün Bilgisi</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Mevcut Stok</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">Hızlı Güncelle</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                 {items.length === 0 && !loading ? (
                    <TableRow>
                       <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">Veri bulunamadı.</TableCell>
                    </TableRow>
                 ) : items.map((item) => (
                    <TableRow key={item.id}>
                       <TableCell className="font-medium">{item.name}</TableCell>
                       <TableCell className="text-xs font-mono">{item.sku}</TableCell>
                       <TableCell>
                          <div className="flex items-center gap-2 font-bold">
                             {item.stock}
                             {item.stock <= (item.minStock || 10) && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Min: {item.minStock || 10}</p>
                       </TableCell>
                       <TableCell>
                          <div className="space-y-1">
                             {(item.marketplaces || []).map((mp: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                   <span className="text-muted-foreground">{mp}</span>
                                </div>
                             ))}
                          </div>
                       </TableCell>
                       <TableCell>
                          {item.stock === 0 ? (
                             <Badge variant="destructive" className="border-none">Stok Yok</Badge>
                          ) : item.stock <= (item.minStock || 10) ? (
                             <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none">Kritik Seviye</Badge>
                          ) : (
                             <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">Yeterli</Badge>
                          )}
                       </TableCell>
                       <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                             <Input type="number" defaultValue={item.stock} className="w-16 h-8 text-center" />
                             <Button size="icon" variant="ghost" className="h-8 w-8 text-primary shadow-sm border"><Save className="w-4 h-4" /></Button>
                          </div>
                       </TableCell>
                    </TableRow>
                 ))}
              </TableBody>
           </Table>
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader>
               <CardTitle className="text-lg">Stok Hareketleri Analizi</CardTitle>
               <CardDescription>Son 30 gündeki ürün çıkış trendleri.</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center border-t">
               <div className="text-center space-y-2">
                  <TrendingUp className="w-12 h-12 text-primary/20 mx-auto" />
                  <p className="text-sm text-muted-foreground">Bu bölümdeki grafikler gerçek verilerle doldurulacaktır.</p>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
               <CardTitle className="text-lg">Depo Dağılımı</CardTitle>
               <CardDescription>Fiziksel depolardaki stok oranları.</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center border-t">
                <div className="text-center space-y-2">
                  <Boxes className="w-12 h-12 text-primary/20 mx-auto" />
                  <p className="text-sm text-muted-foreground">Merkez Depo: %85 | Mağaza-1: %10 | İade Deposu: %5</p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};
