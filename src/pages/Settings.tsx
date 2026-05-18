import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Mail, Globe, Palette, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Settings = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Sistem genelindeki tercihlerinizi ve yapılandırmaları yönetin.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-accent/50">
          <TabsTrigger value="general" className="py-2"><Globe className="w-4 h-4 mr-2" /> Genel</TabsTrigger>
          <TabsTrigger value="notifications" className="py-2"><Bell className="w-4 h-4 mr-2" /> Bildirim</TabsTrigger>
          <TabsTrigger value="security" className="py-2"><Shield className="w-4 h-4 mr-2" /> Güvenlik</TabsTrigger>
          <TabsTrigger value="smtp" className="py-2"><Mail className="w-4 h-4 mr-2" /> SMTP</TabsTrigger>
          <TabsTrigger value="api" className="py-2"><Database className="w-4 h-4 mr-2" /> API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mağaza Bilgileri</CardTitle>
              <CardDescription>Müşterilerinize görünecek olan temel bilgiler.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Mağaza Adı</Label>
                   <Input defaultValue="Akbulut Teknoloji" />
                 </div>
                 <div className="space-y-2">
                   <Label>E-posta Adresi</Label>
                   <Input defaultValue="destek@akbulut.com" />
                 </div>
              </div>
              <div className="space-y-2">
                <Label>Adres</Label>
                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" defaultValue="İstanbul, Türkiye" />
              </div>
              <div className="flex items-center space-x-2 pt-4">
                 <Switch id="maintenance" />
                 <Label htmlFor="maintenance">Bakım Modu</Label>
              </div>
              <Button className="mt-4">Değişiklikleri Kaydet</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
           <Card>
             <CardHeader>
               <CardTitle>Bildirim Tercihleri</CardTitle>
               <CardDescription>Hangi durumlarda haberdar olmak istediğinizi seçin.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                {[
                  { title: "Yeni Sipariş", desc: "Yeni bir sipariş geldiğinde anlık bildirim al." },
                  { title: "Düşük Stok", desc: "Bir ürünün stoğu kritik seviyeye indiğinde uyar." },
                  { title: "İptal Talebi", desc: "Müşteri iptal talebi oluşturduğunda e-posta al." },
                  { title: "Sistem Güncellemeleri", desc: "Yeni özellikler ve güncellemeler hakkında bilgi al." },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                     </div>
                     <Switch defaultChecked={i < 2} />
                  </div>
                ))}
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
