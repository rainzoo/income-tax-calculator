import { useState } from 'react';

export default function SalaryInputForm({ onCalculate }) {
  const [formData, setFormData] = useState({
    basicSalary: '',
    hra: '',
    specialAllowance: '',
    lta: '',
    medicalAllowance: '',
    otherAllowances: '',
    rentPaid: '',
    isMetroCity: false,
    section80C: '',
    section80D: '',
    section24B: '',
    otherDeductions: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const salaryData = {
      basicSalary: parseFloat(formData.basicSalary) || 0,
      hra: parseFloat(formData.hra) || 0,
      specialAllowance: parseFloat(formData.specialAllowance) || 0,
      lta: parseFloat(formData.lta) || 0,
      medicalAllowance: parseFloat(formData.medicalAllowance) || 0,
      otherAllowances: parseFloat(formData.otherAllowances) || 0,
      rentPaid: parseFloat(formData.rentPaid) || 0,
      isMetroCity: formData.isMetroCity,
      section80C: parseFloat(formData.section80C) || 0,
      section80D: parseFloat(formData.section80D) || 0,
      section24B: parseFloat(formData.section24B) || 0,
      otherDeductions: parseFloat(formData.otherDeductions) || 0,
    };
    onCalculate(salaryData);
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Salary Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary Components */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary Components</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basic Salary (Annual) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter basic salary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              House Rent Allowance (HRA)
            </label>
            <input
              type="number"
              name="hra"
              value={formData.hra}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter HRA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Allowance
            </label>
            <input
              type="number"
              name="specialAllowance"
              value={formData.specialAllowance}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter special allowance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Travel Allowance (LTA)
            </label>
            <input
              type="number"
              name="lta"
              value={formData.lta}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter LTA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Allowance
            </label>
            <input
              type="number"
              name="medicalAllowance"
              value={formData.medicalAllowance}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter medical allowance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other Allowances
            </label>
            <input
              type="number"
              name="otherAllowances"
              value={formData.otherAllowances}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter other allowances"
            />
          </div>

          {/* HRA Details */}
          {(formData.hra && parseFloat(formData.hra) > 0) && (
            <>
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">HRA Exemption Details</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rent Paid (Annual)
                </label>
                <input
                  type="number"
                  name="rentPaid"
                  value={formData.rentPaid}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter annual rent paid"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isMetroCity"
                  checked={formData.isMetroCity}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Metro City (Delhi, Mumbai, Chennai, Kolkata)
                </label>
              </div>
            </>
          )}

          {/* Deductions */}
          <div className="md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Deductions (Old Regime Only)</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section 80C (Max ₹1,50,000)
              <span className="text-xs text-gray-500 block">EPF, PPF, ELSS, etc.</span>
            </label>
            <input
              type="number"
              name="section80C"
              value={formData.section80C}
              onChange={handleChange}
              max="150000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter 80C deductions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section 80D (Health Insurance)
              <span className="text-xs text-gray-500 block">Self/Family: ₹25K, Parents: ₹50K</span>
            </label>
            <input
              type="number"
              name="section80D"
              value={formData.section80D}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter 80D deductions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section 24(b) - Home Loan Interest
              <span className="text-xs text-gray-500 block">Max ₹2,00,000</span>
            </label>
            <input
              type="number"
              name="section24B"
              value={formData.section24B}
              onChange={handleChange}
              max="200000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter home loan interest"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other Deductions
              <span className="text-xs text-gray-500 block">80G, 80TTA, etc.</span>
            </label>
            <input
              type="number"
              name="otherDeductions"
              value={formData.otherDeductions}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter other deductions"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Calculate Tax
          </button>
        </div>
      </form>
    </div>
  );
}

