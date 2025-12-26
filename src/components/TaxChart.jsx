import { Card, CardContent, Typography, Box } from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';

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
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <PieChartIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Income Distribution
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* Enhanced Pie Chart */}
          <Box sx={{ position: 'relative' }}>
            <svg width={size} height={size} style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))' }}>
              {/* Background circle with gradient */}
              <defs>
                <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#f5f5f5', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#e0e0e0', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="taxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#f44336', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#d32f2f', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="netGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#4caf50', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#2e7d32', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#backgroundGradient)"
                strokeWidth={strokeWidth}
              />

              {/* Net salary portion (background) */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#netGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} 0`}
                strokeDashoffset={0}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />

              {/* Tax portion (overlay) */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#taxGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${taxArc} ${circumference - taxArc}`}
                strokeDashoffset={0}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dasharray 0.8s ease-in-out' }}
              />
            </svg>

            {/* Center text with enhanced styling */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'error.main', lineHeight: 1 }}>
                {taxPercentage}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }}>
                Tax
              </Typography>
            </Box>
          </Box>

          {/* Enhanced Legend */}
          <Box sx={{ minWidth: 280 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Net Salary */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'success.50',
                  border: '1px solid',
                  borderColor: 'success.200',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-1px)', boxShadow: 2 }
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                    borderRadius: 1,
                    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    Net Salary: {netPercentage}%
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.dark' }}>
                    {formatCurrency(netSalary)}
                  </Typography>
                </Box>
              </Box>

              {/* Tax */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'error.50',
                  border: '1px solid',
                  borderColor: 'error.200',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-1px)', boxShadow: 2 }
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                    borderRadius: 1,
                    boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                    Tax: {taxPercentage}%
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.dark' }}>
                    {formatCurrency(totalTax)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Summary Card */}
            <Card
              sx={{
                mt: 3,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 2 }
              }}
            >
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                  💰 Total Income: {formatCurrency(grossSalary)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  🎯 Regime: {summary.recommendedRegime === 'new' ? 'New' : 'Old'} (Recommended)
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
