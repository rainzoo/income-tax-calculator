# Indian Income Tax Calculator

A modern web application to calculate Indian Income Tax for FY 2025-26, with comparison between Old and New tax regimes, month-wise breakdown, and annual projections.

## Features

- **Comprehensive Salary Input**: Enter all salary components including Basic, HRA, Allowances, and Deductions
- **Dual Regime Comparison**: Compare Old vs New Tax Regime side-by-side
- **Month-wise Breakdown**: View tax deductions and net salary for each month
- **Annual Projection**: See total tax liability and net salary for the entire year
- **Smart Recommendations**: Automatically highlights the more beneficial regime
- **User-friendly Interface**: Modern, responsive design with Tailwind CSS

## Tax Rules (FY 2025-26)

### Old Regime
- Up to ₹2.5L: Nil
- ₹2.5L - ₹5L: 5%
- ₹5L - ₹10L: 20%
- Above ₹10L: 30%
- Allows deductions: 80C (₹1.5L), 80D, HRA exemption, Home loan interest, etc.

### New Regime
- Up to ₹4L: Nil
- ₹4L - ₹8L: 5%
- ₹8L - ₹12L: 10%
- ₹12L - ₹16L: 15%
- ₹16L - ₹20L: 20%
- ₹20L - ₹24L: 25%
- Above ₹24L: 30%
- Standard Deduction: ₹75,000
- Section 87A Rebate: Up to ₹25,000 for taxable income ≤ ₹12L

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. Enter your salary details in the form:
   - Basic Salary (required)
   - House Rent Allowance (HRA)
   - Special Allowances
   - Leave Travel Allowance (LTA)
   - Medical Allowance
   - Other Allowances
   - Deductions (for Old Regime): 80C, 80D, Home Loan Interest, etc.

2. If you have HRA, provide:
   - Annual rent paid
   - Check if you live in a metro city (Delhi, Mumbai, Chennai, Kolkata)

3. Click "Calculate Tax" to see:
   - Annual tax summary for both regimes
   - Side-by-side comparison
   - Month-wise breakdown
   - Recommended regime based on your inputs

## Disclaimer

This calculator provides an estimate based on FY 2025-26 tax rules. For accurate tax filing, please consult with a qualified tax advisor or chartered accountant.

## Technology Stack

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **JavaScript**: Tax calculation logic

## Project Structure

```
src/
├── components/
│   ├── SalaryInputForm.jsx    # Input form for salary details
│   ├── TaxResults.jsx         # Annual tax summary display
│   ├── MonthWiseBreakdown.jsx # Month-by-month breakdown table
│   └── ComparisonTable.jsx    # Old vs New regime comparison
├── utils/
│   └── taxCalculator.js       # Core tax calculation functions
├── constants/
│   └── taxRules.js            # FY 2025-26 tax slabs and rules
├── App.jsx                     # Main application component
└── main.jsx                    # Application entry point
```

## License

MIT
