import React, { useState } from 'react';
import NeumorphicCard from '../components/common/NeumorphicCard';
import TimelineSlider from '../components/common/TimelineSlider';
import AreaChartWidget from '../components/dashboard/AreaChartWidget';
import WaveChart from '../components/dashboard/WaveChart';
import { isSupabaseConfigured } from '../functions/services/supabaseClient';

const YEARS = ['2021', '2022', '2023', '2024', '2025', '2026'];

/**
 * Pantalla de Historial y Estadísticas
 */
export function HistoricalScreen({ rates = {} }) {
  const [selectedYearIndex, setSelectedYearIndex] = useState(5); // 2026

  const bcvEur = rates?.bcvEur?.price || 39.84;
  const bcvUsd = rates?.bcvUsd?.price || 36.62;

  return (
    <div className="container-fluid max-width-xl pb-5">
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-dark">Historial y Tendencias</h4>
          <span className="text-secondary small">
            Comportamiento de las cotizaciones oficiales del BCV y Euro
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted d-none d-sm-inline">Base de datos:</span>
          <span className={`badge rounded-pill ${isSupabaseConfigured ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} px-3 py-2 fw-semibold`}>
            <i className={`bi ${isSupabaseConfigured ? 'bi-database-check' : 'bi-database-dash'} me-1`}></i>
            {isSupabaseConfigured ? 'Supabase Conectado' : 'Modo Local'}
          </span>
        </div>
      </div>

      {/* Gráficas comparativas */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <AreaChartWidget
            mainValue={`${bcvEur.toFixed(2)} Bs.`}
            title={`TASA EURO BCV (${YEARS[selectedYearIndex]})`}
            subtitle="Curva de cotización y rango de variación interanual"
          />
        </div>

        <div className="col-12 col-lg-5 d-flex flex-column gap-3">
          <WaveChart
            title="Volatilidad Semanal Dólar BCV"
            change="+0.18%"
            points={[36.45, 36.48, 36.52, 36.55, 36.59, 36.62, 36.62]}
          />

          <NeumorphicCard className="p-4 flex-fill">
            <h6 className="fw-bold text-dark mb-3">Métricas Clave del Período</h6>
            <div className="row g-3 text-center">
              <div className="col-4">
                <div className="small text-muted">Mínimo</div>
                <div className="fw-bold fs-6 text-dark mt-1">{(bcvUsd * 0.95).toFixed(2)} Bs</div>
              </div>
              <div className="col-4">
                <div className="small text-muted">Promedio</div>
                <div className="fw-bold fs-6 text-primary mt-1">{bcvUsd.toFixed(2)} Bs</div>
              </div>
              <div className="col-4">
                <div className="small text-muted">Máximo</div>
                <div className="fw-bold fs-6 text-dark mt-1">{(bcvUsd * 1.05).toFixed(2)} Bs</div>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </div>

      {/* Slider de Años / Periodos (Fiel a la barra inferior de la imagen) */}
      <div className="mt-4">
        <div className="small text-secondary fw-bold text-uppercase mb-2">
          SELECCIÓN DE LÍNEA TEMPORAL
        </div>
        <TimelineSlider
          items={YEARS}
          selectedIndex={selectedYearIndex}
          onSelect={setSelectedYearIndex}
        />
      </div>
    </div>
  );
}

export default HistoricalScreen;
