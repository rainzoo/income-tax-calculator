import {
  Box,
  Typography,
  TextField,
  Grid,
  Divider,
  InputAdornment,
} from '@mui/material';
import { Home } from '@mui/icons-material';

export default function HRAExemptionSection({
  formData,
  handleChange,
  getDisplayValue
}) {
  // Only render if HRA is provided and greater than 0
  if (!formData.hra || parseFloat(formData.hra) <= 0) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        bgcolor: 'success.light',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <Home sx={{ mr: 2, color: 'success.main', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" fontWeight="semibold">
            HRA Exemption Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Required for calculating HRA tax exemption
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Annual Rent Paid"
            name="rentPaid"
            value={getDisplayValue('rentPaid', formData.rentPaid)}
            onChange={handleChange}
            type="text"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            helperText="Total rent paid in the financial year"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
