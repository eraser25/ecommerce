import React, { useState } from 'react';
import { 
  Plus, 
  Store, 
  RefreshCcw, 
  Settings2, 
  Link2, 
  Link2Off,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const platforms = [
  { id: 'trendyol', name: 'Trendyol', icon: 'https://cdn.dsmcdn.com/sf/assets/favicon.ico', color: 'orange' },
  { id: 'woocommerce', name: 'WooCommerce', icon: 'https://woocommerce.com/wp-content/themes/wccom/images/favicon.ico', color: 'purple' },
  { id: 'hepsiburada', name: 'Hepsiburada', icon: 'https://images.hepsiburada.net/assets/sf-favicon.ico', color: 'blue' },
  { id: 'n11', name: 'N11', icon: 'https://n11.com/favicon.ico', color: 'red' },
  { id: 'amazon', name: 'Amazon', icon: 'https://www.amazon.com.tr/favicon.ico', color: 'slate' },
  { id: 'ciceksepeti', name: 'Çiçeksepeti', icon: 'https://www.ciceksepeti.com/favicon.ico', color: 'emerald' },
];

const mockMarketplaces = [
  {
    id: '1',
    type: 'trendyol',
    name: 'Trendyol Mağazam',
    status: 'connected',
    lastSync: '2024-04-29 11:20',
    isActive: true,
    ordersToday: 24,
    productsSynced: 1240
  },
  {
    id: '2',
    type: 'woocommerce',
    name: 'Kendi Sitem (Woo)',
    status: 'disconnected',
    lastSync: '2024-04-28 14:15',
    isActive: true,
    ordersToday: 8,
    productsSynced: 850
  },
];

import { toast, Toaster } from 'sonner';

export const Marketplaces = () => {
  const [marketplaces, setMarketplaces] = useState([
    {
      id: '1',
      type: 'trendyol',
      name: 'Trendyol Mağazam',
      status: 'connected',
      lastSync: '2024-04-29 11:20',
      isActive: true,
      ordersToday: 24,
      productsSynced: 1240
    },
    {
      id: '2',
      type: 'woocommerce',
      name: 'Kendi Sitem (Woo)',
      status: 'disconnected',
      lastSync: '2024-04-28 14:15',
      isActive: true,
      ordersToday: 8,
      productsSynced: 850
    },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMp, setSelectedMp] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({ url: '', key: '', secret: '', supplierId: '' });

  const openSettings = (mp: any) => {
    setSelectedMp(mp);
    setConfig({
      url: '',
      key: '',
      secret: '',
      supplierId: ''
    });
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/${selectedMp?.type}/sync-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiUrl: config.url,
          apiKey: config.key,
          apiSecret: config.secret,
          supplierId: config.supplierId
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setMarketplaces(prev => {
          const exists = prev.find(m => m.id === selectedMp?.id || (m.type === selectedMp?.type && selectedMp?.status === 'new'));
          if (exists) {
            return prev.map(m => m.id === exists.id ? { 
              ...m, 
              status: 'connected', 
              lastSync: new Date().toLocaleString('tr-TR', { hour12: false }).replace(',', ''),
              productsSynced: data.count || m.productsSynced
            } : m);
          } else {
            return [...prev, {
              id: Math.random().toString(36).substr(2, 9),
              type: selectedMp.type,
              name: selectedMp.name,
              status: 'connected',
              lastSync: new Date().toLocaleString('tr-TR', { hour12: false }).replace(',', ''),
              isActive: true,
              ordersToday: 0,
              productsSynced: data.count || 150
            }];
          }
        });
        toast.success("Başarılı", { description: data.message });
        setIsSettingsOpen(false);
      } else {
        toast.error("Bağlantı Hatası", { description: data.error });
      }
    } catch (err) {
      console.error("Bağlantı hatası:", err);
      toast.error("Sunucu Hatası", { description: "Sunucuya bağlanılamadı. API çalışmıyor olabilir." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMarketplace = async (mp: any) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`/api/v1/${mp.type}/disconnect`, { method: 'DELETE' });
          const data = await response.json();
          if (data.success) {
            setMarketplaces(prev => prev.filter(m => m.id !== mp.id));
            resolve(data.message);
          } else {
            reject(data.error);
          }
        } catch (err) {
          reject("Bağlantı kesilemedi.");
        }
      }),
      {
        loading: 'Bağlantı kesiliyor...',
        success: (msg: any) => `${msg}`,
        error: (err: any) => `${err}`,
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Mağaza Yönetimi</h1>
          <p className="text-sm text-[#64748b]">Aktif mağazalarınızı yönetin veya yeni bir satış kanalı bağlayın.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">
                <Plus className="w-4 h-4 mr-2" /> Mağaza Bağla
              </Button>
            }
          />
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#0f172a]">Yeni Entegrasyon Ekle</DialogTitle>
              <DialogDescription className="text-[#64748b]">Bağlamak istediğiniz platformu seçerek kurulum adımlarına geçin.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
               {platforms.map(platform => (
                 <button 
                  key={platform.id}
                  onClick={() => {
                    setIsAddModalOpen(false);
                    openSettings({ type: platform.id, name: platform.name, status: 'new' });
                  }}
                  className="flex flex-col items-center gap-3 p-6 border border-[#e2e8f0] rounded-xl hover:border-[#4f46e5] hover:bg-[#4f46e5]/5 transition-all group"
                 >
                   <div className="w-12 h-12 rounded-lg bg-[#f1f5f9] flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                      <Store className="w-6 h-6 text-[#4f46e5]" />
                   </div>
                   <span className="text-sm font-bold text-[#0f172a]">{platform.name}</span>
                 </button>
               ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#4f46e5]" />
              {selectedMp?.name} Entegrasyon Ayarları
            </DialogTitle>
            <DialogDescription>
              API bağlantısı için gerekli kimlik bilgilerini girin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api_url">API Base URL</Label>
              <Input 
                id="api_url" 
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder={selectedMp?.type === 'woocommerce' ? "https://siteniz.com/wp-json/wc/v3" : "https://api.trendyol.com/sapigw"} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="api_key">API Key (Username)</Label>
                <Input 
                  id="api_key" 
                  type="password" 
                  value={config.key}
                  onChange={(e) => setConfig({ ...config, key: e.target.value })}
                  placeholder="ck_..." 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_secret">API Secret (Password)</Label>
                <Input 
                  id="api_secret" 
                  type="password" 
                  value={config.secret}
                  onChange={(e) => setConfig({ ...config, secret: e.target.value })}
                  placeholder="cs_..." 
                />
              </div>
            </div>

            {selectedMp?.type === 'trendyol' && (
              <div className="space-y-2">
                <Label htmlFor="supplier_id">Supplier ID</Label>
                <Input 
                  id="supplier_id" 
                  value={config.supplierId}
                  onChange={(e) => setConfig({ ...config, supplierId: e.target.value })}
                  placeholder="123456" 
                />
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-[#e2e8f0]">
              <div className="space-y-0.5">
                <Label>Stok Senkronizasyonu</Label>
                <p className="text-[11px] text-[#64748b]">Ürün stoklarını otomatik güncelle.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" disabled={isSaving} onClick={() => setIsSettingsOpen(false)}>İptal</Button>
            <Button 
              className="bg-[#4f46e5] hover:bg-[#4338ca]" 
              disabled={isSaving}
              onClick={handleSaveSettings}
            >
              {isSaving ? "Bağlanıyor..." : "Ayarları Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {marketplaces.map((mp) => (
          <Card key={mp.id} className="relative overflow-hidden group border-[#e2e8f0] shadow-sm">
            <div className={cn(
              "absolute top-0 left-0 w-1.5 h-full",
              mp.status === 'connected' ? "bg-[#10b981]" : "bg-[#ef4444]"
            )} />
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={cn(
                  "border-none px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider",
                  mp.status === 'connected' ? "bg-[#dcfce7] text-[#15803d]" : "bg-rose-100 text-rose-700"
                )}>
                  {mp.status === 'connected' ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" /> Bağlı</>
                  ) : (
                    <><Link2Off className="w-3 h-3 mr-1" /> Bağlantı Kesildi</>
                  )}
                </Badge>
                <div className="flex items-center gap-1">
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748b]" onClick={(e) => { e.stopPropagation(); toast.info("Yenileniyor..."); }}><RefreshCcw className="w-4 h-4" /></Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748b]" onClick={(e) => { e.stopPropagation(); openSettings(mp); }}><Settings2 className="w-4 h-4" /></Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/5" onClick={(e) => { e.stopPropagation(); handleDeleteMarketplace(mp); }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center">
                  <Store className="w-5 h-5 text-[#4f46e5]" />
                </div>
                <div>
                   <CardTitle className="text-[15px] font-bold text-[#0f172a]">{mp.name}</CardTitle>
                   <CardDescription className="uppercase text-[9px] font-bold tracking-widest text-[#64748b]">{mp.type}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5">
               <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#e2e8f0] my-2 text-sm text-[#1e293b]">
                  <div className="space-y-1">
                     <p className="text-[11px] text-[#64748b] font-bold uppercase">Bugünkü Sipariş</p>
                     <p className="text-base font-bold text-[#0f172a]">{mp.ordersToday}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[11px] text-[#64748b] font-bold uppercase">Senkronize Ürün</p>
                     <p className="text-base font-bold text-[#0f172a]">{mp.productsSynced}</p>
                  </div>
               </div>
                <div className="mt-4 flex items-center justify-between text-xs text-[#64748b]">
                  <span className="flex items-center font-medium"><RefreshCcw className="w-3 h-3 mr-1" /> {mp.lastSync}</span>
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-[#0f172a]">{mp.isActive ? 'AKTİF' : 'PASİF'}</span>
                     <Switch 
                        checked={mp.isActive} 
                        onCheckedChange={(checked) => {
                          setMarketplaces(prev => prev.map(m => m.id === mp.id ? { ...m, isActive: checked } : m));
                        }}
                        className="data-[state=checked]:bg-[#10b981]" 
                     />
                  </div>
               </div>
            </CardContent>
            <CardFooter className="bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-between items-center py-3 px-5">
               <Button 
                variant="link" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  openSettings(mp);
                }}
                className="px-0 h-auto text-[12px] font-bold text-[#4f46e5] no-underline hover:underline"
               >
                ENTREGRASYON AYARLARI
               </Button>
               <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
            </CardFooter>
          </Card>
        ))}

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="border-2 border-dashed border-[#e2e8f0] rounded-xl flex flex-col items-center justify-center p-8 gap-4 hover:border-[#4f46e5] hover:bg-[#4f46e5]/5 transition-all group"
        >
           <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#94a3b8] flex items-center justify-center group-hover:scale-110 transition-transform group-hover:border-[#4f46e5] group-hover:text-[#4f46e5]">
             <Plus className="w-6 h-6 text-[#94a3b8]" />
           </div>
           <div className="text-center">
              <p className="font-bold text-[#0f172a]">Yeni Mağaza Ekle</p>
              <p className="text-xs text-[#64748b] font-medium">Entegrasyon sihirbazını başlat</p>
           </div>
        </button>
      </div>

      <div className="mt-8 bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
         <div className="p-6 border-b border-[#e2e8f0]">
            <h2 className="text-[15px] font-bold text-[#0f172a]">Kategori Eşleştirme</h2>
            <p className="text-sm text-[#64748b]">Pazaryeri kategorileri ile kendi kategorilerinizi buradan eşleştirin.</p>
         </div>
         <div className="p-0">
            <Table>
              <TableHeader className="bg-[#f8fafc]">
                <TableRow className="border-[#e2e8f0]">
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-6">Kendi Kategorin</TableHead>
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-6">Pazaryeri</TableHead>
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-6">Mağaza Kategorisi</TableHead>
                  <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-6">Eşleşme Durumu</TableHead>
                  <TableHead className="text-right text-[11px] font-bold text-[#64748b] uppercase px-6">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 <TableRow className="border-[#e2e8f0] hover:bg-slate-50 transition-colors">
                   <TableCell className="text-[13px] font-bold text-[#1e293b] px-6">Elektronik &gt; Kulaklık</TableCell>
                   <TableCell className="px-6">
                      <span className="px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider text-[#f27a1a] border-[#f27a1a] bg-[#f27a1a]/5">Trendyol</span>
                   </TableCell>
                   <TableCell className="text-[13px] font-medium text-[#64748b] px-6">Elektronik &gt; Bluetooth Kulaklıklar</TableCell>
                   <TableCell className="px-6"><span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-[#dcfce7] text-[#15803d]">Tam Uyum</span></TableCell>
                   <TableCell className="text-right px-6"><Button variant="ghost" size="sm" className="font-bold text-[#4f46e5]">DÜZENLE</Button></TableCell>
                 </TableRow>
                 <TableRow className="border-[#e2e8f0] hover:bg-slate-50 transition-colors">
                   <TableCell className="text-[13px] font-bold text-[#1e293b] px-6">Moda &gt; Çanta</TableCell>
                   <TableCell className="px-6">
                      <span className="px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider text-[#96588a] border-[#96588a] bg-[#96588a]/5">WooCommerce</span>
                   </TableCell>
                   <TableCell className="text-[13px] font-medium text-[#64748b] px-6">Aksesuar &gt; El Çantaları</TableCell>
                   <TableCell className="px-6"><span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-blue-50 text-blue-700">Yarı Uyum</span></TableCell>
                   <TableCell className="text-right px-6"><Button variant="ghost" size="sm" className="font-bold text-[#4f46e5]">DÜZENLE</Button></TableCell>
                 </TableRow>
              </TableBody>
            </Table>
         </div>
      </div>
    </div>
  );
};
