import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  
  // Örnek: Sistem Durumu
  app.get("/api/v1/status", (req, res) => {
    res.json({ 
      status: "running", 
      message: "Entegrasyon sunucusu aktif.",
      time: new Date().toISOString()
    });
  });

  // Örnek: WooCommerce Ürünlerini Çekme (Proxy)
  // Bu rota, frontend'den gelen istekleri alır ve WooCommerce API'sine iletir
  app.post("/api/v1/woocommerce/sync-products", async (req, res) => {
    const { apiUrl, apiKey, apiSecret } = req.body;

    if (!apiUrl || !apiKey || !apiSecret) {
      return res.status(400).json({ error: "API bilgileri eksik." });
    }

    try {
      // Burada gerçek bir fetch isteği ile WooCommerce'e bağlanabilirsiniz
      // Örnek: const response = await fetch(`${apiUrl}/products?consumer_key=${apiKey}&consumer_secret=${apiSecret}`);
      
      console.log(`${apiUrl} adresindeki WooCommerce mağazasına bağlanılıyor...`);
      
      res.json({ 
        success: true, 
        message: "WooCommerce ürünleri başarıyla senkronize edildi.",
        count: 85 // Taklit veri
      });
    } catch (error) {
      res.status(500).json({ error: "WooCommerce bağlantı hatası: " + (error as Error).message });
    }
  });

  // Örnek: Trendyol Ürün Senkronizasyonu
  app.post("/api/v1/trendyol/sync-products", async (req, res) => {
    const { apiKey, apiSecret, supplierId } = req.body;
    
    // Trendyol API simülasyonu
    console.log("Trendyol Bağlantısı Kuruluyor...");
    
    res.json({ 
      success: true, 
      message: "Trendyol envanteri başarıyla güncellendi.",
      count: 1240
    });
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
  app.delete("/api/v1/:platform/disconnect", (req, res) => {
    const { platform } = req.params;
    res.json({ success: true, message: `${platform.toUpperCase()} bağlantısı başarıyla kesildi.` });
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
