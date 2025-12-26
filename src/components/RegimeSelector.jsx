import { Box, ToggleButton, ToggleButtonGroup, Typography, Paper } from '@mui/material';
import { AccountBalance, Receipt } from '@mui/icons-material';

export default function RegimeSelector({ regime, onChange }) {
    const handleChange = (event, newRegime) => {
        if (newRegime !== null) {
            onChange(newRegime);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="semibold" gutterBottom>
                Select Tax Regime for Monthly Breakdown
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose which regime to display in the month-wise breakdown
            </Typography>
            <ToggleButtonGroup
                value={regime}
                exclusive
                onChange={handleChange}
                aria-label="tax regime"
                fullWidth
                sx={{ mt: 2 }}
            >
                <ToggleButton value="old" aria-label="old regime" sx={{ py: 1.5 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Receipt />
                        <Box textAlign="left">
                            <Typography variant="body1" fontWeight="medium">Old Regime</Typography>
                            <Typography variant="caption" color="text.secondary">
                                With deductions
                            </Typography>
                        </Box>
                    </Box>
                </ToggleButton>
                <ToggleButton value="new" aria-label="new regime" sx={{ py: 1.5 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <AccountBalance />
                        <Box textAlign="left">
                            <Typography variant="body1" fontWeight="medium">New Regime</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Standard deduction
                            </Typography>
                        </Box>
                    </Box>
                </ToggleButton>
            </ToggleButtonGroup>
        </Paper>
    );
}
