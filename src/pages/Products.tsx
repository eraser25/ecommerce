import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Edit,
  LayoutGrid,
  List,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  Monitor,
  Store,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockProducts = [
  {
    id: '1',
    name: 'Kablosuz Kulaklık X Pro',
    sku: 'EAR-XPRO-001',
    category: 'Elektronik',
    price: 1290,
    stock: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    marketplaces: ['trendyol', 'woocommerce'],
    brand: 'X-Audio'
  },
  {
    id: '2',
    name: 'Akıllı Saat Series 7',
    sku: 'WATCH-S7-BLK',
    category: 'Giyilebilir Teknoloji',
    price: 3450,
    stock: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    marketplaces: ['trendyol', 'woocommerce', 'hepsiburada'],
    brand: 'TechBrand'
  },
  {
    id: '3',
    name: 'Deri Cüzdan - Kahverengi',
    sku: 'LTH-WL-BRW',
    category: 'Aksesuar',
    price: 450,
    stock: 85,
    status: 'passive',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop',
    marketplaces: ['woocommerce'],
    brand: 'LeatherCo'
  },
];

export const Products = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Products fetch error:", err);
      toast.error("Ürünler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: any) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(`/api/v1/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Ürün başarıyla güncellendi.");
        setIsEditModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error("Güncelleme başarısız.");
    }
  };

  const handleCopy = async (id: string) => {
    toast.promise(
      fetch(`/api/v1/products/${id}/copy`, { method: 'POST' }).then(res => res.json()),
      {
        loading: 'Ürün kopyalanıyor...',
        success: (data) => {
          fetchProducts();
          return "Ürün kopyalandı.";
        },
        error: 'Kopyalama başarısız.'
      }
    );
  };

  const handleSyncMarketplace = async (id: string) => {
    toast.promise(
      fetch(`/api/v1/products/${id}/sync-marketplace`, { method: 'POST' }).then(res => res.json()),
      {
        loading: 'Pazaryeri senkronize ediliyor...',
        success: (data) => data.message,
        error: 'Senkronizasyon başarısız.'
      }
    );
  };

  const handleViewInStore = (product: any) => {
    if (product.platformType === 'woocommerce' && product.platformId) {
      // Bu URL normalde WooCommerce URL'ine gitmeli
      toast.info("Yönlendiriliyorsunuz...");
      window.open(`https://woocommerce.com/products/${product.platformId}`, '_blank');
    } else {
      toast.info("Pazaryeri bağlantısı bulunamadı.");
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Ürünler ve Envanter</h1>
          <p className="text-sm text-[#64748b]">Tüm ürünlerinizi tek bir yerden yönetin ve stoklarınızı senkronize edin.</p>
        </div>
        <div className="flex items-center gap-2">
           <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
             <DialogTrigger render={
               <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">
                 <Plus className="w-4 h-4 mr-2" /> Yeni Ürün Ekle
               </Button>
             } />
             <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                 <DialogTitle>Yeni Ürün Oluştur</DialogTitle>
                 <DialogDescription>Ürün bilgilerini detaylıca girerek tüm pazaryerlerinde satışa başlayın.</DialogDescription>
               </DialogHeader>
               
               <Tabs defaultValue="general" className="mt-4">
                 <TabsList className="grid w-full grid-cols-4">
                   <TabsTrigger value="general">Genel</TabsTrigger>
                   <TabsTrigger value="pricing">Fiyat & Stok</TabsTrigger>
                   <TabsTrigger value="variants">Varyantlar</TabsTrigger>
                   <TabsTrigger value="pazaryeri">Pazaryerleri</TabsTrigger>
                 </TabsList>
                 
                 <TabsContent value="general" className="space-y-4 pt-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Ürün Adı</Label>
                       <Input placeholder="Örn: Kablosuz Mouse" />
                     </div>
                     <div className="space-y-2">
                       <Label>Kategori</Label>
                       <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                         <option>Elektronik</option>
                         <option>Giyim</option>
                         <option>Ev & Yaşam</option>
                       </select>
                     </div>
                     <div className="space-y-2">
                       <Label>Marka</Label>
                       <Input placeholder="Marka giriniz" />
                     </div>
                     <div className="space-y-2">
                       <Label>SKU (Stok Kodu)</Label>
                       <Input placeholder="KMS-001" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label>Açıklama</Label>
                     <textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Ürün detayları..." />
                   </div>
                 </TabsContent>
                 
                 <TabsContent value="pricing" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Satış Fiyatı (₺)</Label>
                        <Input type="number" placeholder="100.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>İndirimli Fiyat (₺)</Label>
                        <Input type="number" placeholder="80.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Stok Adedi</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Kritik Stok Seviyesi</Label>
                        <Input type="number" placeholder="5" />
                      </div>
                    </div>
                 </TabsContent>
                 
                 <TabsContent value="variants" className="pt-4 text-center py-12 border-2 border-dashed rounded-lg bg-accent/10">
                    <div className="flex flex-col items-center gap-4">
                       <Package className="w-12 h-12 text-muted-foreground" />
                       <div className="space-y-1">
                          <h3 className="font-semibold text-lg">Hala varyant yok</h3>
                          <p className="text-sm text-muted-foreground px-12">Ürününüzün renk, beden gibi seçenekleri varsa varyant ekleyerek devam edin.</p>
                       </div>
                       <Button variant="outline">Varyant Ekle</Button>
                    </div>
                 </TabsContent>

                 <TabsContent value="pazaryeri" className="pt-4 space-y-4">
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Store className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="text-sm font-semibold">Trendyol</p>
                            <p className="text-xs text-muted-foreground">Aktif Listeleme</p>
                          </div>
                       </div>
                       <Checkbox checked />
                    </div>
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Monitor className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm font-semibold">WooCommerce</p>
                            <p className="text-xs text-muted-foreground">Bağlı Değil</p>
                          </div>
                       </div>
                       <Checkbox />
                    </div>
                 </TabsContent>
               </Tabs>

               <DialogFooter className="mt-6">
                 <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Vazgeç</Button>
                 <Button onClick={() => setIsAddModalOpen(false)}>Kaydet ve Yayınla</Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Ürün adı, SKU veya barkod ara..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="icon" onClick={() => setViewMode('table')} className={cn(viewMode === 'table' && "bg-accent")}>
            <List className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={cn(viewMode === 'grid' && "bg-accent")}>
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <DropdownMenu>
             <DropdownMenuTrigger render={
                <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filtrele</Button>
             } />
             <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                   <DropdownMenuItem>Kategoriler</DropdownMenuItem>
                   <DropdownMenuItem>Markalar</DropdownMenuItem>
                   <DropdownMenuItem>Stok Durumu</DropdownMenuItem>
                   <DropdownMenuItem>Yayın Durumu</DropdownMenuItem>
                </DropdownMenuGroup>
             </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
           <span className="text-sm font-medium">{selectedProducts.length} ürün seçildi</span>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Fiyat Güncelle</Button>
              <Button variant="outline" size="sm">Pazaryerine Gönder</Button>
              <Button variant="destructive" size="sm">Toplu Sil</Button>
           </div>
        </div>
      )}

      {viewMode === 'table' ? (
        <Card className="border-[#e2e8f0] shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#f8fafc]">
                <TableRow className="border-[#e2e8f0]">
                  <TableHead className="w-12 px-5">
                    <Checkbox checked={products.length > 0 && selectedProducts.length === products.length} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Ürün</TableHead>
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">SKU</TableHead>
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Fiyat</TableHead>
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Stok</TableHead>
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Pazaryerleri</TableHead>
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Durum</TableHead>
                  <TableHead className="text-right text-[11px] font-bold text-[#64748b] uppercase px-5">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 && !loading ? (
                   <TableRow>
                     <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                        Henüz senkronize edilmiş ürün bulunamadı. Lütfen "Mağaza Yönetimi" sayfasından mağazanızı bağlayın.
                     </TableCell>
                   </TableRow>
                ) : products.map((product) => (
                  <TableRow key={product.id} className="border-[#e2e8f0] hover:bg-slate-50 transition-colors">
                    <TableCell className="px-5">
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)} 
                        onCheckedChange={() => toggleSelect(product.id)} 
                      />
                    </TableCell>
                    <TableCell className="px-5">
                      <div className="flex items-center gap-3">
                        <img src={product.image} className="w-10 h-10 rounded-lg object-cover border border-[#e2e8f0]" alt="" />
                        <div>
                          <p className="text-[13px] font-bold text-[#0f172a]">{product.name}</p>
                          <p className="text-[11px] text-[#64748b] font-medium">{product.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[12px] font-bold text-[#64748b] px-5">{product.sku}</TableCell>
                    <TableCell className="px-5">
                       <div className="text-[13px] font-bold text-[#0f172a]">₺{product.price.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="px-5">
                       <div className={cn("text-[13px] font-bold", product.stock < 20 ? "text-[#ef4444]" : "text-[#1e293b]")}>
                         {product.stock} Adet
                       </div>
                    </TableCell>
                    <TableCell className="px-5">
                      <div className="flex items-center gap-1">
                        {product.marketplaces.map(mp => (
                          <div key={mp} className={cn(
                            "px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider",
                            mp === 'trendyol' ? "text-[#f27a1a] border-[#f27a1a] bg-[#f27a1a]/5" : "text-[#96588a] border-[#96588a] bg-[#96588a]/5"
                          )}>
                            {mp}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="px-5">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md font-bold text-[11px]",
                        product.status === 'active' ? "bg-[#dcfce7] text-[#15803d]" : "bg-slate-100 text-[#64748b]"
                      )}>
                        {product.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                         } />
                         <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                               <DropdownMenuItem onClick={() => handleEdit(product)}><Edit className="w-4 h-4 mr-2" /> Düzenle</DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleSyncMarketplace(product.id)}><RefreshCw className="w-4 h-4 mr-2" /> Pazaryerine Gönder</DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleCopy(product.id)}><Copy className="w-4 h-4 mr-2" /> Kopyala</DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleViewInStore(product)}><ExternalLink className="w-4 h-4 mr-2" /> Mağazada Gör</DropdownMenuItem>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Sil</DropdownMenuItem>
                            </DropdownMenuGroup>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
           {products.map((product) => (
             <Card key={product.id} className="overflow-hidden group relative">
               <div className="absolute top-2 left-2 z-10 transition-opacity">
                 <Checkbox 
                   checked={selectedProducts.includes(product.id)} 
                   onCheckedChange={() => toggleSelect(product.id)} 
                   className="bg-background shadow-md border-primary/20"
                 />
               </div>
               <img src={product.image} className="w-full aspect-square object-cover" alt="" />
               <CardContent className="p-4">
                 <div className="space-y-1">
                   <p className="text-xs text-muted-foreground uppercase font-semibold">{product.brand}</p>
                   <h3 className="text-sm font-bold truncate">{product.name}</h3>
                 </div>
                 <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">₺{product.price.toLocaleString()}</span>
                    <Badge variant="outline" className="text-[10px]">{product.stock} Adet</Badge>
                 </div>
                 <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex gap-1">
                       {product.marketplaces.map(mp => (
                          <span key={mp} className="w-4 h-4 rounded bg-accent border p-0.5"><Store className="w-full h-full" /></span>
                       ))}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}><Edit className="w-3 h-3" /></Button>
                 </div>
               </CardContent>
             </Card>
           ))}
        </div>
      )}

      <div className="flex items-center justify-between">
         <p className="text-xs text-muted-foreground">Toplam {products.length} üründen 1-{products.length} arası gösteriliyor.</p>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="icon" disabled><ChevronRight className="w-4 h-4" /></Button>
         </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ürün Düzenle</DialogTitle>
            <DialogDescription>Ürün bilgilerini güncelleyin. Değişiklikler kaydedildikten sonra pazaryerlerine gönderilebilir.</DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ürün Adı</Label>
                  <Input 
                    value={editingProduct.name || ""} 
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kategori Eşleme</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingProduct.category || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  >
                    <option value="">Seçiniz...</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Aksesuar">Aksesuar</option>
                    <option value="Giyim">Giyim</option>
                    <option value="Ev & Yaşam">Ev & Yaşam</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Fiyat (₺)</Label>
                  <Input 
                    type="number"
                    value={editingProduct.price ?? 0} 
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stok</Label>
                  <Input 
                    type="number"
                    value={editingProduct.stock ?? 0} 
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})} 
                  />
                </div>
                <div className="space-y-2">
                   <Label>SKU</Label>
                   <Input 
                     value={editingProduct.sku || ""} 
                     onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})} 
                   />
                </div>
                <div className="space-y-2">
                   <Label>Marka</Label>
                   <Input 
                     value={editingProduct.brand || ""} 
                     onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})} 
                   />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Vazgeç</Button>
            <Button onClick={saveEdit}>Güncelle ve Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
