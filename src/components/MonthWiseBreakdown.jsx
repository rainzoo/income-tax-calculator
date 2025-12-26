import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
} from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

export default function MonthWiseBreakdown({ monthlyData, selectedRegime }) {
  if (!monthlyData || monthlyData.length === 0) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isOldRegime = selectedRegime === 'old';
  const lastMonth = monthlyData[monthlyData.length - 1];

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <CalendarMonth sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Month-wise Breakdown
            </Typography>
            <Chip
              label={isOldRegime ? 'Old Regime' : 'New Regime'}
              color={isOldRegime ? 'error' : 'primary'}
              size="small"
              sx={{ mt: 1, fontWeight: 600 }}
            />
          </Box>
        </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                  bgcolor: 'background.paper',
                  fontWeight: 'bold',
                }}
              >
                Month
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Basic
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                HRA
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Allowances
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                RSU (Net)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'grey.200', color: 'grey.800' }}>
                Gross Salary
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'error.main', color: 'error.contrastText' }}>
                Income Tax
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'info.main', color: 'info.contrastText' }}>
                Provident Fund
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'success.main', color: 'success.contrastText' }}>
                Net Salary
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyData.map((month, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                <TableCell
                  sx={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 2,
                    bgcolor: 'inherit',
                    fontWeight: 'medium',
                  }}
                >
                  {month.month}
                </TableCell>
                <TableCell align="right">{formatCurrency(month.basic)}</TableCell>
                <TableCell align="right">{formatCurrency(month.hra)}</TableCell>
                <TableCell align="right">{formatCurrency(month.allowances)}</TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: month.hasRSUPayout ? 'bold' : 'normal',
                    bgcolor: month.hasRSUPayout ? 'warning.50' : 'transparent',
                    color: month.hasRSUPayout ? 'warning.dark' : 'inherit',
                  }}
                >
                  {month.hasRSUPayout ? formatCurrency(month.netRSU) : '—'}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'semibold', bgcolor: 'grey.50' }}>
                  {formatCurrency(month.grossSalary)}
                </TableCell>
                <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'medium' }}>
                  {formatCurrency(isOldRegime ? month.incomeTaxOld : month.incomeTaxNew)}
                </TableCell>
                <TableCell align="right" sx={{ color: 'info.main', fontWeight: 'medium' }}>
                  {formatCurrency(month.providentFund)}
                </TableCell>
                <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                  {formatCurrency(isOldRegime ? month.netSalaryOld : month.netSalaryNew)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Annual Summary */}
      <Box mt={4} p={3} bgcolor="grey.50" borderRadius={2}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Annual Summary
        </Typography>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Gross Salary
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(lastMonth.cumulativeGrossSalary)}
            </Typography>
          </Box>
          {lastMonth.cumulativeGrossRSU > 0 && (
            <>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total RSU (Gross)
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="warning.main">
                  {formatCurrency(lastMonth.cumulativeGrossRSU)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  US Tax Withheld
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="error.main">
                  {formatCurrency(lastMonth.cumulativeUSTaxWithheld)}
                </Typography>
              </Box>
            </>
          )}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Income Tax
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="error.main">
              {formatCurrency(isOldRegime ? lastMonth.cumulativeOldTax : lastMonth.cumulativeNewTax)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Provident Fund
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="info.main">
              {formatCurrency(lastMonth.cumulativeProvidentFund)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Net Salary (Annual)
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {formatCurrency(
                isOldRegime
                  ? lastMonth.cumulativeGrossSalary - lastMonth.cumulativeOldTax - lastMonth.cumulativeProvidentFund
                  : lastMonth.cumulativeGrossSalary - lastMonth.cumulativeNewTax - lastMonth.cumulativeProvidentFund
              )}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={3}>
        <Typography variant="caption" color="text.secondary">
          <strong>Note:</strong> Tax is calculated on an annual basis and distributed evenly across 12 months.
          Provident Fund is calculated as 12% of basic salary (employee contribution).
        </Typography>
      </Box>
      </CardContent>
    </Card>
  );
}
