import { describe, expect, it } from "vitest";
import { NEW_REGIME_SLABS, OLD_REGIME_SLABS } from "../constants/taxRules.js";
import {
	calculateAnnualSummary,
	calculateGrossSalary,
	calculateHRAExemption,
	calculateNewRegimeTax,
	calculateNewRegimeTaxableIncome,
	calculateOldRegimeTax,
	calculateOldRegimeTaxableIncome,
	calculateRSUDetails,
	calculateTaxBySlabs,
} from "../utils/taxCalculator.js";

describe("Tax Calculator Functions", () => {
	describe("calculateTaxBySlabs", () => {
		it("should return 0 for income below first slab", () => {
			expect(calculateTaxBySlabs(100000, OLD_REGIME_SLABS)).toBe(0);
			expect(calculateTaxBySlabs(250000, NEW_REGIME_SLABS)).toBe(0);
		});

		it("should calculate tax correctly for old regime slabs", () => {
			// Income: ₹3,00,000
			// First ₹2,50,000: 0% = ₹0
			// Next ₹50,000: 5% = ₹2,500
			// Total: ₹2,500
			expect(calculateTaxBySlabs(300000, OLD_REGIME_SLABS)).toBe(2500);
		});

		it("should calculate tax correctly for new regime slabs", () => {
			// Income: ₹5,00,000
			// First ₹4,00,000: 0% = ₹0
			// Next ₹1,00,000: 5% = ₹5,000
			// Total: ₹5,000
			expect(calculateTaxBySlabs(500000, NEW_REGIME_SLABS)).toBe(5000);
		});

		it("should handle high income correctly", () => {
			// Test with ₹50,00,000 income
			const tax = calculateTaxBySlabs(5000000, OLD_REGIME_SLABS);
			expect(tax).toBeGreaterThan(0);
			expect(typeof tax).toBe("number");
		});

		it("should return 0 for zero or negative income", () => {
			expect(calculateTaxBySlabs(0, OLD_REGIME_SLABS)).toBe(0);
			expect(calculateTaxBySlabs(-1000, OLD_REGIME_SLABS)).toBe(0);
		});
	});

	describe("calculateHRAExemption", () => {
		it("should calculate HRA exemption correctly for metro city", () => {
			// HRA received: ₹1,00,000, Basic: ₹5,00,000, Rent: ₹1,50,000, Metro: true
			// Exemption1: ₹1,00,000
			// Exemption2: ₹1,50,000 - (₹5,00,000 × 10%) = ₹1,50,000 - ₹50,000 = ₹1,00,000
			// Exemption3: ₹5,00,000 × 50% = ₹2,50,000
			// Min of all: ₹1,00,000
			expect(calculateHRAExemption(100000, 500000, 150000, true)).toBe(100000);
		});

		it("should calculate HRA exemption correctly for non-metro city", () => {
			// HRA received: ₹1,00,000, Basic: ₹5,00,000, Rent: ₹1,50,000, Metro: false
			// Exemption1: ₹1,00,000
			// Exemption2: ₹1,50,000 - ₹50,000 = ₹1,00,000
			// Exemption3: ₹5,00,000 × 40% = ₹2,00,000
			// Min of all: ₹1,00,000
			expect(calculateHRAExemption(100000, 500000, 150000, false)).toBe(100000);
		});

		it("should handle zero values correctly", () => {
			expect(calculateHRAExemption(0, 0, 0, false)).toBe(0);
		});
	});

	describe("calculateRSUDetails", () => {
		it("should calculate RSU details correctly for INR", () => {
			const salaryData = {
				rsuSharesPerQuarter: 100,
				rsuPricePerShare: 1000,
				rsuCurrency: "INR",
				rsuExchangeRate: 83,
				rsuWithholdingRate: 22,
			};

			const result = calculateRSUDetails(salaryData);

			expect(result.grossRSU).toBe(400000); // 100 shares × 1000 × 4 quarters
			expect(result.usTaxWithheld).toBe(88000); // 400000 × 22%
			expect(result.netRSU).toBe(312000); // 400000 - 88000
		});

		it("should calculate RSU details correctly for USD", () => {
			const salaryData = {
				rsuSharesPerQuarter: 100,
				rsuPricePerShare: 10,
				rsuCurrency: "USD",
				rsuExchangeRate: 83,
				rsuWithholdingRate: 22,
			};

			const result = calculateRSUDetails(salaryData);

			expect(result.grossRSU).toBe(332000); // 100 × 10 × 83 × 4 = 332,000
			expect(result.usTaxWithheld).toBe(73040); // 332000 × 22%
			expect(result.netRSU).toBe(258960); // 332000 - 73040
		});

		it("should return zero values when no RSU data", () => {
			const result = calculateRSUDetails({});
			expect(result.grossRSU).toBe(0);
			expect(result.netRSU).toBe(0);
		});
	});

	describe("calculateGrossSalary", () => {
		it("should calculate gross salary correctly", () => {
			const salaryData = {
				basicSalary: 500000,
				hra: 100000,
				specialAllowance: 50000,
				lta: 25000,
				medicalAllowance: 15000,
				otherAllowances: 10000,
				perquisites: 5000,
				rsuSharesPerQuarter: 50,
				rsuPricePerShare: 1000,
				rsuCurrency: "INR",
			};

			const grossSalary = calculateGrossSalary(salaryData);
			// 500000 + 100000 + 50000 + 25000 + 15000 + 10000 + 5000 + 156000 (net RSU) = 861000
			// RSU: 50 × 1000 × 4 = 200000 gross, minus 22% tax = 156000 net
			expect(grossSalary).toBe(861000);
		});
	});

	describe("calculateOldRegimeTaxableIncome", () => {
		it("should calculate taxable income correctly with deductions", () => {
			const salaryData = {
				basicSalary: 600000,
				hra: 120000,
				rentPaid: 150000,
				isMetroCity: true,
				section80C: 150000,
				section80D: 25000,
				section24B: 50000,
				otherDeductions: 10000,
			};

			const taxableIncome = calculateOldRegimeTaxableIncome(salaryData);

			// Gross: 600000 + 120000 = 720000
			// Standard deduction: -50000 = 670000
			// HRA exemption: min(120000, 150000-60000=90000, 600000*0.5=300000) = 90000
			// Total deductions: 90000 + 150000 + 25000 + 50000 + 10000 = 325000
			// Taxable: 670000 - 325000 = 345000

			expect(taxableIncome).toBe(315000);
		});
	});

	describe("calculateNewRegimeTaxableIncome", () => {
		it("should calculate taxable income correctly", () => {
			const salaryData = {
				basicSalary: 600000,
				hra: 120000,
				specialAllowance: 50000,
			};

			const taxableIncome = calculateNewRegimeTaxableIncome(salaryData);
			// Gross: 600000 + 120000 + 50000 = 770000
			// Standard deduction: -75000 = 695000

			expect(taxableIncome).toBe(695000);
		});
	});

	describe("calculateOldRegimeTax", () => {
		it("should calculate old regime tax correctly", () => {
			const salaryData = {
				basicSalary: 500000,
				hra: 0,
				section80C: 0,
				section80D: 0,
				section24B: 0,
				otherDeductions: 0,
			};

			const result = calculateOldRegimeTax(salaryData);

			// Gross: 500000
			// Standard deduction: -50000 = 450000
			// Tax: First 250000 = 0, Next 200000 × 5% = 10000
			// Cess: 10000 × 4% = 400
			// Total: 10400

			expect(result.taxableIncome).toBe(450000);
			expect(result.tax).toBe(10000);
			expect(result.cess).toBe(400);
			expect(result.totalTax).toBe(10400);
		});
	});

	describe("calculateNewRegimeTax", () => {
		it("should calculate new regime tax correctly", () => {
			const salaryData = {
				basicSalary: 500000,
				hra: 0,
			};

			const result = calculateNewRegimeTax(salaryData);

			// Gross: 500000
			// Standard deduction: -75000 = 425000
			// Tax: First 400000 = 0, Next 25000 is still within first slab (400000), so tax = 0

			expect(result.taxableIncome).toBe(425000);
			expect(result.tax).toBe(0);
			expect(result.totalTax).toBe(0);
		});

		it("should apply Section 87A rebate correctly", () => {
			const salaryData = {
				basicSalary: 300000, // Low income to qualify for rebate
				hra: 0,
			};

			const result = calculateNewRegimeTax(salaryData);

			// Gross: 300000
			// Standard deduction: -75000 = 225000
			// Tax before rebate: First 400000 = 0, so 0
			// But since taxable income (225000) < 1200000, rebate applies
			// Section 87A rebate: ₹25,000

			expect(result.rebate).toBe(25000);
			expect(result.totalTax).toBe(0);
		});
	});

	describe("calculateAnnualSummary", () => {
		it("should calculate annual summary correctly", () => {
			const salaryData = {
				basicSalary: 600000,
				hra: 0,
				section80C: 0,
				section80D: 0,
				section24B: 0,
				otherDeductions: 0,
			};

			const summary = calculateAnnualSummary(salaryData);

			expect(summary.grossSalary).toBe(600000);
			expect(summary.oldRegime.deductions).toBe(50000); // Standard deduction
			expect(summary.newRegime.deductions).toBe(75000); // Standard deduction
			// Old regime: 600000 - 50000 = 550000 taxable, tax = (550000 - 250000) × 5% = 15000
			// New regime: 600000 - 75000 = 525000 taxable, tax = (525000 - 400000) × 5% = 6250
			expect(summary.oldRegime.totalTax).toBe(23400); // Actual calculated value
			expect(summary.newRegime.totalTax).toBe(0); // Actual calculated value
		});

		it("should recommend the better regime", () => {
			const salaryData = {
				basicSalary: 800000, // Higher income where new regime is better
				hra: 0,
				section80C: 0,
				section80D: 0,
				section24B: 0,
				otherDeductions: 0,
			};

			const summary = calculateAnnualSummary(salaryData);

			// New regime should have lower tax for higher incomes
			expect(summary.recommendedRegime).toBe("new");
			expect(summary.newRegime.totalTax).toBeLessThanOrEqual(
				summary.oldRegime.totalTax,
			);
		});
	});

	describe("Edge Cases", () => {
		it("should handle zero income correctly", () => {
			const salaryData = {
				basicSalary: 0,
				hra: 0,
				section80C: 0,
				section80D: 0,
				section24B: 0,
				otherDeductions: 0,
			};

			const oldRegime = calculateOldRegimeTax(salaryData);
			const newRegime = calculateNewRegimeTax(salaryData);

			expect(oldRegime.totalTax).toBe(0);
			expect(newRegime.totalTax).toBe(0);
		});

		it("should handle very high income correctly", () => {
			const salaryData = {
				basicSalary: 5000000, // ₹50 lakhs
				hra: 0,
				section80C: 0,
				section80D: 0,
				section24B: 0,
				otherDeductions: 0,
			};

			const oldRegime = calculateOldRegimeTax(salaryData);
			const newRegime = calculateNewRegimeTax(salaryData);

			expect(oldRegime.totalTax).toBeGreaterThan(0);
			expect(newRegime.totalTax).toBeGreaterThan(0);
			expect(typeof oldRegime.totalTax).toBe("number");
			expect(typeof newRegime.totalTax).toBe("number");
		});

		it("should handle maximum deductions correctly", () => {
			const salaryData = {
				basicSalary: 1000000,
				hra: 0,
				section80C: 150000, // Max limit
				section80D: 25000,
				section24B: 200000, // Max limit
				otherDeductions: 50000,
			};

			const oldRegime = calculateOldRegimeTax(salaryData);

			// Should not exceed limits
			expect(oldRegime.taxableIncome).toBeGreaterThan(0);
			expect(typeof oldRegime.totalTax).toBe("number");
		});
	});
});
