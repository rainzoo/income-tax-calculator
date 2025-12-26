import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import { FORM_CONSTANTS, TIME_CONSTANTS } from '../constants/taxRules.js';
import { validateForm, hasErrors, getFieldError } from '../utils/validation.js';
import SalaryComponentsSection from './SalaryComponentsSection.jsx';
import HRAExemptionSection from './HRAExemptionSection.jsx';
import RSUSection from './RSUSection.jsx';
import DeductionsSection from './DeductionsSection.jsx';

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
    rsuExchangeRate: FORM_CONSTANTS.DEFAULT_USD_EXCHANGE_RATE.toString(),
    rsuWithholdingRate: FORM_CONSTANTS.DEFAULT_US_TAX_WITHHOLDING.toString(),
    rsuQuarterlyMonths: [],
  });

  // Format number in Indian currency format
  const formatIndianNumber = (value) => {
    if (!value || value === '') return '';
    const num = value.toString().replace(/,/g, '');
    if (isNaN(num)) return value;

    const numStr = Number(num).toLocaleString('en-IN');
    return numStr;
  };

  // Parse formatted number back to plain number
  const parseIndianNumber = (value) => {
    if (!value || value === '') return '';
    return value.toString().replace(/,/g, '');
  };

  const calculateHRA = (basicSalary, isMetroCity) => {
    if (!basicSalary || parseFloat(basicSalary) <= 0) return '';
    const basic = parseFloat(basicSalary);
    const hraPercentage = isMetroCity ? FORM_CONSTANTS.HRA_METRO_PERCENTAGE : FORM_CONSTANTS.HRA_NON_METRO_PERCENTAGE;
    return Math.round(basic * hraPercentage).toString();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const newData = { ...prev };

      if (type === 'checkbox') {
        newData[name] = checked;
      } else {
        // For number inputs, store raw number but display formatted
        const rawValue = parseIndianNumber(value);
        newData[name] = rawValue;
      }

      // Auto-calculate HRA if enabled and we have basic salary
      if (newData.autoCalculateHRA && newData.basicSalary) {
        newData.hra = calculateHRA(newData.basicSalary, newData.isMetroCity);
      } else if (!newData.autoCalculateHRA) {
        // Clear HRA if auto-calculation is disabled
        newData.hra = '';
      }

      return newData;
    });
  };

  // Get display value for input fields
  const getDisplayValue = (name, value) => {
    if (!value || value === '') return '';
    // For currency fields, show formatted value
    const currencyFields = [
      'basicSalary', 'hra', 'specialAllowance', 'lta', 'medicalAllowance',
      'otherAllowances', 'perquisites', 'rentPaid', 'section80C', 'section80D',
      'section24B', 'otherDeductions'
    ];
    if (currencyFields.includes(name)) {
      return formatIndianNumber(value);
    }
    return value;
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
      rsuExchangeRate: parseFloat(formData.rsuExchangeRate) || FORM_CONSTANTS.DEFAULT_USD_EXCHANGE_RATE,
      rsuWithholdingRate: parseFloat(formData.rsuWithholdingRate) || FORM_CONSTANTS.DEFAULT_US_TAX_WITHHOLDING,
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
        <SalaryComponentsSection
          formData={formData}
          handleChange={handleChange}
          getDisplayValue={getDisplayValue}
          calculateHRA={calculateHRA}
        />

        <HRAExemptionSection
          formData={formData}
          handleChange={handleChange}
          getDisplayValue={getDisplayValue}
        />

        <RSUSection
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />

        <DeductionsSection
          formData={formData}
          handleChange={handleChange}
          getDisplayValue={getDisplayValue}
        />

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
