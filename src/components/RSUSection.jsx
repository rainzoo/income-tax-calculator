import { memo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const RSUSection = memo(function RSUSection({
  formData,
  handleChange,
  setFormData
}) {
  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        bgcolor: 'warning.light',
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <TrendingUp sx={{ mr: 2, color: 'warning.main', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" fontWeight="semibold">
            RSU (Restricted Stock Units)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quarterly payouts from US-based company
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Number of Shares per Quarter"
            name="rsuSharesPerQuarter"
            value={formData.rsuSharesPerQuarter}
            onChange={handleChange}
            type="number"
            helperText="RSU shares vested each quarter"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Price per Share"
            name="rsuPricePerShare"
            value={formData.rsuPricePerShare}
            onChange={handleChange}
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">
                {formData.rsuCurrency === 'USD' ? '$' : '₹'}
              </InputAdornment>,
            }}
            helperText="Vesting price per share"
          />
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              name="rsuCurrency"
              value={formData.rsuCurrency}
              onChange={handleChange}
              label="Currency"
            >
              <MenuItem value="INR">INR (Indian Rupee)</MenuItem>
              <MenuItem value="USD">USD (US Dollar)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {formData.rsuCurrency === 'USD' && (
          <Grid size={12}>
            <TextField
              fullWidth
              label="USD to INR Exchange Rate"
              name="rsuExchangeRate"
              value={formData.rsuExchangeRate}
              onChange={handleChange}
              type="number"
              helperText="Current exchange rate"
            />
          </Grid>
        )}

        <Grid size={12}>
          <TextField
            fullWidth
            label="US Tax Withholding Rate (%)"
            name="rsuWithholdingRate"
            value={formData.rsuWithholdingRate}
            onChange={handleChange}
            type="number"
            helperText="Default: 22% for supplemental income"
          />
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <InputLabel>Quarterly Payout Months</InputLabel>
            <Select
              multiple
              name="rsuQuarterlyMonths"
              value={formData.rsuQuarterlyMonths}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  rsuQuarterlyMonths: typeof e.target.value === 'string'
                    ? e.target.value.split(',')
                    : e.target.value,
                }));
              }}
              label="Quarterly Payout Months"
              renderValue={(selected) => selected.join(', ')}
            >
              <MenuItem value="March">March (Q1)</MenuItem>
              <MenuItem value="June">June (Q2)</MenuItem>
              <MenuItem value="September">September (Q3)</MenuItem>
              <MenuItem value="December">December (Q4)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
});

RSUSection.displayName = 'RSUSection';

export default RSUSection;
