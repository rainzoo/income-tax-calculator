// FY 2025-26 Indian Income Tax Rules

export const OLD_REGIME_SLABS = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250001, max: 500000, rate: 5 },
    { min: 500001, max: 1000000, rate: 20 },
    { min: 1000001, max: Infinity, rate: 30 },
];

export const NEW_REGIME_SLABS = [
    { min: 0, max: 400000, rate: 0 },
    { min: 400001, max: 800000, rate: 5 },
    { min: 800001, max: 1200000, rate: 10 },
    { min: 1200001, max: 1600000, rate: 15 },
    { min: 1600001, max: 2000000, rate: 20 },
    { min: 2000001, max: 2400000, rate: 25 },
    { min: 2400001, max: Infinity, rate: 30 },
];

// Standard deduction for new regime
export const NEW_REGIME_STANDARD_DEDUCTION = 75000;

// Standard deduction for old regime
export const OLD_REGIME_STANDARD_DEDUCTION = 50000;

// Section 87A rebate for new regime (taxable income up to 12L)
export const SECTION_87A_REBATE_LIMIT = 1200000;
export const SECTION_87A_REBATE_AMOUNT = 25000;

// Deduction limits for old regime
export const DEDUCTION_LIMITS = {
    SECTION_80C: 150000,
    SECTION_80D_SELF_FAMILY: 25000,
    SECTION_80D_PARENTS: 50000,
    SECTION_24B: 200000, // Home loan interest
};

// Health and Education Cess
export const HEALTH_EDUCATION_CESS_RATE = 4; // 4%

// Surcharge rates
export const SURCHARGE_RATES = [
    { min: 5000000, max: 10000000, rate: 10 },
    { min: 10000001, max: 20000000, rate: 15 },
    { min: 20000001, max: 50000000, rate: 25 },
    { min: 50000001, max: Infinity, rate: 37 },
];

// Senior citizen exemption limits
export const SENIOR_CITIZEN_EXEMPTION = 300000; // Age 60-80
export const SUPER_SENIOR_CITIZEN_EXEMPTION = 500000; // Age 80+

// Form validation constants
export const FORM_CONSTANTS = {
    // HRA calculation percentages
    HRA_METRO_PERCENTAGE: 0.5, // 50% for metro cities
    HRA_NON_METRO_PERCENTAGE: 0.4, // 40% for non-metro cities
    RENT_DEDUCTION_PERCENTAGE: 0.1, // 10% of basic salary for rent calculation

    // Deduction limits
    SECTION_80C_LIMIT: 150000,
    SECTION_24B_LIMIT: 200000, // Home loan interest

    // Provident Fund
    EPF_EMPLOYEE_PERCENTAGE: 0.12, // 12% of basic salary

    // Default values
    DEFAULT_USD_EXCHANGE_RATE: 83.00,
    DEFAULT_US_TAX_WITHHOLDING: 22, // 22%
};

// Currency formatting
export const CURRENCY_CONFIG = {
    locale: 'en-IN',
    currency: 'INR',
};
