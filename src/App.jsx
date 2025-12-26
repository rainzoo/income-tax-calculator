import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography, Paper } from '@mui/material';
import Header from './components/Header';
import SalaryInputForm from './components/SalaryInputForm';
import TaxResults from './components/TaxResults';
import MonthWiseBreakdown from './components/MonthWiseBreakdown';
import ComparisonTable from './components/ComparisonTable';
import RegimeSelector from './components/RegimeSelector';
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
  const [selectedRegime, setSelectedRegime] = useState('old');
  const [salaryData, setSalaryData] = useState(null);

  const handleCalculate = (data) => {
    const annualSummary = calculateAnnualSummary(data);
    const monthlyBreakdown = calculateMonthlyBreakdown(data);

    setSummary(annualSummary);
    setMonthlyData(monthlyBreakdown);
    setSalaryData(data);

    // Scroll to results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Left Column: Input Form */}
            <Box sx={{ flex: '1 1 40%' }}>
              <SalaryInputForm onCalculate={handleCalculate} />
            </Box>

            {/* Right Column: Results */}
            <Box sx={{ flex: '1 1 60%' }}>
              {summary ? (
                <>
                  <TaxResults summary={summary} />
                  <ComparisonTable summary={summary} />
                  <RegimeSelector regime={selectedRegime} onChange={setSelectedRegime} />
                  <MonthWiseBreakdown
                    monthlyData={monthlyData}
                    selectedRegime={selectedRegime}
                    salaryData={salaryData}
                  />
                </>
              ) : (
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center', height: '100%' }}>
                  <Typography variant="h6" color="text.secondary">
                    Results will be displayed here
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>

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