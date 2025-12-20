import {
    OLD_REGIME_SLABS,
    NEW_REGIME_SLABS,
    NEW_REGIME_STANDARD_DEDUCTION,
    SECTION_87A_REBATE_LIMIT,
    SECTION_87A_REBATE_AMOUNT,
    HEALTH_EDUCATION_CESS_RATE,
    SURCHARGE_RATES,
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
        const taxableInThisSlab = slabUpperLimit - slab.min + 1;

        if (taxableInThisSlab > 0) {
            tax += (taxableInThisSlab * slab.rate) / 100;
        }
    }

    return Math.round(tax);
}

/**
 * Calculate surcharge based on total income
 */
export function calculateSurcharge(totalIncome, taxBeforeSurcharge) {
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
export function calculateCess(taxIncludingSurcharge) {
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
    const exemption2 = rentPaid - (basicSalary * 0.1);
    const exemption3 = isMetroCity
        ? basicSalary * 0.5
        : basicSalary * 0.4;

    return Math.min(exemption1, Math.max(exemption2, exemption3));
}

/**
 * Calculate gross salary from all components
 */
export function calculateGrossSalary(salaryData) {
    return (
        (salaryData.basicSalary || 0) +
        (salaryData.hra || 0) +
        (salaryData.specialAllowance || 0) +
        (salaryData.lta || 0) +
        (salaryData.medicalAllowance || 0) +
        (salaryData.otherAllowances || 0) +
        (salaryData.perquisites || 0)
    );
}

/**
 * Calculate taxable income for old regime
 */
export function calculateOldRegimeTaxableIncome(salaryData) {
    const grossSalary = calculateGrossSalary(salaryData);

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
        Math.min(salaryData.section80C || 0, 150000) +
        (salaryData.section80D || 0) +
        Math.min(salaryData.section24B || 0, 200000) +
        (salaryData.otherDeductions || 0) +
        hraExemption;

    const taxableIncome = Math.max(0, grossSalary - deductions);
    return taxableIncome;
}

/**
 * Calculate taxable income for new regime
 */
export function calculateNewRegimeTaxableIncome(salaryData) {
    const grossSalary = calculateGrossSalary(salaryData);
    const taxableIncome = Math.max(0, grossSalary - NEW_REGIME_STANDARD_DEDUCTION);
    return taxableIncome;
}

/**
 * Calculate total tax for old regime
 */
export function calculateOldRegimeTax(salaryData) {
    const taxableIncome = calculateOldRegimeTaxableIncome(salaryData);
    const grossSalary = calculateGrossSalary(salaryData);

    // Calculate tax based on slabs
    let tax = calculateTaxBySlabs(taxableIncome, OLD_REGIME_SLABS);

    // Calculate surcharge
    const surcharge = calculateSurcharge(grossSalary, tax);
    const taxWithSurcharge = tax + surcharge;

    // Calculate cess
    const cess = calculateCess(taxWithSurcharge);

    const totalTax = tax + surcharge + cess;

    return {
        taxableIncome,
        tax,
        surcharge,
        cess,
        totalTax,
    };
}

/**
 * Calculate total tax for new regime
 */
export function calculateNewRegimeTax(salaryData) {
    const taxableIncome = calculateNewRegimeTaxableIncome(salaryData);
    const grossSalary = calculateGrossSalary(salaryData);

    // Calculate tax based on slabs
    let tax = calculateTaxBySlabs(taxableIncome, NEW_REGIME_SLABS);

    // Apply Section 87A rebate if applicable
    if (taxableIncome <= SECTION_87A_REBATE_LIMIT) {
        tax = Math.max(0, tax - SECTION_87A_REBATE_AMOUNT);
    }

    // Calculate surcharge
    const surcharge = calculateSurcharge(grossSalary, tax);
    const taxWithSurcharge = tax + surcharge;

    // Calculate cess
    const cess = calculateCess(taxWithSurcharge);

    const totalTax = tax + surcharge + cess;

    return {
        taxableIncome,
        tax,
        rebate: taxableIncome <= SECTION_87A_REBATE_LIMIT ? SECTION_87A_REBATE_AMOUNT : 0,
        surcharge,
        cess,
        totalTax,
    };
}

/**
 * Calculate monthly breakdown with detailed components
 */
export function calculateMonthlyBreakdown(salaryData) {
    const grossSalary = calculateGrossSalary(salaryData);
    const monthlyGross = grossSalary / 12;

    // Monthly salary components
    const monthlyBasic = (salaryData.basicSalary || 0) / 12;
    const monthlyHRA = (salaryData.hra || 0) / 12;
    const monthlyAllowances = (
        (salaryData.specialAllowance || 0) +
        (salaryData.lta || 0) +
        (salaryData.medicalAllowance || 0) +
        (salaryData.otherAllowances || 0) +
        (salaryData.perquisites || 0)
    ) / 12;

    // Provident Fund (EPF) - Employee contribution is 12% of basic salary
    const monthlyProvidentFund = (salaryData.basicSalary || 0) * 0.12 / 12;

    const oldRegimeResult = calculateOldRegimeTax(salaryData);
    const newRegimeResult = calculateNewRegimeTax(salaryData);

    const monthlyOldTax = oldRegimeResult.totalTax / 12;
    const monthlyNewTax = newRegimeResult.totalTax / 12;

    const months = [
        'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December', 'January', 'February', 'March'
    ];

    return months.map((month, index) => {
        // Calculate cumulative values up to this month
        const cumulativeBasic = monthlyBasic * (index + 1);
        const cumulativeHRA = monthlyHRA * (index + 1);
        const cumulativeAllowances = monthlyAllowances * (index + 1);
        const cumulativeProvidentFund = monthlyProvidentFund * (index + 1);
        const cumulativeOldTax = monthlyOldTax * (index + 1);
        const cumulativeNewTax = monthlyNewTax * (index + 1);
        const cumulativeGrossSalary = monthlyGross * (index + 1);

        return {
            month,
            monthNumber: index + 1,
            // Monthly components
            basic: Math.round(monthlyBasic),
            hra: Math.round(monthlyHRA),
            allowances: Math.round(monthlyAllowances),
            grossSalary: Math.round(monthlyGross),
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
    const oldRegimeResult = calculateOldRegimeTax(salaryData);
    const newRegimeResult = calculateNewRegimeTax(salaryData);

    // Calculate deductions for old regime
    let oldRegimeDeductions = 0;
    if (salaryData.hra && salaryData.rentPaid) {
        oldRegimeDeductions += calculateHRAExemption(
            salaryData.hra,
            salaryData.basicSalary || 0,
            salaryData.rentPaid,
            salaryData.isMetroCity || false
        );
    }
    oldRegimeDeductions += Math.min(salaryData.section80C || 0, 150000);
    oldRegimeDeductions += (salaryData.section80D || 0);
    oldRegimeDeductions += Math.min(salaryData.section24B || 0, 200000);
    oldRegimeDeductions += (salaryData.otherDeductions || 0);

    const newRegimeDeductions = NEW_REGIME_STANDARD_DEDUCTION;

    return {
        grossSalary: Math.round(grossSalary),
        oldRegime: {
            deductions: Math.round(oldRegimeDeductions),
            taxableIncome: oldRegimeResult.taxableIncome,
            tax: oldRegimeResult.tax,
            surcharge: oldRegimeResult.surcharge,
            cess: oldRegimeResult.cess,
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
            totalTax: newRegimeResult.totalTax,
            netSalary: Math.round(grossSalary - newRegimeResult.totalTax),
        },
        savings: Math.round(newRegimeResult.totalTax - oldRegimeResult.totalTax),
        recommendedRegime: newRegimeResult.totalTax < oldRegimeResult.totalTax ? 'new' : 'old',
    };
}

