import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  ExternalLink,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  Ban
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
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const orders = [
  { 
    id: '1', 
    orderNumber: 'TY-123456', 
    customerName: 'Ahmet Yılmaz', 
    items: [{ name: 'Kablosuz Kulaklık X Pro', quantity: 1 }], 
    totalAmount: 1290, 
    status: 'shipped', 
    paymentStatus: 'paid', 
    marketplace: 'Trendyol',
    createdAt: '2024-04-29 10:30',
    shippingAddress: 'Merkez Mah. Atatürk Cad. No:12 D:4 Şişli/İstanbul',
    phone: '0530 000 00 00'
  },
  { 
    id: '2', 
    orderNumber: 'WC-987654', 
    customerName: 'Ayşe Demir', 
    items: [{ name: 'Akıllı Saat Series 7', quantity: 1 }], 
    totalAmount: 3450, 
    status: 'pending', 
    paymentStatus: 'paid', 
    marketplace: 'WooCommerce',
    createdAt: '2024-04-29 09:15',
    shippingAddress: 'Yıldız Mah. Bahar Sok. No:5 Beşiktaş/İstanbul',
    phone: '0532 111 22 33'
  },
  { 
    id: '3', 
    orderNumber: 'HB-554433', 
    customerName: 'Mehmet Öz', 
    items: [{ name: 'Taşınabilir Şarj Cihazı', quantity: 2 }], 
    totalAmount: 900, 
    status: 'delivered', 
    paymentStatus: 'paid', 
    marketplace: 'Hepsiburada',
    createdAt: '2024-04-28 16:45',
    shippingAddress: 'Kültür Mah. 123. Sok. No:1 Çankaya/Ankara',
    phone: '0544 333 44 55'
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none"><Clock className="w-3 h-3 mr-1" /> Bekliyor</Badge>;
    case 'processing': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">İşleniyor</Badge>;
    case 'shipped': return <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-none"><Truck className="w-3 h-3 mr-1" /> Kargoya Verildi</Badge>;
    case 'delivered': return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Teslim Edildi</Badge>;
    case 'cancelled': return <Badge variant="secondary" className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-none"><Ban className="w-3 h-3 mr-1" /> İptal Edildi</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

const MarketplaceBadge = ({ marketplace }: { marketplace: string }) => {
  const colors: Record<string, string> = {
    'Trendyol': 'text-orange-500 bg-orange-50 dark:bg-orange-500/10',
    'WooCommerce': 'text-purple-500 bg-purple-50 dark:bg-purple-500/10',
    'Hepsiburada': 'text-blue-600 bg-blue-50 dark:bg-blue-600/10',
    'N11': 'text-red-500 bg-red-50 dark:bg-red-500/10',
    'Amazon': 'text-slate-700 bg-slate-50 dark:bg-slate-700/10',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", colors[marketplace] || "bg-accent")}>
      {marketplace}
    </span>
  );
};

export const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const handlePrintLabel = async (orderId: string) => {
    toast.promise(
      fetch(`/api/v1/orders/${orderId}/label`).then(res => res.json()),
      {
        loading: 'Etiket hazırlanıyor...',
        success: (data) => {
          if (data.labelUrl) window.open(data.labelUrl, '_blank');
          return "Etiket hazır!";
        },
        error: 'Etiket hazırlanamadı.'
      }
    );
  };

  const handleDownloadInvoice = async (orderId: string) => {
    toast.promise(
      fetch(`/api/v1/orders/${orderId}/invoice`).then(res => res.json()),
      {
        loading: 'Fatura hazırlanıyor...',
        success: (data) => {
          if (data.invoiceUrl) window.open(data.invoiceUrl, '_blank');
          return "Fatura hazır!";
        },
        error: 'Fatura hazırlanamadı.'
      }
    );
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Siparişler</h1>
          <p className="text-sm text-[#64748b]">Tüm pazaryerlerinden gelen siparişleri buradan yönetebilirsiniz.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={fetchOrders} className="border-[#e2e8f0] text-[#64748b]">
             <Clock className="w-4 h-4 mr-2" /> Yenile
           </Button>
           <Button variant="outline" size="sm" className="border-[#e2e8f0] text-[#64748b]">
             <Download className="w-4 h-4 mr-2" /> Dışa Aktar
           </Button>
        </div>
      </div>

      <Card className="border-[#e2e8f0] shadow-sm">
        <CardHeader className="border-b border-[#e2e8f0] px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <Input 
                placeholder="Sipariş no veya müşteri ara..." 
                className="pl-10 h-9 bg-[#f8fafc] border-[#e2e8f0]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="h-9 border-[#e2e8f0] text-[#64748b]">
                 <Filter className="w-4 h-4 mr-2" /> Filtrele
               </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#f8fafc]">
              <TableRow className="border-[#e2e8f0]">
                <TableHead className="w-[120px] text-[11px] font-bold text-[#64748b] uppercase px-5">Sipariş No</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Müşteri</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Marketplace</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Tutar</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Durum</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Tarih</TableHead>
                <TableHead className="text-right text-[11px] font-bold text-[#64748b] uppercase px-5">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 && !loading ? (
                <TableRow>
                   <TableCell colSpan={7} className="text-center py-10 text-muted-foreground italic">Sipariş bulunamadı.</TableCell>
                </TableRow>
              ) : filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-[#e2e8f0] hover:bg-slate-50 transition-colors">
                  <TableCell className="font-bold text-[13px] px-5">{order.orderNumber}</TableCell>
                  <TableCell className="text-[13px] px-5 font-medium">{order.customerName}</TableCell>
                  <TableCell className="px-5">
                    <MarketplaceBadge marketplace={order.marketplace} />
                  </TableCell>
                  <TableCell className="text-[13px] font-bold px-5">₺{order.totalAmount?.toLocaleString()}</TableCell>
                  <TableCell className="px-5">
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-xs text-[#64748b] px-5">{order.createdAt}</TableCell>
                  <TableCell className="text-right px-5">
                    <Dialog>
                      <DialogTrigger render={
                         <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                      } />
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <div className="flex items-center justify-between">
                            <DialogTitle>Sipariş Detayı - {order.orderNumber}</DialogTitle>
                            <MarketplaceBadge marketplace={order.marketplace} />
                          </div>
                          <DialogDescription>Sipariş ayrıntıları ve müşteri bilgileri.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                           <div className="space-y-4">
                             <div>
                               <label className="text-xs font-semibold text-muted-foreground uppercase">Müşteri Bilgileri</label>
                               <p className="font-medium">{order.customerName}</p>
                               <p className="text-sm">{order.phone}</p>
                             </div>
                             <div>
                               <label className="text-xs font-semibold text-muted-foreground uppercase">Teslimat Adresi</label>
                               <p className="text-sm">{order.shippingAddress}</p>
                             </div>
                           </div>
                           <div className="space-y-4">
                             <div>
                               <label className="text-xs font-semibold text-muted-foreground uppercase">Sipariş Durumu</label>
                               <div className="mt-1"><StatusBadge status={order.status} /></div>
                             </div>
                             <div>
                               <label className="text-xs font-semibold text-muted-foreground uppercase">Ödeme Durumu</label>
                               <p className={cn("text-sm font-medium", order.paymentStatus === 'paid' ? "text-emerald-600" : "text-amber-600")}>
                                 {order.paymentStatus === 'paid' ? 'Ödendi' : 'Ödeme Bekliyor'}
                               </p>
                             </div>
                           </div>
                        </div>
                        <div className="mt-6">
                           <label className="text-xs font-semibold text-muted-foreground uppercase block mb-2">Ürünler</label>
                           <div className="border rounded-lg overflow-hidden">
                             {order.items?.map((item: any, idx: number) => (
                               <div key={idx} className="flex items-center justify-between p-3 bg-accent/20 border-b last:border-0">
                                 <div>
                                   <p className="text-sm font-medium">{item.name}</p>
                                   <p className="text-xs text-muted-foreground">Adet: {item.quantity}</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                           <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order.id)}>Fatura İndir</Button>
                           <Button size="sm" onClick={() => handlePrintLabel(order.id)}>Etiket Yazdır</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
