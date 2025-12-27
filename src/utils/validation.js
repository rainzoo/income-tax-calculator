import { FORM_CONSTANTS } from '../constants/taxRules.js';

/**
 * Validation utility functions for form inputs
 */

const VALIDATION_RULES = {
  required: (value) => {
    if (!value || value.toString().trim() === '') {
      return 'This field is required';
    }
    return null;
  },

  numeric: (value) => {
    if (value && isNaN(Number(value))) {
      return 'Please enter a valid number';
    }
    return null;
  },

  positive: (value) => {
    const num = Number(value);
    if (value && (isNaN(num) || num < 0)) {
      return 'Please enter a positive number';
    }
    return null;
  },

  percentage: (value) => {
    const num = Number(value);
    if (value && (isNaN(num) || num < 0 || num > 100)) {
      return 'Percentage must be between 0 and 100';
    }
    return null;
  },

  maxValue: (max) => (value) => {
    const num = Number(value);
    if (value && !isNaN(num) && num > max) {
      return `Maximum allowed value is ${max.toLocaleString('en-IN')}`;
    }
    return null;
  },

  minValue: (min) => (value) => {
    const num = Number(value);
    if (value && !isNaN(num) && num < min) {
      return `Minimum allowed value is ${min.toLocaleString('en-IN')}`;
    }
    return null;
  },

  currency: (value) => {
    if (value && !/^[₹$]?\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(value.toString())) {
      return 'Please enter a valid currency amount';
    }
    return null;
  },

  // Specific business logic validations
  reasonableSalary: (value) => {
    const num = Number(value);
    if (value && !isNaN(num)) {
      if (num < 10000) {
        return 'Salary seems too low for annual amount';
      }
      if (num > 100000000) { // 10 crores
        return 'Salary seems unreasonably high';
      }
    }
    return null;
  },

  rentVsSalary: (rentPaid, basicSalary) => {
    const rent = Number(rentPaid);
    const salary = Number(basicSalary);
    if (rentPaid && basicSalary && !isNaN(rent) && !isNaN(salary)) {
      if (rent > salary * 2) {
        return 'Rent paid seems unusually high compared to salary';
      }
    }
    return null;
  },

  rsuShares: (value) => {
    const num = Number(value);
    if (value && !isNaN(num) && num > 10000) {
      return 'Number of RSU shares seems unusually high';
    }
    return null;
  },

  rsuPrice: (value) => {
    const num = Number(value);
    if (value && !isNaN(num)) {
      if (num < 1) {
        return 'RSU price per share seems too low';
      }
      if (num > 10000) {
        return 'RSU price per share seems too high';
      }
    }
    return null;
  },

  exchangeRate: (value) => {
    const num = Number(value);
    if (value && !isNaN(num)) {
      if (num < 60 || num > 120) {
        return 'Exchange rate seems unreasonable (typical range: 60-120)';
      }
    }
    return null;
  },
};

/**
 * Validate a single field with multiple rules
 */
const validateField = (value, rules) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) {
      return error;
    }
  }
  return null;
};

/**
 * Validate entire form data
 */
export const validateForm = (formData) => {
  const errors = {};

  // Basic Salary validation
  errors.basicSalary = validateField(formData.basicSalary, [
    VALIDATION_RULES.required,
    VALIDATION_RULES.numeric,
    VALIDATION_RULES.positive,
    VALIDATION_RULES.reasonableSalary,
  ]);

  // HRA validation
  if (formData.hra) {
    errors.hra = validateField(formData.hra, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
      VALIDATION_RULES.maxValue(Number(formData.basicSalary) || Infinity),
    ]);
  }

  // Rent Paid validation
  if (formData.rentPaid) {
    errors.rentPaid = validateField(formData.rentPaid, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
    ]);

    // Cross-field validation: rent vs salary
    if (!errors.rentPaid) {
      errors.rentPaid = VALIDATION_RULES.rentVsSalary(formData.rentPaid, formData.basicSalary);
    }
  }

  // Allowance validations
  const allowances = ['specialAllowance', 'lta', 'medicalAllowance', 'otherAllowances'];
  allowances.forEach(field => {
    if (formData[field]) {
      errors[field] = validateField(formData[field], [
        VALIDATION_RULES.numeric,
        VALIDATION_RULES.positive,
      ]);
    }
  });

  // Perquisites validation
  if (formData.perquisites) {
    errors.perquisites = validateField(formData.perquisites, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
    ]);
  }

  // RSU validations
  if (formData.rsuSharesPerQuarter) {
    errors.rsuSharesPerQuarter = validateField(formData.rsuSharesPerQuarter, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
      VALIDATION_RULES.rsuShares,
    ]);
  }

  if (formData.rsuPricePerShare) {
    errors.rsuPricePerShare = validateField(formData.rsuPricePerShare, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
      VALIDATION_RULES.rsuPrice,
    ]);
  }

  if (formData.rsuExchangeRate && formData.rsuCurrency === 'USD') {
    errors.rsuExchangeRate = validateField(formData.rsuExchangeRate, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
      VALIDATION_RULES.exchangeRate,
    ]);
  }

  if (formData.rsuWithholdingRate) {
    errors.rsuWithholdingRate = validateField(formData.rsuWithholdingRate, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
      VALIDATION_RULES.percentage,
    ]);
  }

  // Deduction validations with limits
  if (formData.section80C) {
    errors.section80C = validateField(formData.section80C, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
      VALIDATION_RULES.maxValue(FORM_CONSTANTS.SECTION_80C_LIMIT),
    ]);
  }

  if (formData.section80D) {
    errors.section80D = validateField(formData.section80D, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
      VALIDATION_RULES.maxValue(FORM_CONSTANTS.SECTION_80D_SELF_FAMILY * 4), // Reasonable upper limit
    ]);
  }

  if (formData.section24B) {
    errors.section24B = validateField(formData.section24B, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
      VALIDATION_RULES.maxValue(FORM_CONSTANTS.SECTION_24B_LIMIT),
    ]);
  }

  if (formData.otherDeductions) {
    errors.otherDeductions = validateField(formData.otherDeductions, [
      VALIDATION_RULES.numeric,
      VALIDATION_RULES.positive,
    ]);
  }

  // Remove null errors
  Object.keys(errors).forEach(key => {
    if (errors[key] === null) {
      delete errors[key];
    }
  });

  return errors;
};

/**
 * Check if form has any validation errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Get error message for a specific field
 */
const getFieldError = (errors, fieldName) => {
  return errors[fieldName] || null;
};
