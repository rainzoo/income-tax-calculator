import { useState } from 'react';
import SalaryInputForm from './components/SalaryInputForm';
import TaxResults from './components/TaxResults';
import MonthWiseBreakdown from './components/MonthWiseBreakdown';
import ComparisonTable from './components/ComparisonTable';
import { calculateAnnualSummary, calculateMonthlyBreakdown } from './utils/taxCalculator';

function App() {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);

  const handleCalculate = (salaryData) => {
    const annualSummary = calculateAnnualSummary(salaryData);
    const monthlyBreakdown = calculateMonthlyBreakdown(salaryData);

    setSummary(annualSummary);
    setMonthlyData(monthlyBreakdown);

    // Scroll to results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Indian Income Tax Calculator
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Calculate your income tax for FY 2025-26
          </p>
          <p className="text-sm text-gray-500">
            Compare Old vs New Tax Regime | Month-wise Breakdown | Annual Projection
          </p>
        </header>

        {/* Results Section - Show first if calculated */}
        {summary && (
          <div className="mb-8">
            <TaxResults summary={summary} />
            <ComparisonTable summary={summary} />
            <MonthWiseBreakdown monthlyData={monthlyData} />
          </div>
        )}

        {/* Input Form */}
        <SalaryInputForm onCalculate={handleCalculate} />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-600">
          <p className="mb-2">
            <strong>Disclaimer:</strong> This calculator provides an estimate based on FY 2025-26 tax rules.
          </p>
          <p>
            For accurate tax filing, please consult with a qualified tax advisor or chartered accountant.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Tax calculations include surcharge and Health & Education Cess (4%) where applicable.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
