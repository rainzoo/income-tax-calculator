import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography } from '@mui/material';
import Header from './components/Header';
import SalaryInputForm from './components/SalaryInputForm';
import TaxResults from './components/TaxResults';
import MonthWiseBreakdown from './components/MonthWiseBreakdown';
import ComparisonTable from './components/ComparisonTable';
import { calculateAnnualSummary, calculateMonthlyBreakdown } from './utils/taxCalculator';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Results Section - Show first if calculated */}
          {summary && (
            <Box mb={4}>
              <TaxResults summary={summary} />
              <ComparisonTable summary={summary} />
              <MonthWiseBreakdown monthlyData={monthlyData} />
            </Box>
          )}

          {/* Input Form */}
          <SalaryInputForm onCalculate={handleCalculate} />

          {/* Footer */}
          <Box component="footer" mt={6} textAlign="center">
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Disclaimer:</strong> This calculator provides an estimate based on FY 2025-26 tax rules.
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                For accurate tax filing, please consult with a qualified tax advisor or chartered accountant.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Tax calculations include surcharge and Health & Education Cess (4%) where applicable.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
