export default function MonthWiseBreakdown({ monthlyData }) {
  if (!monthlyData || monthlyData.length === 0) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Month-wise Breakdown</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                Month
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Gross Salary
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Cumulative Gross
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider bg-red-50">
                Tax (Old)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider bg-red-50">
                Cumulative Tax (Old)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-50">
                Tax (New)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-50">
                Cumulative Tax (New)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider bg-green-50">
                Net Salary (Old)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider bg-green-50">
                Net Salary (New)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyData.map((month, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-inherit z-10">
                  {month.month}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                  {formatCurrency(month.grossSalary)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right font-semibold">
                  {formatCurrency(month.cumulativeGrossSalary)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 text-right bg-red-50">
                  {formatCurrency(month.monthlyOldTax)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 text-right bg-red-50 font-semibold">
                  {formatCurrency(month.cumulativeOldTax)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 text-right bg-blue-50">
                  {formatCurrency(month.monthlyNewTax)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 text-right bg-blue-50 font-semibold">
                  {formatCurrency(month.cumulativeNewTax)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 text-right bg-green-50">
                  {formatCurrency(month.netSalaryOld)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 text-right bg-green-50">
                  {formatCurrency(month.netSalaryNew)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr className="font-bold">
              <td className="px-4 py-3 text-sm text-gray-900 sticky left-0 bg-gray-100 z-10">
                Total (Annual)
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-right">
                {formatCurrency(monthlyData[monthlyData.length - 1].cumulativeGrossSalary)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-right">
                {formatCurrency(monthlyData[monthlyData.length - 1].cumulativeGrossSalary)}
              </td>
              <td className="px-4 py-3 text-sm text-red-700 text-right bg-red-100">
                {formatCurrency(monthlyData[monthlyData.length - 1].cumulativeOldTax / monthlyData.length)}
              </td>
              <td className="px-4 py-3 text-sm text-red-700 text-right bg-red-100">
                {formatCurrency(monthlyData[monthlyData.length - 1].cumulativeOldTax)}
              </td>
              <td className="px-4 py-3 text-sm text-blue-700 text-right bg-blue-100">
                {formatCurrency(monthlyData[monthlyData.length - 1].cumulativeNewTax / monthlyData.length)}
              </td>
              <td className="px-4 py-3 text-sm text-blue-700 text-right bg-blue-100">
                {formatCurrency(monthlyData[monthlyData.length - 1].cumulativeNewTax)}
              </td>
              <td className="px-4 py-3 text-sm text-green-700 text-right bg-green-100">
                {formatCurrency(monthlyData[monthlyData.length - 1].cumulativeGrossSalary - monthlyData[monthlyData.length - 1].cumulativeOldTax)}
              </td>
              <td className="px-4 py-3 text-sm text-green-700 text-right bg-green-100">
                {formatCurrency(monthlyData[monthlyData.length - 1].cumulativeGrossSalary - monthlyData[monthlyData.length - 1].cumulativeNewTax)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-2"><strong>Note:</strong> Tax is calculated on an annual basis and distributed evenly across 12 months.</p>
        <p>Cumulative values show the running total from April to the respective month.</p>
      </div>
    </div>
  );
}

