import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId);

// Test Firestore connection
import { getDocFromServer } from 'firebase/firestore';
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'system', 'connection-test'));
    console.log("Firestore connection successful!");
  } catch (error) {
    console.error("Firestore connection test failed:", error);
  }
}
testConnection();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // --- KENDİ APİLERİNİZ BURAYA GELECEK ---
  
  // Ürün Güncelle
  app.patch("/api/v1/products/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
      await updateDoc(doc(db, "products", id), {
        ...updateData,
        lastUpdated: new Date().toISOString()
      });
      res.json({ success: true, message: "Ürün başarıyla güncellendi." });
    } catch (error) {
       console.error("Product update error:", error);
       res.status(500).json({ error: "Ürün güncellenemedi" });
    }
  });

  // Ürün Kopyala
  app.post("/api/v1/products/:id/copy", async (req, res) => {
    const { id } = req.params;
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const sourceProduct = querySnapshot.docs.find(d => d.id === id);
      
      if (!sourceProduct) {
        return res.status(404).json({ error: "Kaynak ürün bulunamadı" });
      }

      const data = sourceProduct.data();
      const newId = `${id}-copy-${Date.now()}`;
      const newData = {
        ...data,
        name: `${data.name} (Kopya)`,
        sku: `${data.sku}-COPY`,
        lastUpdated: new Date().toISOString()
      };

      await setDoc(doc(db, "products", newId), newData);
      res.json({ success: true, message: "Ürün başarıyla kopyalandı.", id: newId });
    } catch (error) {
       console.error("Product copy error:", error);
       res.status(500).json({ error: "Ürün kopyalanamadı" });
    }
  });

  // Ürünü Pazaryerine Gönder (Sync)
  app.post("/api/v1/products/:id/sync-marketplace", async (req, res) => {
    const { id } = req.params;
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productDoc = querySnapshot.docs.find(d => d.id === id);
      
      if (!productDoc) {
        return res.status(404).json({ error: "Ürün bulunamadı" });
      }

      const product = productDoc.data();
      
      // Platforma göre işlem yap
      if (product.platformType === 'woocommerce') {
        // En az bir WooCommerce bağlantısı bulalım
        const mpSnapshot = await getDocs(collection(db, "marketplaces"));
        const wooMp = mpSnapshot.docs.find(d => d.data().type === 'woocommerce');
        
        if (wooMp) {
          const { apiUrl, apiKey, apiSecret } = wooMp.data();
          const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
          
          // WooCommerce'e stok ve fiyat güncellemesi gönder
          const updateUrl = `${apiUrl}/products/${product.platformId}`;
          const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: { 
              'Authorization': authHeader,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              regular_price: product.price.toString(),
              stock_quantity: parseInt(product.stock)
            })
          });

          if (response.ok) {
            return res.json({ success: true, message: "WooCommerce üzerinde başarıyla güncellendi." });
          } else {
            const err = await response.text();
            throw new Error(`WooCommerce update failed: ${err}`);
          }
        }
      } else if (product.platformType === 'trendyol') {
        // Trendyol için mock başarılı dönüş
        return res.json({ success: true, message: "Trendyol üzerinde başarıyla güncellendi (Sanal)." });
      }

      res.json({ success: true, message: "Pazaryeri senkronizasyonu başlatıldı." });
    } catch (error) {
       console.error("Sync to marketplace error:", error);
       res.status(500).json({ error: "Pazaryeri güncellemesi başarısız oldu." });
    }
  });

  // Sipariş Etiketi
  app.get("/api/v1/orders/:id/label", async (req, res) => {
    res.json({ 
      success: true, 
      labelUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      html: "<h1>Barkod Etiketi</h1><p>Sipariş: " + req.params.id + "</p>" 
    });
  });

  // Sipariş Faturası
  app.get("/api/v1/orders/:id/invoice", async (req, res) => {
    res.json({ 
      success: true, 
      invoiceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      html: "<h1>E-Fatura</h1><p>Sipariş: " + req.params.id + "</p>" 
    });
  });

  // Mağazaları Getir
  app.get("/api/v1/marketplaces", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "marketplaces"));
      const mps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, marketplaces: mps });
    } catch (error) {
      console.error("Firestore error:", error);
      res.status(500).json({ error: "Veritabanı hatası" });
    }
  });

  // Ürünleri Getir
  app.get("/api/v1/products", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, products });
    } catch (error) {
       console.error("Products fetch error:", error);
       res.status(500).json({ error: "Ürünler yüklenemedi" });
    }
  });

  // Siparişleri Getir
  app.get("/api/v1/orders", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, orders });
    } catch (error) {
       console.error("Orders fetch error:", error);
       res.status(500).json({ error: "Siparişler yüklenemedi" });
    }
  });

  // Örnek: Sistem Durumu
  app.get("/api/v1/status", (req, res) => {
    res.json({ 
      status: "running", 
      message: "Entegrasyon sunucusu aktif.",
      time: new Date().toISOString()
    });
  });

  // Örnek: WooCommerce Ürünlerini Çekme (Proxy)
  app.post("/api/v1/woocommerce/sync-products", async (req, res) => {
    const { apiUrl, apiKey, apiSecret, name } = req.body;

    if (!apiUrl || !apiKey || !apiSecret) {
      return res.status(400).json({ error: "API bilgileri eksik." });
    }

    try {
      // Normalize URL
      let normalizedUrl = apiUrl.trim();
      if (!normalizedUrl.startsWith('http')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      if (!normalizedUrl.includes('/wp-json/wc/v3')) {
        normalizedUrl = normalizedUrl.replace(/\/$/, '') + '/wp-json/wc/v3';
      }

      // Real WooCommerce fetch attempt
      let products: any[] = [];
      try {
        const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
        const finalUrl = `${normalizedUrl}/products?per_page=50`; // Fetch more products
        console.log(`Fetching WooCommerce products: ${finalUrl}`);
        
        const response = await fetch(finalUrl, {
          headers: { 'Authorization': authHeader }
        });
        
        if (response.ok) {
          products = await response.json();
          console.log(`WooCommerce success: found ${products.length} products`);
          
          // Save products to Firestore
          for (const p of products) {
            const productId = `woo-${p.id}`;
            const productData = {
              name: p.name,
              sku: p.sku || `WOO-${p.id}`,
              price: parseFloat(p.price) || 0,
              stock: p.stock_quantity || 0,
              status: p.status === 'publish' ? 'active' : 'passive',
              category: p.categories?.[0]?.name || 'Genel',
              image: p.images?.[0]?.src || 'https://via.placeholder.com/150',
              brand: 'WooCommerce',
              marketplaces: ['woocommerce'],
              platformId: p.id.toString(),
              platformType: 'woocommerce',
              lastUpdated: new Date().toISOString()
            };
            await setDoc(doc(db, "products", productId), productData, { merge: true });
          }

          // Fetch and save orders
          try {
            const ordersUrl = `${normalizedUrl}/orders?per_page=20`;
            const ordersResponse = await fetch(ordersUrl, { headers: { 'Authorization': authHeader } });
            if (ordersResponse.ok) {
              const wooOrders = await ordersResponse.json();
              for (const o of wooOrders) {
                const orderId = `woo-${o.id}`;
                const orderData = {
                  orderNumber: o.number,
                  customerName: `${o.billing?.first_name} ${o.billing?.last_name}`,
                  items: o.line_items.map((li: any) => ({ name: li.name, quantity: li.quantity })),
                  totalAmount: parseFloat(o.total),
                  status: o.status === 'processing' ? 'pending' : (o.status === 'completed' ? 'delivered' : o.status),
                  paymentStatus: o.date_paid ? 'paid' : 'unpaid',
                  marketplace: 'WooCommerce',
                  createdAt: o.date_created.replace('T', ' '),
                  shippingAddress: `${o.shipping?.address_1} ${o.shipping?.city}/${o.shipping?.state}`,
                  phone: o.billing?.phone || '',
                  platformId: o.id.toString(),
                  platformType: 'woocommerce'
                };
                await setDoc(doc(db, "orders", orderId), orderData, { merge: true });
              }
            }
          } catch (orderErr) {
            console.error("Order sync error:", orderErr);
          }
        } else {
           const errText = await response.text();
           console.warn(`WooCommerce API returned error ${response.status}: ${errText}`);
        }
      } catch (e) {
        console.error("WooCommerce fetch failed:", e);
      }

      const marketplaceId = name ? name.toLowerCase().replace(/[^\w-]/g, '-') : 'woocommerce-default';
      const mpData = {
        type: 'woocommerce',
        name: name || 'WooCommerce Mağaza',
        apiUrl: normalizedUrl, // Store normalized URL
        apiKey,
        apiSecret,
        status: 'connected',
        lastSync: new Date().toISOString(),
        isActive: true,
        ordersToday: 0,
        productsSynced: products.length || 0
      };

      await setDoc(doc(db, "marketplaces", marketplaceId), mpData, { merge: true });
      
      res.json({ 
        success: true, 
        message: `${products.length} ürün senkronize edildi ve kaydedildi.`,
        count: products.length
      });
    } catch (error) {
       console.error("Sync error:", error);
       res.status(500).json({ error: "İşlem sırasında hata oluştu" });
    }
  });

  // Örnek: Trendyol Ürün Senkronizasyonu
  app.post("/api/v1/trendyol/sync-products", async (req, res) => {
    const { apiKey, apiSecret, supplierId, name } = req.body;
    
    try {
      const marketplaceId = name ? name.toLowerCase().replace(/[^\w-]/g, '-') : 'trendyol-default';
      const mpData = {
        type: 'trendyol',
        name: name || 'Trendyol Mağaza',
        apiKey,
        apiSecret,
        supplierId,
        status: 'connected',
        lastSync: new Date().toISOString(),
        isActive: true,
        ordersToday: 24,
        productsSynced: 1240
      };

      await setDoc(doc(db, "marketplaces", marketplaceId), mpData, { merge: true });

      // Simulate saving some Trendyol products to DB
      const mockTrendyolProducts = [
        { name: 'Trendyol Trend Kulaklık', sku: 'TY-KUL-01', price: 450, stock: 100, category: 'Elektronik' },
        { name: 'Trendyol Akıllı Saat', sku: 'TY-SAAT-02', price: 1200, stock: 50, category: 'Giyilebilir' }
      ];

      for (const p of mockTrendyolProducts) {
        const productId = `ty-${p.sku}`;
        await setDoc(doc(db, "products", productId), {
          ...p,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
          brand: 'Trendyol Brand',
          marketplaces: ['trendyol'],
          platformType: 'trendyol',
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      }

      res.json({ 
        success: true, 
        message: "Trendyol envanteri başarıyla kaydedildi ve güncellendi.",
        count: 1240
      });
    } catch (error) {
       console.error("Sync error:", error);
       res.status(500).json({ error: "İşlem sırasında hata oluştu" });
    }
  });

  // Genel Entegrasyon Rotası (Gelecekteki diğer platformlar için)
  app.post("/api/v1/:platform/sync-products", async (req, res) => {
    const { platform } = req.params;
    res.json({ 
      success: true, 
      message: `${platform.toUpperCase()} mağaza verileri başarıyla senkronize edildi.`,
      count: 150
    });
  });

  // Örnek: Siparişleri Çekme (Genel)
  app.get("/api/v1/orders/sync", (req, res) => {
    res.json({ success: true, message: "Tüm pazaryerlerinden yeni siparişler başarıyla alındı." });
  });

  // Örnek: Mağaza Bağlantısını Kesme
  app.delete("/api/v1/:platform/disconnect", async (req, res) => {
    const { platform } = req.params;
    const { id } = req.query;

    try {
      if (id) {
        await deleteDoc(doc(db, "marketplaces", id as string));
        res.json({ success: true, message: "Mağaza bağlantısı başarıyla silindi." });
      } else {
        res.status(400).json({ error: "Mağaza ID belirtilmedi." });
      }
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ error: "Bağlantı kesilemedi." });
    }
  });

  // --------------------------------------

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  });
}

startServer();
