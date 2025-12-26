import { Paper, Typography } from '@mui/material';

export default function TaxResults({ summary }) {
  if (!summary) return null;

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isNewRegimeBetter = summary.recommendedRegime === 'new';
  const savings = Math.abs(summary.savings);

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        Annual Tax Summary
      </Typography>
      
      {/* RSU Summary */}
      {summary.rsu && summary.rsu.grossRSU > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">RSU Income Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Gross RSU Value</p>
              <p className="text-lg font-bold">{formatCurrency(summary.rsu.grossRSU)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">US Tax Withheld</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(summary.rsu.usTaxWithheld)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Net RSU Received</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(summary.rsu.netRSU)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">DTAA Credit</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(summary.rsu.dtaaCredit)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            DTAA credit reduces your Indian tax liability by the amount of US taxes paid on RSU income.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Old Regime Card */}
        <div className={`border-2 rounded-lg p-5 ${!isNewRegimeBetter ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Old Regime</h3>
            {!isNewRegimeBetter && (
              <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Recommended
              </span>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Salary:</span>
              <span className="font-semibold">{formatCurrency(summary.grossSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deductions:</span>
              <span className="font-semibold text-green-600">
                -{formatCurrency(summary.oldRegime.deductions)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxable Income:</span>
              <span className="font-semibold">{formatCurrency(summary.oldRegime.taxableIncome)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Income Tax:</span>
                <span>{formatCurrency(summary.oldRegime.tax)}</span>
              </div>
              {summary.oldRegime.surcharge > 0 && (
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Surcharge:</span>
                  <span>{formatCurrency(summary.oldRegime.surcharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Cess (4%):</span>
                <span>{formatCurrency(summary.oldRegime.cess)}</span>
              </div>
              {summary.oldRegime.dtaaCredit > 0 && (
                <div className="flex justify-between text-sm text-blue-600 mb-2">
                  <span>DTAA Credit (US Tax):</span>
                  <span>-{formatCurrency(summary.oldRegime.dtaaCredit)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                <span>Total Tax:</span>
                <span className="text-red-600">{formatCurrency(summary.oldRegime.totalTax)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t">
              <span>Net Salary:</span>
              <span className="text-green-600">{formatCurrency(summary.oldRegime.netSalary)}</span>
            </div>
          </div>
        </div>

        {/* New Regime Card */}
        <div className={`border-2 rounded-lg p-5 ${isNewRegimeBetter ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">New Regime</h3>
            {isNewRegimeBetter && (
              <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Recommended
              </span>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Salary:</span>
              <span className="font-semibold">{formatCurrency(summary.grossSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Standard Deduction:</span>
              <span className="font-semibold text-green-600">
                -{formatCurrency(summary.newRegime.deductions)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxable Income:</span>
              <span className="font-semibold">{formatCurrency(summary.newRegime.taxableIncome)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Income Tax:</span>
                <span>{formatCurrency(summary.newRegime.tax + summary.newRegime.rebate)}</span>
              </div>
              {summary.newRegime.rebate > 0 && (
                <div className="flex justify-between text-sm text-green-600 mb-1">
                  <span>Section 87A Rebate:</span>
                  <span>-{formatCurrency(summary.newRegime.rebate)}</span>
                </div>
              )}
              {summary.newRegime.surcharge > 0 && (
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Surcharge:</span>
                  <span>{formatCurrency(summary.newRegime.surcharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Cess (4%):</span>
                <span>{formatCurrency(summary.newRegime.cess)}</span>
              </div>
              {summary.newRegime.dtaaCredit > 0 && (
                <div className="flex justify-between text-sm text-blue-600 mb-2">
                  <span>DTAA Credit (US Tax):</span>
                  <span>-{formatCurrency(summary.newRegime.dtaaCredit)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                <span>Total Tax:</span>
                <span className="text-red-600">{formatCurrency(summary.newRegime.totalTax)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t">
              <span>Net Salary:</span>
              <span className="text-green-600">{formatCurrency(summary.newRegime.netSalary)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Comparison */}
      <div className={`rounded-lg p-5 text-center ${
        isNewRegimeBetter 
          ? 'bg-green-100 border-2 border-green-500' 
          : 'bg-blue-100 border-2 border-blue-500'
      }`}>
        <div className="text-sm text-gray-700 mb-2">
          {isNewRegimeBetter ? 'You save' : 'You pay more'} with New Regime:
        </div>
        <div className={`text-3xl font-bold ${
          isNewRegimeBetter ? 'text-green-700' : 'text-red-700'
        }`}>
          {isNewRegimeBetter ? '+' : '-'}{formatCurrency(savings)}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {isNewRegimeBetter 
            ? 'New Regime is more beneficial for you'
            : 'Old Regime is more beneficial for you'}
        </div>
      </div>
    </Paper>
  );
}
