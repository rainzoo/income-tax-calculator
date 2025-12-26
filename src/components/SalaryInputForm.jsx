import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  AccountBalance,
  Home,
  Receipt,
  TrendingUp,
} from '@mui/icons-material';

export default function SalaryInputForm({ onCalculate }) {
  const [formData, setFormData] = useState({
    basicSalary: '',
    hra: '',
    specialAllowance: '',
    lta: '',
    medicalAllowance: '',
    otherAllowances: '',
    perquisites: '',
    rentPaid: '',
    isMetroCity: false,
    autoCalculateHRA: false,
    section80C: '',
    section80D: '',
    section24B: '',
    otherDeductions: '',
    // RSU fields
    rsuSharesPerQuarter: '',
    rsuPricePerShare: '',
    rsuCurrency: 'INR',
    rsuExchangeRate: '83.00',
    rsuWithholdingRate: '22',
    rsuQuarterlyMonths: [],
  });

  const calculateHRA = (basicSalary, isMetroCity) => {
    if (!basicSalary || parseFloat(basicSalary) <= 0) return '';
    const basic = parseFloat(basicSalary);
    const hraPercentage = isMetroCity ? 0.5 : 0.4; // 50% for metro, 40% for non-metro
    return Math.round(basic * hraPercentage).toString();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Auto-calculate HRA if enabled
      if (newData.autoCalculateHRA) {
        if (name === 'basicSalary' || name === 'isMetroCity' || name === 'autoCalculateHRA') {
          newData.hra = calculateHRA(newData.basicSalary, newData.isMetroCity);
        }
      }

      return newData;
    });
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
      perquisites: parseFloat(formData.perquisites) || 0,
      rentPaid: parseFloat(formData.rentPaid) || 0,
      isMetroCity: formData.isMetroCity,
      section80C: parseFloat(formData.section80C) || 0,
      section80D: parseFloat(formData.section80D) || 0,
      section24B: parseFloat(formData.section24B) || 0,
      otherDeductions: parseFloat(formData.otherDeductions) || 0,
      // RSU data
      rsuSharesPerQuarter: parseFloat(formData.rsuSharesPerQuarter) || 0,
      rsuPricePerShare: parseFloat(formData.rsuPricePerShare) || 0,
      rsuCurrency: formData.rsuCurrency,
      rsuExchangeRate: parseFloat(formData.rsuExchangeRate) || 83.00,
      rsuWithholdingRate: parseFloat(formData.rsuWithholdingRate) || 22,
      rsuQuarterlyMonths: formData.rsuQuarterlyMonths,
    };
    onCalculate(salaryData);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          Salary Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your annual salary components and deductions
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Salary Components Section */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: 'primary.light',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <AccountBalance sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight="semibold">
                Salary Components
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter all components of your annual salary
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Basic Salary (Annual)"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                helperText="Your base annual salary"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="House Rent Allowance (HRA)"
                name="hra"
                value={formData.hra}
                onChange={handleChange}
                type="number"
                disabled={formData.autoCalculateHRA}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                helperText={
                  formData.autoCalculateHRA
                    ? `Auto-calculated: ${formData.isMetroCity ? '50%' : '40%'} of basic`
                    : ''
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={3} height="100%" minHeight={56}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.autoCalculateHRA}
                      onChange={handleChange}
                      name="autoCalculateHRA"
                      color="primary"
                    />
                  }
                  label="Auto-calculate HRA"
                />
                {formData.autoCalculateHRA && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isMetroCity}
                        onChange={handleChange}
                        name="isMetroCity"
                        color="primary"
                      />
                    }
                    label="Living in Metro City"
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Special Allowance"
                name="specialAllowance"
                value={formData.specialAllowance}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Leave Travel Allowance (LTA)"
                name="lta"
                value={formData.lta}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Medical Allowance"
                name="medicalAllowance"
                value={formData.medicalAllowance}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Other Allowances"
                name="otherAllowances"
                value={formData.otherAllowances}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Perquisites"
                name="perquisites"
                value={formData.perquisites}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                helperText="Additional benefits (car, driver, etc.)"
              />
            </Grid>
          </Grid>
        </Box>

        {/* HRA Exemption Details Section */}
        {(formData.hra && parseFloat(formData.hra) > 0) && (
          <Box
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              bgcolor: 'success.light',
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Home sx={{ mr: 2, color: 'success.main', fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight="semibold">
                  HRA Exemption Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Required for calculating HRA tax exemption
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Annual Rent Paid"
                  name="rentPaid"
                  value={formData.rentPaid}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  helperText="Total rent paid in the financial year"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" height="100%">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isMetroCity}
                        onChange={handleChange}
                        name="isMetroCity"
                        color="success"
                      />
                    }
                    label="Living in Metro City"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* RSU Section */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: 'warning.light',
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
          }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <TrendingUp sx={{ mr: 2, color: 'warning.main', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight="semibold">
                RSU (Restricted Stock Units)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quarterly payouts from US-based company
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Shares per Quarter"
                name="rsuSharesPerQuarter"
                value={formData.rsuSharesPerQuarter}
                onChange={handleChange}
                type="number"
                helperText="RSU shares vested each quarter"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price per Share"
                name="rsuPricePerShare"
                value={formData.rsuPricePerShare}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    {formData.rsuCurrency === 'USD' ? '$' : '₹'}
                  </InputAdornment>,
                }}
                helperText="Vesting price per share"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="rsuCurrency"
                  value={formData.rsuCurrency}
                  onChange={handleChange}
                  label="Currency"
                >
                  <MenuItem value="INR">INR (Indian Rupee)</MenuItem>
                  <MenuItem value="USD">USD (US Dollar)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.rsuCurrency === 'USD' && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="USD to INR Exchange Rate"
                  name="rsuExchangeRate"
                  value={formData.rsuExchangeRate}
                  onChange={handleChange}
                  type="number"
                  helperText="Current exchange rate"
                />
              </Grid>
            )}

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="US Tax Withholding Rate (%)"
                name="rsuWithholdingRate"
                value={formData.rsuWithholdingRate}
                onChange={handleChange}
                type="number"
                helperText="Default: 22% for supplemental income"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Quarterly Payout Months</InputLabel>
                <Select
                  multiple
                  name="rsuQuarterlyMonths"
                  value={formData.rsuQuarterlyMonths}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      rsuQuarterlyMonths: typeof e.target.value === 'string' 
                        ? e.target.value.split(',') 
                        : e.target.value,
                    }));
                  }}
                  label="Quarterly Payout Months"
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="March">March (Q1)</MenuItem>
                  <MenuItem value="June">June (Q2)</MenuItem>
                  <MenuItem value="September">September (Q3)</MenuItem>
                  <MenuItem value="December">December (Q4)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Deductions Section */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: 'secondary.light',
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
          }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <Receipt sx={{ mr: 2, color: 'secondary.main', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight="semibold">
                Tax Deductions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Applicable only for Old Tax Regime
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Section 80C Deductions"
                name="section80C"
                value={formData.section80C}
                onChange={handleChange}
                type="number"
                inputProps={{ max: 150000 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                helperText="Max ₹1,50,000 | EPF, PPF, ELSS, Life Insurance, etc."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Section 80D - Health Insurance"
                name="section80D"
                value={formData.section80D}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                helperText="Self/Family: ₹25K | Parents: ₹50K"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Section 24(b) - Home Loan Interest"
                name="section24B"
                value={formData.section24B}
                onChange={handleChange}
                type="number"
                inputProps={{ max: 200000 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                helperText="Max ₹2,00,000 | Interest paid on home loan"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Other Deductions"
                name="otherDeductions"
                value={formData.otherDeductions}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                helperText="Section 80G, 80TTA, 80EE, etc."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Submit Button */}
        <Box display="flex" justifyContent="center" pt={2}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Calculate Tax
          </Button>
        </Box>
      </form>
    </Paper>
  );
}