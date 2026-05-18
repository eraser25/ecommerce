import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Store, 
  Layers, 
  BarChart3, 
  Users, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  User as UserIcon,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, isActive, onClick, collapsed }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg group",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    )}
  >
    <Icon className={cn("w-5 h-5", collapsed ? "mx-auto" : "mr-3")} />
    {!collapsed && <span>{label}</span>}
  </button>
);

export const Layout = ({ children, activePage, setActivePage }: { 
  children: React.ReactNode; 
  activePage: string;
  setActivePage: (page: string) => void;
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const sidebarWidth = isSidebarCollapsed ? "w-[80px]" : "w-[240px]";
  const marginLeft = isSidebarCollapsed ? "ml-[80px]" : "ml-[240px]";

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Siparişler', icon: ShoppingCart },
    { id: 'products', label: 'Ürünler', icon: Package },
    { id: 'inventory', label: 'Envanter', icon: Boxes },
    { id: 'marketplaces', label: 'Pazaryerleri', icon: Store },
    { id: 'categories', label: 'Kategoriler', icon: Layers },
    { id: 'reports', label: 'Raporlar', icon: BarChart3 },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className={cn("min-h-screen flex bg-[#f8fafc]", isDarkMode && "dark")}>
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-[#e2e8f0] transition-all duration-300",
          sidebarWidth
        )}
      >
        <div className="flex flex-col h-full py-6">
          {/* Logo */}
          <div className="flex items-center px-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#4f46e5] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                M
              </div>
              {!isSidebarCollapsed && (
                <span className="text-lg font-bold tracking-tight text-[#0f172a] whitespace-nowrap">MarketMaster</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-0 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={cn(
                    "flex items-center w-full px-6 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                    isActive 
                      ? "bg-[#f1f5f9] text-[#4f46e5] border-r-3 border-[#4f46e5]" 
                      : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#4f46e5]"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isSidebarCollapsed ? "mx-auto" : "mr-3")} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="px-6 py-6 border-t border-[#e2e8f0]">
            <div className={cn("flex items-center", isSidebarCollapsed ? "justify-center" : "space-x-3")}>
               <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex-shrink-0" />
               {!isSidebarCollapsed && (
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0f172a] truncate uppercase">Admin User</p>
                    <p className="text-[10px] text-[#64748b] truncate font-medium">PRO PLAN</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        marginLeft
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0]">
          <div className="flex items-center justify-between h-16 px-8">
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-[#64748b]">
                 {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
               </Button>
               <div className="relative hidden lg:flex items-center bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg px-3 py-1.5 w-[320px] text-[#94a3b8] text-sm">
                  <Search className="w-4 h-4 mr-2" />
                  <span>Ara (Sipariş, Ürün, SKU...)...</span>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-[#4f46e5] font-medium text-sm hover:bg-[#4f46e5]/5"
              >
                {isDarkMode ? 'Aydınlık Mod' : 'Karanlık Mod'}
              </Button>
              <div className="relative cursor-pointer text-sm font-medium text-[#64748b] flex items-center gap-1 hover:text-[#0f172a] transition-colors">
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white"></span>
                </div>
                <span className="hidden md:inline">Bildirimler</span>
              </div>
              <div className="h-4 w-[1px] bg-[#e2e8f0] mx-2" />
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="flex items-center gap-2 px-1">
                    <Avatar className="w-8 h-8 border border-[#e2e8f0]">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>EA</AvatarFallback>
                    </Avatar>
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profil Ayarları</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Çıkış Yap</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1440px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
