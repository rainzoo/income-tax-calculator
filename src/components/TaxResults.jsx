import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';

export default function TaxResults({ summary }) {
  if (!summary) return null;

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isNewRegimeBetter = summary.recommendedRegime === 'new';
  const savings = Math.abs(summary.savings);

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <AccountBalanceWalletIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Annual Tax Summary
          </Typography>
        </Box>

        {/* RSU Summary */}
        {summary.rsu && summary.rsu.grossRSU > 0 && (
          <Card
            sx={{
              mb: 4,
              bgcolor: 'warning.light',
              border: '1px solid',
              borderColor: 'warning.main',
              '&:hover': { boxShadow: 3 }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon sx={{ mr: 2, color: 'warning.dark' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                  RSU Income Summary
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Gross RSU Value
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {formatCurrency(summary.rsu.grossRSU)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    US Tax Withheld
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                    {formatCurrency(summary.rsu.usTaxWithheld)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Net RSU Received
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {formatCurrency(summary.rsu.netRSU)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    DTAA Credit
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                    {formatCurrency(summary.rsu.dtaaCredit)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                DTAA credit reduces your Indian tax liability by the amount of US taxes paid on RSU income.
              </Typography>
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
          {/* Old Regime Card */}
          <Card
            sx={{
              border: 2,
              borderColor: !isNewRegimeBetter ? 'success.main' : 'grey.300',
              bgcolor: !isNewRegimeBetter ? 'success.50' : 'background.paper',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Old Regime
                </Typography>
                {!isNewRegimeBetter && (
                  <Chip
                    label="Recommended"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Gross Salary:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(summary.grossSalary)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Deductions:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                    -{formatCurrency(summary.oldRegime.deductions)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Taxable Income:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(summary.oldRegime.taxableIncome)}</Typography>
                </Box>

                <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Income Tax:</Typography>
                    <Typography variant="body2">{formatCurrency(summary.oldRegime.tax)}</Typography>
                  </Box>
                  {summary.oldRegime.surcharge > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Surcharge:</Typography>
                      <Typography variant="body2">{formatCurrency(summary.oldRegime.surcharge)}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Cess (4%):</Typography>
                    <Typography variant="body2">{formatCurrency(summary.oldRegime.cess)}</Typography>
                  </Box>
                  {summary.oldRegime.dtaaCredit > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'info.main' }}>DTAA Credit:</Typography>
                      <Typography variant="body2" sx={{ color: 'info.main' }}>
                        -{formatCurrency(summary.oldRegime.dtaaCredit)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>Total Tax:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'error.main' }}>
                      {formatCurrency(summary.oldRegime.totalTax)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Net Salary:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {formatCurrency(summary.oldRegime.netSalary)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* New Regime Card */}
          <Card
            sx={{
              border: 2,
              borderColor: isNewRegimeBetter ? 'success.main' : 'grey.300',
              bgcolor: isNewRegimeBetter ? 'success.50' : 'background.paper',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  New Regime
                </Typography>
                {isNewRegimeBetter && (
                  <Chip
                    label="Recommended"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Gross Salary:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(summary.grossSalary)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Standard Deduction:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                    -{formatCurrency(summary.newRegime.deductions)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Taxable Income:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(summary.newRegime.taxableIncome)}</Typography>
                </Box>

                <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Income Tax:</Typography>
                    <Typography variant="body2">{formatCurrency(summary.newRegime.tax + summary.newRegime.rebate)}</Typography>
                  </Box>
                  {summary.newRegime.rebate > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'success.main' }}>Section 87A Rebate:</Typography>
                      <Typography variant="body2" sx={{ color: 'success.main' }}>
                        -{formatCurrency(summary.newRegime.rebate)}
                      </Typography>
                    </Box>
                  )}
                  {summary.newRegime.surcharge > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Surcharge:</Typography>
                      <Typography variant="body2">{formatCurrency(summary.newRegime.surcharge)}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Cess (4%):</Typography>
                    <Typography variant="body2">{formatCurrency(summary.newRegime.cess)}</Typography>
                  </Box>
                  {summary.newRegime.dtaaCredit > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'info.main' }}>DTAA Credit:</Typography>
                      <Typography variant="body2" sx={{ color: 'info.main' }}>
                        -{formatCurrency(summary.newRegime.dtaaCredit)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>Total Tax:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'error.main' }}>
                      {formatCurrency(summary.newRegime.totalTax)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Net Salary:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {formatCurrency(summary.newRegime.netSalary)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Savings Comparison */}
        <Card
          sx={{
            bgcolor: isNewRegimeBetter ? 'success.50' : 'info.50',
            border: 2,
            borderColor: isNewRegimeBetter ? 'success.main' : 'info.main',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-1px)', boxShadow: 3 }
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <SavingsIcon sx={{ mr: 1, color: isNewRegimeBetter ? 'success.main' : 'info.main' }} />
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                {isNewRegimeBetter ? 'You save' : 'You pay more'} with New Regime:
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: isNewRegimeBetter ? 'success.main' : 'error.main',
                mb: 2
              }}
            >
              {isNewRegimeBetter ? '+' : '-'}{formatCurrency(savings)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isNewRegimeBetter
                ? 'New Regime is more beneficial for you'
                : 'Old Regime is more beneficial for you'}
            </Typography>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
