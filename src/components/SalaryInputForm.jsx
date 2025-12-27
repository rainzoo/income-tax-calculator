import { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,

} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { FORM_CONSTANTS } from '../constants/taxRules.js';
import { validateForm, hasErrors } from '../utils/validation.js';
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

  // Memoized utility functions to prevent unnecessary re-renders
  const formatIndianNumber = useCallback((value) => {
    if (!value || value === '') return '';
    const num = value.toString().replace(/,/g, '');
    if (isNaN(num)) return value;
    const numStr = Number(num).toLocaleString('en-IN');
    return numStr;
  }, []);

  const parseIndianNumber = useCallback((value) => {
    if (!value || value === '') return '';
    return value.toString().replace(/,/g, '');
  }, []);

  const calculateHRA = useCallback((basicSalary, isMetroCity) => {
    if (!basicSalary || parseFloat(basicSalary) <= 0) return '';
    const basic = parseFloat(basicSalary);
    const hraPercentage = isMetroCity ? FORM_CONSTANTS.HRA_METRO_PERCENTAGE : FORM_CONSTANTS.HRA_NON_METRO_PERCENTAGE;
    return Math.round(basic * hraPercentage).toString();
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('salaryFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.warn('Failed to load saved form data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('salaryFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = useCallback((e) => {
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
  }, [parseIndianNumber, calculateHRA]);

  // Memoized currency fields list
  const currencyFields = useMemo(() => [
    'basicSalary', 'hra', 'specialAllowance', 'lta', 'medicalAllowance',
    'otherAllowances', 'perquisites', 'rentPaid', 'section80C', 'section80D',
    'section24B', 'otherDeductions'
  ], []);

  // Get display value for input fields - memoized
  const getDisplayValue = useCallback((name, value) => {
    if (!value || value === '') return '';
    if (currencyFields.includes(name)) {
      return formatIndianNumber(value);
    }
    return value;
  }, [currencyFields, formatIndianNumber]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Validate form data
    const errors = validateForm(formData);

    // If there are validation errors, don't submit
    if (hasErrors(errors)) {
      return;
    }

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
  }, [formData, onCalculate]);

  return (
    <Card sx={{ mb: 4 }} role="main" aria-labelledby="salary-form-title">
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <AssignmentIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography
              id="salary-form-title"
              variant="h4"
              component="h2"
              sx={{ fontWeight: 700, color: 'text.primary' }}
              gutterBottom
            >
              Salary Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your annual salary components and deductions
            </Typography>
          </Box>
        </Box>

      <form onSubmit={handleSubmit} noValidate aria-describedby="salary-form-description">
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
      </CardContent>
    </Card>
  );
}

SalaryInputForm.propTypes = {
  onCalculate: PropTypes.func.isRequired,
};
