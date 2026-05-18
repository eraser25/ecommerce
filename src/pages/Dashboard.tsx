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
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // 30 saniyede bir kontrol et
    return () => clearInterval(interval);
  }, []);

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
          value="₺142.850,00" 
          icon={DollarSign} 
          description="geçen aya göre"
          trend="up"
          trendValue="12.5%"
        />
        <StatCard 
          title="Bekleyen Sipariş" 
          value="42" 
          icon={ShoppingCart} 
          description="6 tanesi gecikti"
          trend="up"
          trendValue="5"
        />
        <StatCard 
          title="Kritik Stok" 
          value="8 Ürün" 
          icon={AlertTriangle} 
          description="Stok bitmek üzere"
          trend="down"
          trendValue="2"
        />
        <StatCard 
          title="Mağaza Sağlığı" 
          value="98%" 
          icon={TrendingUp} 
          description="Mükemmel"
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
                  {[
                    { id: '#ORD-9921', customer: 'Mert Altınay', mp: 'Trendyol', amount: '₺1.250,00', status: 'Hazırlanıyor', statusColor: 'bg-[#dcfce7] text-[#15803d]' },
                    { id: '#ORD-9920', customer: 'Selin Yılmaz', mp: 'WooCommerce', amount: '₺420,50', status: 'Ödeme Bekliyor', statusColor: 'bg-[#fef9c3] text-[#854d0e]' },
                    { id: '#ORD-9919', customer: 'Caner Demir', mp: 'Trendyol', amount: '₺2.100,00', status: 'Kargoya Hazır', statusColor: 'bg-[#dcfce7] text-[#15803d]' },
                    { id: '#ORD-9918', customer: 'Ayşe Kara', mp: 'WooCommerce', amount: '₺850,00', status: 'Tamamlandı', statusColor: 'bg-[#dcfce7] text-[#15803d]' },
                  ].map((order, i) => (
                    <TableRow key={i} className="border-[#e2e8f0] hover:bg-slate-50 transition-colors">
                      <TableCell className="text-[13px] font-medium px-5">{order.id}</TableCell>
                      <TableCell className="text-[13px] px-5 font-medium">{order.customer}</TableCell>
                      <TableCell className="px-5">
                         <span className={cn(
                           "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                           order.mp === 'Trendyol' ? "text-[#f27a1a] border-[#f27a1a] bg-[#f27a1a]/5" : "text-[#96588a] border-[#96588a] bg-[#96588a]/5"
                         )}>
                           {order.mp}
                         </span>
                      </TableCell>
                      <TableCell className="text-[13px] font-bold px-5">{order.amount}</TableCell>
                      <TableCell className="px-5">
                        <span className={cn("px-2 py-1 rounded-md font-bold text-[11px]", order.statusColor)}>
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
             <div className="flex justify-between items-center">
                <div>
                   <div className="text-[13px] font-bold text-[#0f172a]">Trendyol - Ana Mağaza</div>
                   <div className="text-[11px] text-[#64748b] font-medium">Son Senk: 2 dk önce</div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"></div>
             </div>
             <div className="flex justify-between items-center">
                <div>
                   <div className="text-[13px] font-bold text-[#0f172a]">WooCommerce WP</div>
                   <div className="text-[11px] text-[#64748b] font-medium">Son Senk: 5 dk önce</div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"></div>
             </div>
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
