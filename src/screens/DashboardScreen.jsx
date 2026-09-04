import React from 'react';
import RateCard from '../components/dashboard/RateCard';
import RateSummary from '../components/dashboard/RateSummary';
import WaveChart from '../components/dashboard/WaveChart';
import AreaChartWidget from '../components/dashboard/AreaChartWidget';

/**
 * Pantalla Principal: Monitor de Mercado "Al Cambio"
 */
export function DashboardScreen({
  rates,
  loading,
  onNavigateToConverter,
  onRefresh,
}) {
  const bcvUsd = rates?.bcvUsd || {};
  const bcvEur = rates?.bcvEur || {};
  const usdt = rates?.usdt || {};
  const paralelo = rates?.paralelo || {};

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Tasas de Cambio Venezuela - Al Cambio',
        text: `Dólar BCV: ${bcvUsd.price?.toFixed(2)} Bs | Euro BCV: ${bcvEur.price?.toFixed(2)} Bs | USDT: ${usdt.price?.toFixed(2)} Bs | Paralelo: ${paralelo.price?.toFixed(2)} Bs`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `Al Cambio:\nDólar BCV: ${bcvUsd.price?.toFixed(2)} Bs.\nEuro BCV: ${bcvEur.price?.toFixed(2)} Bs.\nUSDT P2P: ${usdt.price?.toFixed(2)} Bs.\nParalelo: ${paralelo.price?.toFixed(2)} Bs.`
      );
      alert('¡Tasas copiadas al portapapeles!');
    }
  };

  const handleDownload = () => {
    const content = `REPORTE AL CAMBIO - ${new Date().toLocaleDateString()}\n====================================\nDólar BCV: ${bcvUsd.price} VES\nEuro BCV: ${bcvEur.price} VES\nUSDT P2P: ${usdt.price} VES\nParalelo: ${paralelo.price} VES\nFuente: BCV, Binance y Mercado`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte-Al-Cambio-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid max-width-xl pb-5">
      {/* 1. Fila de Tarjetas Principales de Tasas (BCV USD, BCV Euro, USDT P2P, Paralelo) */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <RateCard
            title={bcvUsd.title || 'Dólar BCV'}
            subtitle={bcvUsd.subtitle || 'Tasa Oficial'}
            price={bcvUsd.price || 36.62}
            change={bcvUsd.change || 0.15}
            symbol="USD"
            icon="bi-currency-dollar"
            lastUpdate={bcvUsd.lastUpdate}
            onSelectForConvert={() => onNavigateToConverter('USD_BCV')}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <RateCard
            title={bcvEur.title || 'Euro BCV'}
            subtitle={bcvEur.subtitle || 'Tasa Oficial en Euros'}
            price={bcvEur.price || 39.84}
            change={bcvEur.change || 0.28}
            symbol="EUR"
            icon="bi-currency-euro"
            lastUpdate={bcvEur.lastUpdate}
            onSelectForConvert={() => onNavigateToConverter('EUR_BCV')}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <RateCard
            title={usdt.title || 'USDT P2P'}
            subtitle={usdt.subtitle || 'Tether / Binance Cripto'}
            price={usdt.price || 40.50}
            change={usdt.change || 0.18}
            symbol="USDT"
            icon="bi-coin"
            lastUpdate={usdt.lastUpdate}
            onSelectForConvert={() => onNavigateToConverter('USDT')}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <RateCard
            title={paralelo.title || 'Paralelo'}
            subtitle={paralelo.subtitle || 'Promedio Mercado'}
            price={paralelo.price || 40.25}
            change={paralelo.change || -0.45}
            symbol="USD"
            icon="bi-graph-up"
            lastUpdate={paralelo.lastUpdate}
            onSelectForConvert={() => onNavigateToConverter('USD_PAR')}
          />
        </div>
      </div>

      {/* 2. Fila Central: Resumen de Mercado con Medidor Circular */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12">
          <RateSummary
            rates={rates}
            onShare={handleShare}
            onDownload={handleDownload}
          />
        </div>
      </div>

      {/* 3. Fila de Gráficas de Ondas y Montañas según el diseño de referencia */}
      <div className="row g-3 g-md-4">
        <div className="col-12 col-lg-5">
          <WaveChart
            title="Tendencia BCV (Últimos 7 días)"
            change="+0.85%"
            points={[36.40, 36.45, 36.50, 36.55, 36.58, 36.62, 36.62]}
            className="h-100"
          />
        </div>

        <div className="col-12 col-lg-7">
          <AreaChartWidget
            mainValue={`${bcvEur.price?.toFixed(2) || '39.84'} Bs.`}
            title="EVOLUCIÓN MENSUAL EURO BCV"
            subtitle="Comportamiento histórico y variación relativa"
            className="h-100"
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
