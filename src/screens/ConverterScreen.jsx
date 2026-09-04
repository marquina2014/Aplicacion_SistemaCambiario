import React, { useState, useEffect } from 'react';
import NeumorphicCard from '../components/common/NeumorphicCard';
import NeumorphicInput from '../components/common/NeumorphicInput';
import NeumorphicSwitch from '../components/common/NeumorphicSwitch';
import CurrencySelector from '../components/converter/CurrencySelector';
import QuickChips from '../components/converter/QuickChips';
import ConversionResult from '../components/converter/ConversionResult';
import { convertCurrency, calculateIGTF } from '../functions/utils/calculations';

const POPULAR_PAIRS = [
  { label: 'EUR ➔ USDT', from: 'EUR_BCV', to: 'USDT' },
  { label: 'USDT ➔ USD BCV', from: 'USDT', to: 'USD_BCV' },
  { label: 'USD BCV ➔ USDT', from: 'USD_BCV', to: 'USDT' },
  { label: 'USD BCV ➔ EUR', from: 'USD_BCV', to: 'EUR_BCV' },
  { label: 'EUR ➔ USD BCV', from: 'EUR_BCV', to: 'USD_BCV' },
  { label: 'USDT ➔ Bs.', from: 'USDT', to: 'VES' },
];

/**
 * Pantalla de Calculadora y Conversor Universal de Divisas
 */
export function ConverterScreen({
  rates = {},
  initialCurrency = 'EUR_BCV',
}) {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState(
    initialCurrency === 'USD' ? 'USD_BCV' : initialCurrency === 'EUR' ? 'EUR_BCV' : initialCurrency
  );
  const [toCurrency, setToCurrency] = useState('USDT');
  const [applyIgtf, setApplyIgtf] = useState(false);
  const [convertedData, setConvertedData] = useState({ result: 0, crossRate: 1 });

  // Tasas numéricas actualizadas
  const availableRates = {
    bcvUsd: rates?.bcvUsd?.price || 36.62,
    bcvEur: rates?.bcvEur?.price || 39.84,
    usdt: rates?.usdt?.price || 40.50,
    paralelo: rates?.paralelo?.price || 40.25,
  };

  // Recalcular conversión universal
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const res = convertCurrency(numAmount, fromCurrency, toCurrency, availableRates);
    setConvertedData(res);
  }, [amount, fromCurrency, toCurrency, rates]);

  // Intercambiar divisas de origen y destino
  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleFromChange = (newFrom) => {
    if (newFrom === toCurrency) {
      setToCurrency(fromCurrency);
    }
    setFromCurrency(newFrom);
  };

  const handleToChange = (newTo) => {
    if (newTo === fromCurrency) {
      setFromCurrency(toCurrency);
    }
    setToCurrency(newTo);
  };

  const handleSelectPair = (pair) => {
    setFromCurrency(pair.from);
    setToCurrency(pair.to);
  };

  const igtfDetails = calculateIGTF(convertedData.result, 3);

  return (
    <div className="container-fluid max-width-lg pb-5">
      {/* Botones de atajos rápidos entre pares populares solicitados */}
      <div className="mb-4">
        <div className="small text-secondary fw-semibold mb-2">Conversiones Frecuentes:</div>
        <div className="d-flex flex-wrap gap-2">
          {POPULAR_PAIRS.map((pair) => {
            const isActive = fromCurrency === pair.from && toCurrency === pair.to;
            return (
              <button
                key={pair.label}
                type="button"
                onClick={() => handleSelectPair(pair)}
                className={`neu-chip py-1 px-3 ${isActive ? 'active' : ''}`}
                style={{ fontSize: '0.82rem' }}
              >
                {pair.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Columna de Formulario de Conversión */}
        <div className="col-12 col-lg-6">
          <NeumorphicCard className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold text-dark">Conversor Universal</h5>
              <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Multidivisa
              </span>
            </div>

            {/* Input de Monto */}
            <NeumorphicInput
              label="Monto a Convertir"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ingresa un monto..."
              iconLeft="bi-cash-stack"
              min="0"
              step="any"
            />

            {/* Chips de Montos Rápidos */}
            <div className="mb-4">
              <div className="small text-secondary fw-semibold mb-2">Denominaciones rápidas:</div>
              <QuickChips
                values={[5, 10, 20, 50, 100, 500]}
                currentAmount={amount}
                currency={fromCurrency}
                onSelect={(val) => setAmount(val.toString())}
              />
            </div>

            {/* Selectores de Monedas e Intercambio */}
            <div className="row g-2 align-items-end mb-3">
              <div className="col">
                <CurrencySelector
                  label="De (Origen)"
                  value={fromCurrency}
                  excludeCurrency={toCurrency}
                  onChange={handleFromChange}
                />
              </div>

              {/* Botón Swap Neumórfico */}
              <div className="col-auto mb-3 text-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Intercambiar divisas"
                  className="neu-btn p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px' }}
                >
                  <i className="bi bi-arrow-left-right text-primary"></i>
                </button>
              </div>

              <div className="col">
                <CurrencySelector
                  label="A (Destino)"
                  value={toCurrency}
                  excludeCurrency={fromCurrency}
                  onChange={handleToChange}
                />
              </div>
            </div>

            {/* Switch de IGTF */}
            <div className="pt-3 border-top border-light-subtle d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold small text-dark">Calcular IGTF (3%)</div>
                <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                  Aplica para pagos o cobros en moneda extranjera
                </div>
              </div>
              <NeumorphicSwitch
                checked={applyIgtf}
                onChange={setApplyIgtf}
              />
            </div>
          </NeumorphicCard>
        </div>

        {/* Columna de Resultado y Tabla de Tasas */}
        <div className="col-12 col-lg-6">
          <ConversionResult
            sourceAmount={parseFloat(amount) || 0}
            sourceCurrency={fromCurrency}
            resultAmount={convertedData.result}
            targetCurrency={toCurrency}
            crossRate={convertedData.crossRate}
            rateLabel="Tasa de Cambio"
            igtfApplied={applyIgtf}
            igtfData={igtfDetails}
          />

          {/* Tarjeta de referencia de tasas activas */}
          <NeumorphicCard className="mt-4 p-3">
            <div className="small fw-bold text-secondary text-uppercase mb-2">
              COTIZACIONES ACTIVAS EN TIEMPO REAL
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom border-light-subtle small">
              <span className="text-secondary">Dólar BCV Oficial</span>
              <span className="fw-bold">{availableRates.bcvUsd.toFixed(2)} Bs.</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom border-light-subtle small">
              <span className="text-secondary">Euro BCV Oficial</span>
              <span className="fw-bold text-primary">{availableRates.bcvEur.toFixed(2)} Bs.</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom border-light-subtle small">
              <span className="text-secondary">Tether USDT (P2P)</span>
              <span className="fw-bold text-success">{availableRates.usdt.toFixed(2)} Bs.</span>
            </div>
            <div className="d-flex justify-content-between py-2 small">
              <span className="text-secondary">Dólar Paralelo</span>
              <span className="fw-bold text-danger">{availableRates.paralelo.toFixed(2)} Bs.</span>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </div>
  );
}

export default ConverterScreen;
