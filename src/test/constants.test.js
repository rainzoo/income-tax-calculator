import { describe, expect, it } from "vitest";
import {
	DEDUCTION_LIMITS,
	FORM_CONSTANTS,
	HEALTH_EDUCATION_CESS_RATE,
	NEW_REGIME_SLABS,
	NEW_REGIME_STANDARD_DEDUCTION,
	OLD_REGIME_SLABS,
	OLD_REGIME_STANDARD_DEDUCTION,
	SECTION_87A_REBATE_AMOUNT,
	SECTION_87A_REBATE_LIMIT,
	SURCHARGE_RATES,
	TIME_CONSTANTS,
} from "../constants/taxRules.js";

describe("Tax Rules Constants", () => {
	describe("Tax Slabs", () => {
		it("should have correct old regime slabs", () => {
			expect(OLD_REGIME_SLABS).toEqual([
				{ min: 0, max: 250000, rate: 0 },
				{ min: 250001, max: 500000, rate: 5 },
				{ min: 500001, max: 1000000, rate: 20 },
				{ min: 1000001, max: Infinity, rate: 30 },
			]);
		});

		it("should have correct new regime slabs", () => {
			expect(NEW_REGIME_SLABS).toEqual([
				{ min: 0, max: 400000, rate: 0 },
				{ min: 400001, max: 800000, rate: 5 },
				{ min: 800001, max: 1200000, rate: 10 },
				{ min: 1200001, max: 1600000, rate: 15 },
				{ min: 1600001, max: 2000000, rate: 20 },
				{ min: 2000001, max: 2400000, rate: 25 },
				{ min: 2400001, max: Infinity, rate: 30 },
			]);
		});

		it("should have valid slab structures", () => {
			const allSlabs = [...OLD_REGIME_SLABS, ...NEW_REGIME_SLABS];

			allSlabs.forEach((slab) => {
				expect(slab).toHaveProperty("min");
				expect(slab).toHaveProperty("max");
				expect(slab).toHaveProperty("rate");
				expect(typeof slab.min).toBe("number");
				expect(typeof slab.max).toBe("number");
				expect(typeof slab.rate).toBe("number");
				expect(slab.min).toBeLessThanOrEqual(slab.max);
				expect(slab.rate).toBeGreaterThanOrEqual(0);
				expect(slab.rate).toBeLessThanOrEqual(100);
			});
		});
	});

	describe("Standard Deductions", () => {
		it("should have correct standard deduction values", () => {
			expect(NEW_REGIME_STANDARD_DEDUCTION).toBe(75000);
			expect(OLD_REGIME_STANDARD_DEDUCTION).toBe(50000);
		});

		it("should have positive standard deduction values", () => {
			expect(NEW_REGIME_STANDARD_DEDUCTION).toBeGreaterThan(0);
			expect(OLD_REGIME_STANDARD_DEDUCTION).toBeGreaterThan(0);
		});
	});

	describe("Section 87A Rebate", () => {
		it("should have correct rebate values", () => {
			expect(SECTION_87A_REBATE_LIMIT).toBe(1200000);
			expect(SECTION_87A_REBATE_AMOUNT).toBe(25000);
		});

		it("should have valid rebate structure", () => {
			expect(SECTION_87A_REBATE_LIMIT).toBeGreaterThan(0);
			expect(SECTION_87A_REBATE_AMOUNT).toBeGreaterThan(0);
			expect(SECTION_87A_REBATE_AMOUNT).toBeLessThan(SECTION_87A_REBATE_LIMIT);
		});
	});

	describe("Health and Education Cess", () => {
		it("should have correct cess rate", () => {
			expect(HEALTH_EDUCATION_CESS_RATE).toBe(4);
		});

		it("should be a valid percentage", () => {
			expect(HEALTH_EDUCATION_CESS_RATE).toBeGreaterThan(0);
			expect(HEALTH_EDUCATION_CESS_RATE).toBeLessThanOrEqual(100);
		});
	});

	describe("Surcharge Rates", () => {
		it("should have correct surcharge structure", () => {
			expect(Array.isArray(SURCHARGE_RATES)).toBe(true);
			expect(SURCHARGE_RATES.length).toBeGreaterThan(0);
		});

		it("should have valid surcharge rates", () => {
			SURCHARGE_RATES.forEach((rate) => {
				expect(rate).toHaveProperty("min");
				expect(rate).toHaveProperty("max");
				expect(rate).toHaveProperty("rate");
				expect(typeof rate.min).toBe("number");
				expect(typeof rate.max).toBe("number");
				expect(typeof rate.rate).toBe("number");
				expect(rate.min).toBeLessThan(rate.max);
				expect(rate.rate).toBeGreaterThanOrEqual(0);
				expect(rate.rate).toBeLessThanOrEqual(100);
			});
		});

		it("should have consecutive ranges", () => {
			for (let i = 0; i < SURCHARGE_RATES.length - 1; i++) {
				expect(SURCHARGE_RATES[i].max + 1).toBe(SURCHARGE_RATES[i + 1].min);
			}
		});
	});

	describe("Deduction Limits", () => {
		it("should have correct deduction limits", () => {
			expect(DEDUCTION_LIMITS).toEqual({
				SECTION_80C: 150000,
				SECTION_80D_SELF_FAMILY: 25000,
				SECTION_80D_PARENTS: 50000,
				SECTION_24B: 200000,
			});
		});

		it("should have positive deduction limits", () => {
			Object.values(DEDUCTION_LIMITS).forEach((limit) => {
				expect(limit).toBeGreaterThan(0);
			});
		});
	});

	describe("Form Constants", () => {
		it("should have correct HRA percentages", () => {
			expect(FORM_CONSTANTS.HRA_METRO_PERCENTAGE).toBe(0.5);
			expect(FORM_CONSTANTS.HRA_NON_METRO_PERCENTAGE).toBe(0.4);
		});

		it("should have correct rent deduction percentage", () => {
			expect(FORM_CONSTANTS.RENT_DEDUCTION_PERCENTAGE).toBe(0.1);
		});

		it("should have correct deduction limits", () => {
			expect(FORM_CONSTANTS.SECTION_80C_LIMIT).toBe(150000);
			expect(FORM_CONSTANTS.SECTION_24B_LIMIT).toBe(200000);
		});

		it("should have correct EPF percentage", () => {
			expect(FORM_CONSTANTS.EPF_EMPLOYEE_PERCENTAGE).toBe(0.12);
		});

		it("should have correct default values", () => {
			expect(FORM_CONSTANTS.DEFAULT_USD_EXCHANGE_RATE).toBe(83);
			expect(FORM_CONSTANTS.DEFAULT_US_TAX_WITHHOLDING).toBe(22);
		});

		it("should have valid percentage values", () => {
			expect(FORM_CONSTANTS.HRA_METRO_PERCENTAGE).toBeGreaterThan(0);
			expect(FORM_CONSTANTS.HRA_METRO_PERCENTAGE).toBeLessThanOrEqual(1);
			expect(FORM_CONSTANTS.HRA_NON_METRO_PERCENTAGE).toBeGreaterThan(0);
			expect(FORM_CONSTANTS.HRA_NON_METRO_PERCENTAGE).toBeLessThanOrEqual(1);
			expect(FORM_CONSTANTS.RENT_DEDUCTION_PERCENTAGE).toBeGreaterThan(0);
			expect(FORM_CONSTANTS.RENT_DEDUCTION_PERCENTAGE).toBeLessThanOrEqual(1);
			expect(FORM_CONSTANTS.EPF_EMPLOYEE_PERCENTAGE).toBeGreaterThan(0);
			expect(FORM_CONSTANTS.EPF_EMPLOYEE_PERCENTAGE).toBeLessThanOrEqual(1);
		});
	});

	describe("Time Constants", () => {
		it("should have correct time constants", () => {
			expect(TIME_CONSTANTS).toEqual({
				MONTHS_IN_YEAR: 12,
				QUARTERS_IN_YEAR: 4,
			});
		});

		it("should have positive time values", () => {
			expect(TIME_CONSTANTS.MONTHS_IN_YEAR).toBeGreaterThan(0);
			expect(TIME_CONSTANTS.QUARTERS_IN_YEAR).toBeGreaterThan(0);
		});

		it("should have logical relationship between quarters and months", () => {
			expect(TIME_CONSTANTS.MONTHS_IN_YEAR).toBe(
				TIME_CONSTANTS.QUARTERS_IN_YEAR * 3,
			);
		});
	});

	describe("Consistency Checks", () => {
		it("should have consistent deduction limits", () => {
			expect(FORM_CONSTANTS.SECTION_80C_LIMIT).toBe(
				DEDUCTION_LIMITS.SECTION_80C,
			);
			expect(FORM_CONSTANTS.SECTION_24B_LIMIT).toBe(
				DEDUCTION_LIMITS.SECTION_24B,
			);
		});

		it("should have valid tax slab progressions", () => {
			// Check that slab rates increase or stay the same
			for (let i = 1; i < OLD_REGIME_SLABS.length; i++) {
				expect(OLD_REGIME_SLABS[i].rate).toBeGreaterThanOrEqual(
					OLD_REGIME_SLABS[i - 1].rate,
				);
			}

			for (let i = 1; i < NEW_REGIME_SLABS.length; i++) {
				expect(NEW_REGIME_SLABS[i].rate).toBeGreaterThanOrEqual(
					NEW_REGIME_SLABS[i - 1].rate,
				);
			}
		});

		it("should have valid slab boundaries", () => {
			// Check that slabs don't overlap and cover consecutive ranges
			for (let i = 1; i < OLD_REGIME_SLABS.length; i++) {
				expect(OLD_REGIME_SLABS[i].min).toBe(OLD_REGIME_SLABS[i - 1].max + 1);
			}

			for (let i = 1; i < NEW_REGIME_SLABS.length; i++) {
				expect(NEW_REGIME_SLABS[i].min).toBe(NEW_REGIME_SLABS[i - 1].max + 1);
			}
		});
	});
});
