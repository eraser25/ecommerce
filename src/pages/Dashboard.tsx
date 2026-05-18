import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { Badge } from '@/components/ui/badge';

const salesData = [
  { name: 'Pzt', sales: 4000, orders: 240 },
  { name: 'Sal', sales: 3000, orders: 198 },
  { name: 'Çar', sales: 2000, orders: 980 },
  { name: 'Per', sales: 2780, orders: 390 },
  { name: 'Cum', sales: 1890, orders: 480 },
  { name: 'Cmt', sales: 2390, orders: 380 },
  { name: 'Paz', sales: 3490, orders: 430 },
];

const topProducts = [
  { id: '1', name: 'Kablosuz Kulaklık X Pro', sales: 124, price: 1290, image: '🎧' },
  { id: '2', name: 'Akıllı Saat Series 7', sales: 98, price: 3450, image: '⌚' },
  { id: '3', name: 'Taşınabilir Şarj Cihazı', sales: 85, price: 450, image: '🔋' },
  { id: '4', name: 'Mekanik Klavye RGB', sales: 72, price: 1800, image: '⌨️' },
];

const StatCard = ({ title, value, icon: Icon, description, trend, trendValue }: any) => (
  <Card className="border-[#e2e8f0] shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-[#0f172a]">{value}</div>
      <div className="flex items-center mt-1">
        {trend === 'up' ? (
          <span className="text-xs font-semibold text-[#10b981] flex items-center">↑ {trendValue}</span>
        ) : (
          <span className="text-xs font-semibold text-[#ef4444] flex items-center">↓ {trendValue}</span>
        )}
        <span className="text-[11px] text-[#94a3b8] ml-1 font-medium italic">{description}</span>
      </div>
    </CardContent>
  </Card>
);

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Store, Eye } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export const Dashboard = () => {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [marketplaces, setMarketplaces] = useState<any[]>([]);
  const [totalDbProducts, setTotalDbProducts] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const checkStatus = () => {
      fetch('/api/v1/status')
        .then(res => res.json())
        .then(data => {
          setApiStatus(data);
          console.log('API Status:', data);
        })
        .catch(err => {
          console.error('API Connection Failed:', err);
          setApiStatus({ message: 'Sunucuya Bağlanılamıyor', error: true });
        });
    };

    const fetchMps = () => {
      fetch('/api/v1/marketplaces')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMarketplaces(data.marketplaces);
          }
        })
        .catch(err => console.error("Marketplace fetch error:", err));
    };

    const fetchProductCount = () => {
      fetch('/api/v1/products')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTotalDbProducts(data.products.length);
          }
        })
        .catch(err => console.error("Product count fetch error:", err));
    };
    
    const fetchOrders = () => {
      fetch('/api/v1/orders')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          }
        })
        .catch(err => console.error("Orders fetch error:", err));
    };

    checkStatus();
    fetchMps();
    fetchOrders();
    fetchProductCount();
    const interval = setInterval(() => {
      checkStatus();
      fetchMps();
      fetchOrders();
      fetchProductCount();
    }, 30000); // 30 saniyede bir kontrol et
    return () => clearInterval(interval);
  }, []);

  const totalOrdersToday = marketplaces.reduce((sum, mp) => sum + (mp.ordersToday || 0), 0);
  const totalProducts = marketplaces.reduce((sum, mp) => sum + (mp.productsSynced || 0), 0);
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {apiStatus && (
        <div className={cn(
          "p-3 rounded-lg flex items-center justify-between border",
          apiStatus.error 
            ? "bg-rose-50 border-rose-200 text-rose-700" 
            : "bg-[#4f46e5]/10 border-[#4f46e5]/20 text-[#4f46e5]"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              apiStatus.error ? "bg-rose-500" : "bg-[#4f46e5] animate-pulse"
            )} />
            <span className="text-[13px] font-bold">
              {apiStatus.error ? "SUNUCU ÇEVRIMDIŞI: API bağlantısı kurulamadı" : apiStatus.message}
            </span>
          </div>
          {!apiStatus.error && apiStatus.time && (
            <span className="text-[11px] font-medium opacity-70">
              Son Kontrol: {new Date(apiStatus.time).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Toplam Satış" 
          value={totalSales > 0 ? `₺${totalSales.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : "₺0,00"} 
          icon={DollarSign} 
          description="tüm mağazalar"
          trend="up"
          trendValue="12.5%"
        />
        <StatCard 
          title="Bugünkü Sipariş" 
          value={totalOrdersToday.toString()} 
          icon={ShoppingCart} 
          description="tüm mağazalar"
          trend="up"
          trendValue={totalOrdersToday > 0 ? "Aktif" : "0"}
        />
        <StatCard 
          title="Senkronize Ürün" 
          value={totalDbProducts > 0 ? totalDbProducts.toString() : totalProducts.toString()} 
          icon={Package} 
          description="Envanter büyüklüğü"
          trend="up"
          trendValue="Normal"
        />
        <StatCard 
          title="Mağaza Sağlığı" 
          value={marketplaces.length > 0 ? "98%" : "0%"} 
          icon={TrendingUp} 
          description={marketplaces.length > 0 ? "Mükemmel" : "Bağlantı Yok"}
          trend="up"
          trendValue="1.2%"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 h-full">
        <Card className="lg:col-span-4 border-[#e2e8f0] shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#e2e8f0] py-4 px-5">
            <div>
              <CardTitle className="text-[15px] font-bold text-[#0f172a]">Son Siparişler</CardTitle>
            </div>
            <span className="text-xs font-bold text-[#4f46e5] cursor-pointer hover:underline uppercase tracking-wider">Tümünü Gör</span>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <div className="table-container">
              <Table>
                <TableHeader className="bg-[#f8fafc]">
                  <TableRow className="border-[#e2e8f0]">
                    <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Sipariş No</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Müşteri</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5 font-mono">Pazaryeri</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Tutar</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748b] uppercase px-5">Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-4 text-xs text-muted-foreground italic">Sipariş bulunamadı.</TableCell></TableRow>
                  ) : orders.slice(0, 5).map((order, i) => (
                    <TableRow key={order.id || i} className="border-[#e2e8f0] hover:bg-slate-50 transition-colors">
                      <TableCell className="text-[13px] font-medium px-5">{order.orderNumber}</TableCell>
                      <TableCell className="text-[13px] px-5 font-medium">{order.customerName}</TableCell>
                      <TableCell className="px-5">
                         <span className={cn(
                           "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                           order.marketplace === 'Trendyol' ? "text-[#f27a1a] border-[#f27a1a] bg-[#f27a1a]/5" : "text-[#96588a] border-[#96588a] bg-[#96588a]/5"
                         )}>
                           {order.marketplace}
                         </span>
                      </TableCell>
                      <TableCell className="text-[13px] font-bold px-5">₺{order.totalAmount?.toLocaleString()}</TableCell>
                      <TableCell className="px-5">
                        <span className={cn(
                          "px-2 py-1 rounded-md font-bold text-[11px]",
                          order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : (order.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700")
                        )}>
                          {order.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-[#e2e8f0] shadow-sm flex flex-col">
          <CardHeader className="border-b border-[#e2e8f0] py-4 px-5">
            <CardTitle className="text-[15px] font-bold text-[#0f172a]">Mağaza Durumları</CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex-1 space-y-5">
            {marketplaces.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Bağlı mağaza bulunamadı.</p>
            ) : (
              marketplaces.map((mp, i) => (
                <div key={mp.id || i} className="flex justify-between items-center">
                  <div>
                    <div className="text-[13px] font-bold text-[#0f172a]">{mp.name}</div>
                    <div className="text-[11px] text-[#64748b] font-medium">Son Senk: {mp.lastSync ? new Date(mp.lastSync).toLocaleTimeString() : 'Hiç'}</div>
                  </div>
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full shadow-[0_0_0_3px_rgba(16,185,129,0.1)]",
                    mp.status === 'connected' ? "bg-[#10b981]" : "bg-rose-500"
                  )}></div>
                </div>
              ))
            )}
            <div className="h-px bg-[#e2e8f0] my-2"></div>
             <div>
                <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-4">En Çok Satanlar</div>
                <div className="space-y-4">
                   {[
                     { name: 'Kablosuz Kulaklık X1', sales: 24 },
                     { name: 'Akıllı Saat Pro', sales: 18 }
                   ].map((item, idx) => (
                     <div key={idx} className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg border border-[#e2e8f0]" />
                        <div>
                           <div className="text-xs font-bold text-[#0f172a]">{item.name}</div>
                           <div className="text-[11px] text-[#10b981] font-bold">{item.sales} Satış (Bugün)</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
