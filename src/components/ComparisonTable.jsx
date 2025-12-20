export default function ComparisonTable({ summary }) {
  if (!summary) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isNewRegimeBetter = summary.recommendedRegime === 'new';
  const savings = Math.abs(summary.savings);

  const comparisonData = [
    {
      label: 'Gross Salary',
      oldRegime: summary.grossSalary,
      newRegime: summary.grossSalary,
      difference: 0,
      highlight: false,
    },
    {
      label: 'Total Deductions',
      oldRegime: summary.oldRegime.deductions,
      newRegime: summary.newRegime.deductions,
      difference: summary.newRegime.deductions - summary.oldRegime.deductions,
      highlight: true,
    },
    {
      label: 'Taxable Income',
      oldRegime: summary.oldRegime.taxableIncome,
      newRegime: summary.newRegime.taxableIncome,
      difference: summary.newRegime.taxableIncome - summary.oldRegime.taxableIncome,
      highlight: true,
    },
    {
      label: 'Income Tax',
      oldRegime: summary.oldRegime.tax,
      newRegime: summary.newRegime.tax + summary.newRegime.rebate,
      difference: (summary.newRegime.tax + summary.newRegime.rebate) - summary.oldRegime.tax,
      highlight: true,
    },
    {
      label: 'Surcharge',
      oldRegime: summary.oldRegime.surcharge,
      newRegime: summary.newRegime.surcharge,
      difference: summary.newRegime.surcharge - summary.oldRegime.surcharge,
      highlight: false,
    },
    {
      label: 'Cess (4%)',
      oldRegime: summary.oldRegime.cess,
      newRegime: summary.newRegime.cess,
      difference: summary.newRegime.cess - summary.oldRegime.cess,
      highlight: false,
    },
    {
      label: 'Total Tax',
      oldRegime: summary.oldRegime.totalTax,
      newRegime: summary.newRegime.totalTax,
      difference: summary.savings,
      highlight: true,
      isTotal: true,
    },
    {
      label: 'Net Salary (After Tax)',
      oldRegime: summary.oldRegime.netSalary,
      newRegime: summary.newRegime.netSalary,
      difference: -summary.savings,
      highlight: true,
      isTotal: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Regime Comparison</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Component
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider bg-red-50">
                Old Regime
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-50">
                New Regime
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider bg-green-50">
                Difference
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparisonData.map((row, index) => {
              const isPositive = row.difference > 0;
              const isNegative = row.difference < 0;
              const isZero = row.difference === 0;
              
              return (
                <tr
                  key={index}
                  className={`${
                    row.isTotal
                      ? 'bg-gray-100 font-bold'
                      : index % 2 === 0
                      ? 'bg-white'
                      : 'bg-gray-50'
                  } ${row.highlight ? 'border-l-4 border-blue-500' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right bg-red-50">
                    {formatCurrency(row.oldRegime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right bg-blue-50">
                    {formatCurrency(row.newRegime)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold bg-green-50 ${
                      isZero
                        ? 'text-gray-600'
                        : isPositive
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {isZero
                      ? '—'
                      : `${isPositive ? '+' : ''}${formatCurrency(row.difference)}`}
                    {!isZero && row.isTotal && (
                      <span className="ml-2 text-xs">
                        ({isNewRegimeBetter ? 'Save' : 'Pay More'})
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <h3 className="font-semibold text-gray-800 mb-2">Key Insights:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>
            <strong>Old Regime</strong> allows multiple deductions (80C, 80D, HRA, etc.) but has lower exemption limit.
          </li>
          <li>
            <strong>New Regime</strong> offers ₹75,000 standard deduction and higher exemption limit (₹4L).
          </li>
          <li>
            {isNewRegimeBetter
              ? `You save ${formatCurrency(savings)} annually with the New Regime.`
              : `You save ${formatCurrency(savings)} annually with the Old Regime.`}
          </li>
          {summary.newRegime.rebate > 0 && (
            <li>
              <strong>Section 87A Rebate:</strong> Applied in New Regime as taxable income is below ₹12L.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

