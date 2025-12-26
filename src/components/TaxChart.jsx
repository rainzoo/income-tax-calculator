import { Paper, Typography, Box } from '@mui/material';

export default function TaxChart({ summary }) {
  if (!summary) return null;

  // Calculate percentages for the recommended regime
  const recommendedRegime = summary.recommendedRegime === 'new' ? summary.newRegime : summary.oldRegime;
  const grossSalary = summary.grossSalary;
  const totalTax = recommendedRegime.totalTax;
  const netSalary = recommendedRegime.netSalary;

  const taxPercentage = Math.round((totalTax / grossSalary) * 100);
  const netPercentage = Math.round((netSalary / grossSalary) * 100);

  // Simple pie chart using SVG
  const size = 120;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const taxArc = (taxPercentage / 100) * circumference;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        Income Distribution
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="center" gap={4} flexWrap="wrap">
        {/* Pie Chart */}
        <Box position="relative">
          <svg width={size} height={size}>
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth={strokeWidth}
            />
            {/* Tax portion */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f44336"
              strokeWidth={strokeWidth}
              strokeDasharray={`${taxArc} ${circumference - taxArc}`}
              strokeDashoffset={0}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
          {/* Center text */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: 'translate(-50%, -50%)', textAlign: 'center' }}
          >
            <Typography variant="h6" fontWeight="bold">
              {taxPercentage}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tax
            </Typography>
          </Box>
        </Box>

        {/* Legend */}
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: '#4caf50',
                borderRadius: 1,
              }}
            />
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Net Salary: {netPercentage}%
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatCurrency(netSalary)}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: '#f44336',
                borderRadius: 1,
              }}
            />
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Tax: {taxPercentage}%
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatCurrency(totalTax)}
              </Typography>
            </Box>
          </Box>

          <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>Total Income:</strong> {formatCurrency(grossSalary)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Regime:</strong> {summary.recommendedRegime === 'new' ? 'New' : 'Old'} (Recommended)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
