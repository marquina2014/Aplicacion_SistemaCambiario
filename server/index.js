import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  getAllRates,
  getBcvRates,
  getBinanceRates,
  syncRates,
} from './controllers/ratesController.js';
import { isSupabaseReady } from './services/supabaseService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Log de peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas API de Tasas
app.get('/api/rates', getAllRates);
app.get('/api/rates/bcv', getBcvRates);
app.get('/api/rates/binance', getBinanceRates);
app.post('/api/rates/sync', syncRates);

// Ruta de Salud del Servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'AlCambio Backend API',
    protocols: {
      httpsEnforced: true,
      httpClient: 'Native fetch (No Axios)',
    },
    services: {
      bcv: 'Active',
      binanceP2P: 'Active',
      supabase: isSupabaseReady ? 'Connected' : 'Pending .env configuration',
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor Backend "Al Cambio" activo en puerto ${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   - GET  http://localhost:${PORT}/api/rates`);
  console.log(`   - GET  http://localhost:${PORT}/api/rates/bcv`);
  console.log(`   - GET  http://localhost:${PORT}/api/rates/binance`);
  console.log(`   - POST http://localhost:${PORT}/api/rates/sync`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
