import {
    OLD_REGIME_SLABS,
    NEW_REGIME_SLABS,
    NEW_REGIME_STANDARD_DEDUCTION,
    OLD_REGIME_STANDARD_DEDUCTION,
    SECTION_87A_REBATE_LIMIT,
    SECTION_87A_REBATE_AMOUNT,
    HEALTH_EDUCATION_CESS_RATE,
    SURCHARGE_RATES,
    FORM_CONSTANTS,
    TIME_CONSTANTS,
} from '../constants/taxRules.js';

/**
 * Calculate tax based on tax slabs (progressive tax system)
 * Each slab applies only to the income within that range
 * Example: For ₹6L income with old regime:
 * - ₹0-₹2.5L: 0% = ₹0
 * - ₹2.5L-₹5L: 5% on ₹2.5L = ₹12,500
 * - ₹5L-₹6L: 20% on ₹1L = ₹20,000
 * Total = ₹32,500
 */
export function calculateTaxBySlabs(taxableIncome, slabs) {
    if (taxableIncome <= 0) return 0;

    let tax = 0;

    for (const slab of slabs) {
        // Skip if income is below this slab
        if (taxableIncome < slab.min) break;

        // Calculate the portion of income that falls in this slab
        const slabUpperLimit = slab.max === Infinity ? taxableIncome : Math.min(slab.max, taxableIncome);
        const taxableInThisSlab = slabUpperLimit - slab.min;

        if (taxableInThisSlab > 0) {
            tax += (taxableInThisSlab * slab.rate) / 100;
        }
    }

    return Math.round(tax);
}

/**
 * Calculate surcharge based on total income
 */
function calculateSurcharge(totalIncome, taxBeforeSurcharge) {
    for (const surchargeRate of SURCHARGE_RATES) {
        if (totalIncome >= surchargeRate.min && totalIncome <= surchargeRate.max) {
            return Math.round((taxBeforeSurcharge * surchargeRate.rate) / 100);
        }
    }
    return 0;
}

/**
 * Calculate Health and Education Cess
 */
function calculateCess(taxIncludingSurcharge) {
    return Math.round((taxIncludingSurcharge * HEALTH_EDUCATION_CESS_RATE) / 100);
}

/**
 * Calculate HRA exemption
 */
export function calculateHRAExemption(
    hraReceived,
    basicSalary,
    rentPaid,
    isMetroCity
) {
    const exemption1 = hraReceived;
    const exemption2 = rentPaid - (basicSalary * FORM_CONSTANTS.RENT_DEDUCTION_PERCENTAGE);
    const exemption3 = isMetroCity
        ? basicSalary * FORM_CONSTANTS.HRA_METRO_PERCENTAGE
        : basicSalary * FORM_CONSTANTS.HRA_NON_METRO_PERCENTAGE;

    return Math.min(exemption1, Math.max(exemption2, exemption3));
}

/**
 * Calculate RSU details
 */
export function calculateRSUDetails(salaryData) {
    if (!salaryData.rsuSharesPerQuarter || salaryData.rsuSharesPerQuarter <= 0) {
        return {
            grossRSU: 0,
            usTaxWithheld: 0,
            netRSU: 0,
            dtaaCredit: 0,
        };
    }

    const sharesPerQuarter = salaryData.rsuSharesPerQuarter || 0;
    const pricePerShare = salaryData.rsuPricePerShare || 0;
    const currency = salaryData.rsuCurrency || 'INR';
    const exchangeRate = salaryData.rsuExchangeRate || 83.00;
    const withholdingRate = (salaryData.rsuWithholdingRate || 22) / 100;

    // Calculate per quarter values
    let grossRSUPerQuarter = sharesPerQuarter * pricePerShare;
    
    // Convert to INR if USD
    if (currency === 'USD') {
        grossRSUPerQuarter = grossRSUPerQuarter * exchangeRate;
    }

    // Annual RSU (4 quarters)
    const grossRSU = grossRSUPerQuarter * TIME_CONSTANTS.QUARTERS_IN_YEAR;
    const usTaxWithheld = grossRSU * withholdingRate;
    const netRSU = grossRSU - usTaxWithheld;

    return {
        grossRSU: Math.round(grossRSU),
        usTaxWithheld: Math.round(usTaxWithheld),
        netRSU: Math.round(netRSU),
        dtaaCredit: Math.round(usTaxWithheld), // Can be claimed as credit
        grossRSUPerQuarter: Math.round(grossRSUPerQuarter),
        usTaxWithheldPerQuarter: Math.round(grossRSUPerQuarter * withholdingRate),
        netRSUPerQuarter: Math.round(grossRSUPerQuarter * (1 - withholdingRate)),
    };
}

/**
 * Calculate DTAA credit (limited to Indian tax on RSU income)
 */
function calculateDTAACredit(rsuDetails, indianTaxOnRSUIncome) {
    // DTAA credit is limited to the Indian tax payable on that income
    return Math.min(rsuDetails.dtaaCredit, indianTaxOnRSUIncome);
}

/**
 * Calculate gross salary from all components
 */
export function calculateGrossSalary(salaryData) {
    const rsuDetails = calculateRSUDetails(salaryData);
    return (
        (salaryData.basicSalary || 0) +
        (salaryData.hra || 0) +
        (salaryData.specialAllowance || 0) +
        (salaryData.lta || 0) +
        (salaryData.medicalAllowance || 0) +
        (salaryData.otherAllowances || 0) +
        (salaryData.perquisites || 0) +
        rsuDetails.netRSU // Include net RSU after US tax
    );
}

/**
 * Calculate taxable income for old regime
 */
export function calculateOldRegimeTaxableIncome(salaryData) {
    const grossSalary = calculateGrossSalary(salaryData);

    // Apply standard deduction for old regime
    const salaryAfterStandardDeduction = Math.max(0, grossSalary - OLD_REGIME_STANDARD_DEDUCTION);

    // Calculate HRA exemption
    let hraExemption = 0;
    if (salaryData.hra && salaryData.rentPaid) {
        hraExemption = calculateHRAExemption(
            salaryData.hra,
            salaryData.basicSalary || 0,
            salaryData.rentPaid,
            salaryData.isMetroCity || false
        );
    }

    // Calculate total deductions
    const deductions =
        Math.min(salaryData.section80C || 0, FORM_CONSTANTS.SECTION_80C_LIMIT) +
        (salaryData.section80D || 0) +
        Math.min(salaryData.section24B || 0, FORM_CONSTANTS.SECTION_24B_LIMIT) +
        (salaryData.otherDeductions || 0) +
        hraExemption;

    return Math.max(0, salaryAfterStandardDeduction - deductions);
}

/**
 * Calculate taxable income for new regime
 */
export function calculateNewRegimeTaxableIncome(salaryData) {
    const grossSalary = calculateGrossSalary(salaryData);
    return Math.max(0, grossSalary - NEW_REGIME_STANDARD_DEDUCTION);
}

/**
 * Calculate total tax for old regime
 */
export function calculateOldRegimeTax(salaryData) {
    const taxableIncome = calculateOldRegimeTaxableIncome(salaryData);
    const grossSalary = calculateGrossSalary(salaryData);
    const rsuDetails = calculateRSUDetails(salaryData);

    // Calculate tax based on slabs
    let tax = calculateTaxBySlabs(taxableIncome, OLD_REGIME_SLABS);

    // Calculate tax on RSU income separately for DTAA credit calculation
    // This is approximate - actual calculation would need marginal tax rate on RSU portion
    const taxOnRSUIncome = rsuDetails.netRSU > 0 && taxableIncome > 0
        ? (tax * (rsuDetails.netRSU / taxableIncome)) || 0
        : 0;

    // Calculate surcharge
    const surcharge = calculateSurcharge(grossSalary, tax);
    const taxWithSurcharge = tax + surcharge;

    // Calculate cess
    const cess = calculateCess(taxWithSurcharge);

    let totalTax = tax + surcharge + cess;

    // Apply DTAA credit
    const dtaaCredit = tax > 0
        ? calculateDTAACredit(rsuDetails, taxOnRSUIncome + (surcharge * (taxOnRSUIncome / tax)) + (cess * (taxOnRSUIncome / tax)))
        : calculateDTAACredit(rsuDetails, 0);
    totalTax = Math.max(0, totalTax - dtaaCredit);

    return {
        taxableIncome,
        tax,
        surcharge,
        cess,
        dtaaCredit,
        totalTax,
    };
}

/**
 * Calculate total tax for new regime
 */
export function calculateNewRegimeTax(salaryData) {
    const taxableIncome = calculateNewRegimeTaxableIncome(salaryData);
    const grossSalary = calculateGrossSalary(salaryData);
    const rsuDetails = calculateRSUDetails(salaryData);

    // Calculate tax based on slabs
    let tax = calculateTaxBySlabs(taxableIncome, NEW_REGIME_SLABS);

    // Apply Section 87A rebate if applicable
    const rebate = taxableIncome <= SECTION_87A_REBATE_LIMIT ? SECTION_87A_REBATE_AMOUNT : 0;
    if (rebate > 0) {
        tax = Math.max(0, tax - rebate);
    }

    // Calculate tax on RSU income separately for DTAA credit calculation
    const taxOnRSUIncome = rsuDetails.netRSU > 0 && taxableIncome > 0
        ? (tax * (rsuDetails.netRSU / taxableIncome)) || 0
        : 0;

    // Calculate surcharge
    const surcharge = calculateSurcharge(grossSalary, tax);
    const taxWithSurcharge = tax + surcharge;

    // Calculate cess
    const cess = calculateCess(taxWithSurcharge);

    let totalTax = tax + surcharge + cess;

    // Apply DTAA credit
    const dtaaCredit = tax > 0
        ? calculateDTAACredit(rsuDetails, taxOnRSUIncome + (surcharge * (taxOnRSUIncome / tax)) + (cess * (taxOnRSUIncome / tax)))
        : calculateDTAACredit(rsuDetails, 0);
    totalTax = Math.max(0, totalTax - dtaaCredit);

    return {
        taxableIncome,
        tax,
        rebate,
        surcharge,
        cess,
        dtaaCredit,
        totalTax,
    };
}

/**
 * Calculate monthly breakdown with detailed components
 */
export function calculateMonthlyBreakdown(salaryData) {
    const rsuDetails = calculateRSUDetails(salaryData);
    const rsuQuarterlyMonths = salaryData.rsuQuarterlyMonths || [];
    
    // Monthly salary components (excluding RSU)
    const monthlyBasic = (salaryData.basicSalary || 0) / TIME_CONSTANTS.MONTHS_IN_YEAR;
    const monthlyHRA = (salaryData.hra || 0) / TIME_CONSTANTS.MONTHS_IN_YEAR;
    const monthlyAllowances = (
        (salaryData.specialAllowance || 0) +
        (salaryData.lta || 0) +
        (salaryData.medicalAllowance || 0) +
        (salaryData.otherAllowances || 0) +
        (salaryData.perquisites || 0)
    ) / TIME_CONSTANTS.MONTHS_IN_YEAR;

    // Provident Fund (EPF) - Employee contribution is 12% of basic salary
    const monthlyProvidentFund = (salaryData.basicSalary || 0) * FORM_CONSTANTS.EPF_EMPLOYEE_PERCENTAGE / TIME_CONSTANTS.MONTHS_IN_YEAR;

    const oldRegimeResult = calculateOldRegimeTax(salaryData);
    const newRegimeResult = calculateNewRegimeTax(salaryData);

    // Calculate monthly tax (distributed evenly, but RSU months will have higher income)
    const monthlyOldTax = oldRegimeResult.totalTax / TIME_CONSTANTS.MONTHS_IN_YEAR;
    const monthlyNewTax = newRegimeResult.totalTax / TIME_CONSTANTS.MONTHS_IN_YEAR;

    const months = [
        'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December', 'January', 'February', 'March'
    ];

    // Track cumulative RSU values
    let cumulativeGrossRSU = 0;
    let cumulativeUSTaxWithheld = 0;
    let cumulativeNetRSU = 0;

    return months.map((month, index) => {
        // Check if this month has RSU payout
        const hasRSUPayout = rsuQuarterlyMonths.includes(month);
        const monthlyGrossRSU = hasRSUPayout ? rsuDetails.grossRSUPerQuarter : 0;
        const monthlyUSTaxWithheld = hasRSUPayout ? rsuDetails.usTaxWithheldPerQuarter : 0;
        const monthlyNetRSU = hasRSUPayout ? rsuDetails.netRSUPerQuarter : 0;

        cumulativeGrossRSU += monthlyGrossRSU;
        cumulativeUSTaxWithheld += monthlyUSTaxWithheld;
        cumulativeNetRSU += monthlyNetRSU;

        // Monthly gross includes RSU in RSU payout months
        const monthlyGross = monthlyBasic + monthlyHRA + monthlyAllowances + monthlyNetRSU;

        // Calculate cumulative values up to this month
        const cumulativeBasic = monthlyBasic * (index + 1);
        const cumulativeHRA = monthlyHRA * (index + 1);
        const cumulativeAllowances = monthlyAllowances * (index + 1);
        const cumulativeProvidentFund = monthlyProvidentFund * (index + 1);
        const cumulativeOldTax = monthlyOldTax * (index + 1);
        const cumulativeNewTax = monthlyNewTax * (index + 1);
        const cumulativeGrossSalary = cumulativeBasic + cumulativeHRA + cumulativeAllowances + cumulativeNetRSU;

        return {
            month,
            monthNumber: index + 1,
            // Monthly components
            basic: Math.round(monthlyBasic),
            hra: Math.round(monthlyHRA),
            allowances: Math.round(monthlyAllowances),
            grossSalary: Math.round(monthlyGross),
            // RSU details
            hasRSUPayout,
            grossRSU: Math.round(monthlyGrossRSU),
            usTaxWithheld: Math.round(monthlyUSTaxWithheld),
            netRSU: Math.round(monthlyNetRSU),
            // Deductions
            providentFund: Math.round(monthlyProvidentFund),
            incomeTaxOld: Math.round(monthlyOldTax),
            incomeTaxNew: Math.round(monthlyNewTax),
            // Cumulative
            cumulativeBasic: Math.round(cumulativeBasic),
            cumulativeHRA: Math.round(cumulativeHRA),
            cumulativeAllowances: Math.round(cumulativeAllowances),
            cumulativeGrossSalary: Math.round(cumulativeGrossSalary),
            cumulativeProvidentFund: Math.round(cumulativeProvidentFund),
            cumulativeOldTax: Math.round(cumulativeOldTax),
            cumulativeNewTax: Math.round(cumulativeNewTax),
            cumulativeGrossRSU: Math.round(cumulativeGrossRSU),
            cumulativeUSTaxWithheld: Math.round(cumulativeUSTaxWithheld),
            cumulativeNetRSU: Math.round(cumulativeNetRSU),
            // Net salary
            netSalaryOld: Math.round(monthlyGross - monthlyOldTax - monthlyProvidentFund),
            netSalaryNew: Math.round(monthlyGross - monthlyNewTax - monthlyProvidentFund),
        };
    });
}

/**
 * Calculate annual summary
 */
export function calculateAnnualSummary(salaryData) {
    const grossSalary = calculateGrossSalary(salaryData);
    const rsuDetails = calculateRSUDetails(salaryData);
    const oldRegimeResult = calculateOldRegimeTax(salaryData);
    const newRegimeResult = calculateNewRegimeTax(salaryData);

    // Calculate deductions for old regime (including standard deduction)
    let oldRegimeDeductions = OLD_REGIME_STANDARD_DEDUCTION; // Standard deduction
    if (salaryData.hra && salaryData.rentPaid) {
        oldRegimeDeductions += calculateHRAExemption(
            salaryData.hra,
            salaryData.basicSalary || 0,
            salaryData.rentPaid,
            salaryData.isMetroCity || false
        );
    }
    oldRegimeDeductions += Math.min(salaryData.section80C || 0, FORM_CONSTANTS.SECTION_80C_LIMIT);
    oldRegimeDeductions += (salaryData.section80D || 0);
    oldRegimeDeductions += Math.min(salaryData.section24B || 0, FORM_CONSTANTS.SECTION_24B_LIMIT);
    oldRegimeDeductions += (salaryData.otherDeductions || 0);

    const newRegimeDeductions = NEW_REGIME_STANDARD_DEDUCTION;

    // Calculate gross salary without RSU for display
    const grossSalaryWithoutRSU = grossSalary - rsuDetails.netRSU;

    return {
        grossSalary: Math.round(grossSalary),
        grossSalaryWithoutRSU: Math.round(grossSalaryWithoutRSU),
        rsu: {
            grossRSU: rsuDetails.grossRSU,
            usTaxWithheld: rsuDetails.usTaxWithheld,
            netRSU: rsuDetails.netRSU,
            dtaaCredit: oldRegimeResult.dtaaCredit || newRegimeResult.dtaaCredit || 0,
        },
        oldRegime: {
            deductions: Math.round(oldRegimeDeductions),
            taxableIncome: oldRegimeResult.taxableIncome,
            tax: oldRegimeResult.tax,
            surcharge: oldRegimeResult.surcharge,
            cess: oldRegimeResult.cess,
            dtaaCredit: oldRegimeResult.dtaaCredit || 0,
            totalTax: oldRegimeResult.totalTax,
            netSalary: Math.round(grossSalary - oldRegimeResult.totalTax),
        },
        newRegime: {
            deductions: newRegimeDeductions,
            taxableIncome: newRegimeResult.taxableIncome,
            tax: newRegimeResult.tax,
            rebate: newRegimeResult.rebate,
            surcharge: newRegimeResult.surcharge,
            cess: newRegimeResult.cess,
            dtaaCredit: newRegimeResult.dtaaCredit || 0,
            totalTax: newRegimeResult.totalTax,
            netSalary: Math.round(grossSalary - newRegimeResult.totalTax),
        },
        savings: Math.round(newRegimeResult.totalTax - oldRegimeResult.totalTax),
        recommendedRegime: newRegimeResult.totalTax < oldRegimeResult.totalTax ? 'new' : 'old',
    };
}
