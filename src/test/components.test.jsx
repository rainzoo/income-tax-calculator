import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material'
import SalaryInputForm from '../components/SalaryInputForm.jsx'
import TaxResults from '../components/TaxResults.jsx'
import TaxChart from '../components/TaxChart.jsx'
import ComparisonTable from '../components/ComparisonTable.jsx'

// Create theme for MUI components
const theme = createTheme()

// Wrapper component for MUI theme
const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
)

describe('React Components', () => {
  describe('SalaryInputForm', () => {
    const mockOnCalculate = vi.fn()

    beforeEach(() => {
      mockOnCalculate.mockClear()
    })

    it('should render all form fields', () => {
      render(
        <TestWrapper>
          <SalaryInputForm onCalculate={mockOnCalculate} />
        </TestWrapper>
      )

      expect(screen.getByLabelText(/basic salary/i)).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /hra/i })).toBeInTheDocument()
      expect(screen.getByText(/auto-calculate hra/i)).toBeInTheDocument()
      expect(screen.getByText(/calculate tax/i)).toBeInTheDocument()
    })

    it('should format currency inputs correctly', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <SalaryInputForm onCalculate={mockOnCalculate} />
        </TestWrapper>
      )

      const basicSalaryInput = screen.getByLabelText(/basic salary/i)

      // Type a number
      await user.clear(basicSalaryInput)
      await user.type(basicSalaryInput, '500000')

      // Should be formatted as 5,00,000
      expect(basicSalaryInput.value).toBe('5,00,000')
    })

    it('should handle HRA auto-calculation', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <SalaryInputForm onCalculate={mockOnCalculate} />
        </TestWrapper>
      )

      const basicSalaryInput = screen.getByLabelText(/basic salary/i)
      const autoCalculateCheckbox = screen.getByLabelText(/auto-calculate hra/i)
      const hraInput = screen.getByRole('textbox', { name: /hra/i })

      // Enter basic salary
      await user.clear(basicSalaryInput)
      await user.type(basicSalaryInput, '500000')

      // Check auto-calculate
      await user.click(autoCalculateCheckbox)

      // Now the metro city checkbox should be visible (there are two, we want the one in the salary section)
      const metroCityCheckboxes = screen.getAllByLabelText(/living in metro city/i)
      const metroCityCheckbox = metroCityCheckboxes[0] // First one is in salary components

      // Check metro city
      await user.click(metroCityCheckbox)

      // HRA should be calculated as 50% of basic = 2,50,000
      expect(hraInput.value).toBe('2,50,000')
    })

    it('should submit form with correct data', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <SalaryInputForm onCalculate={mockOnCalculate} />
        </TestWrapper>
      )

      const basicSalaryInput = screen.getByLabelText(/basic salary/i)
      const submitButton = screen.getByText(/calculate tax/i)

      // Enter basic salary
      await user.clear(basicSalaryInput)
      await user.type(basicSalaryInput, '600000')

      // Submit form
      await user.click(submitButton)

      expect(mockOnCalculate).toHaveBeenCalledWith(
        expect.objectContaining({
          basicSalary: 600000,
        })
      )
    })

    it('should handle form validation', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <SalaryInputForm onCalculate={mockOnCalculate} />
        </TestWrapper>
      )

      const submitButton = screen.getByText(/calculate tax/i)

      // Try to submit without basic salary
      await user.click(submitButton)

      // Should not call onCalculate since basic salary is required
      expect(mockOnCalculate).not.toHaveBeenCalled()
    })
  })



  describe('ComparisonTable', () => {
    const mockSummary = {
      grossSalary: 600000,
      oldRegime: {
        deductions: 50000,
        taxableIncome: 550000,
        tax: 20000,
        surcharge: 0,
        cess: 800,
        totalTax: 20800,
        netSalary: 579200,
      },
      newRegime: {
        deductions: 75000,
        taxableIncome: 525000,
        tax: 15000,
        rebate: 0,
        surcharge: 0,
        cess: 600,
        totalTax: 15600,
        netSalary: 584400,
      },
      savings: 5200,
      recommendedRegime: 'new',
    }

    it('should render comparison table correctly', () => {
      render(
        <TestWrapper>
          <ComparisonTable summary={mockSummary} />
        </TestWrapper>
      )

      expect(screen.getByText('Regime Comparison')).toBeInTheDocument()
      expect(screen.getAllByText('Old Regime')).toHaveLength(2) // Header and insights
      expect(screen.getAllByText('New Regime')).toHaveLength(2) // Header and insights
      expect(screen.getAllByText('₹6,00,000')).toHaveLength(2) // Gross salary appears in 2 columns
    })

    it('should show correct difference calculations', () => {
      render(
        <TestWrapper>
          <ComparisonTable summary={mockSummary} />
        </TestWrapper>
      )

      // New regime has higher deductions (75000 vs 50000)
      // Should show +₹25,000 difference in deductions
      expect(screen.getByText('+₹25,000')).toBeInTheDocument()
    })

    it('should not render when no summary provided', () => {
      const { container } = render(
        <TestWrapper>
          <ComparisonTable summary={null} />
        </TestWrapper>
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Integration Tests', () => {
    it('should handle complete tax calculation flow', async () => {
      const user = userEvent.setup()
      const mockOnCalculate = vi.fn()

      render(
        <TestWrapper>
          <SalaryInputForm onCalculate={mockOnCalculate} />
        </TestWrapper>
      )

      // Fill out the form
      const basicSalaryInput = screen.getByLabelText(/basic salary/i)
      const section80CInput = screen.getByLabelText(/section 80c/i)
      const submitButton = screen.getByText(/calculate tax/i)

      await user.clear(basicSalaryInput)
      await user.type(basicSalaryInput, '1000000') // ₹10 lakhs

      await user.clear(section80CInput)
      await user.type(section80CInput, '150000') // Max 80C deduction

      await user.click(submitButton)

      expect(mockOnCalculate).toHaveBeenCalledWith(
        expect.objectContaining({
          basicSalary: 1000000,
          section80C: 150000,
        })
      )
    })

    it('should handle edge cases in form input', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <SalaryInputForm onCalculate={vi.fn()} />
        </TestWrapper>
      )

      const basicSalaryInput = screen.getByLabelText(/basic salary/i)

      // Test with commas already in input
      await user.clear(basicSalaryInput)
      await user.type(basicSalaryInput, '5,00,000')

      expect(basicSalaryInput.value).toBe('5,00,000')
    })
  })
})
