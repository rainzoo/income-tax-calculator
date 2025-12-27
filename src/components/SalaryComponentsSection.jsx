import { memo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Divider,
  InputAdornment,
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';

const SalaryComponentsSection = memo(function SalaryComponentsSection({
  formData,
  handleChange,
  getDisplayValue
}) {
  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        bgcolor: 'primary.light',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <AccountBalance sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" fontWeight="semibold">
            Salary Components
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter all components of your annual salary
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid xs={12}>
          <TextField
            fullWidth
            required
            label="Basic Salary (Annual)"
            name="basicSalary"
            value={getDisplayValue('basicSalary', formData.basicSalary)}
            onChange={handleChange}
            type="text"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            helperText="Your base annual salary"
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid xs={12}>
          <TextField
            fullWidth
            label="House Rent Allowance (HRA)"
            name="hra"
            value={getDisplayValue('hra', formData.hra)}
            onChange={handleChange}
            type="text"
            disabled={formData.autoCalculateHRA}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            helperText={
              formData.autoCalculateHRA
                ? `Auto-calculated: ${formData.isMetroCity ? '50%' : '40%'} of basic`
                : ''
            }
          />
        </Grid>

        <Grid xs={12}>
          <Box display="flex" flexDirection="row" gap={2} alignItems="center" sx={{ mt: 1, mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.autoCalculateHRA}
                  onChange={handleChange}
                  name="autoCalculateHRA"
                  color="primary"
                />
              }
              label="Auto-calculate HRA"
            />
            {formData.autoCalculateHRA && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isMetroCity}
                    onChange={handleChange}
                    name="isMetroCity"
                    color="primary"
                  />
                }
                label="Living in Metro City"
              />
            )}
          </Box>
        </Grid>

        <Grid xs={12}>
          <TextField
            fullWidth
            label="Special Allowance"
            name="specialAllowance"
            value={getDisplayValue('specialAllowance', formData.specialAllowance)}
            onChange={handleChange}
            type="text"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        <Grid xs={12}>
          <TextField
            fullWidth
            label="Leave Travel Allowance (LTA)"
            name="lta"
            value={getDisplayValue('lta', formData.lta)}
            onChange={handleChange}
            type="text"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        <Grid xs={12}>
          <TextField
            fullWidth
            label="Medical Allowance"
            name="medicalAllowance"
            value={getDisplayValue('medicalAllowance', formData.medicalAllowance)}
            onChange={handleChange}
            type="text"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        <Grid xs={12}>
          <TextField
            fullWidth
            label="Other Allowances"
            name="otherAllowances"
            value={getDisplayValue('otherAllowances', formData.otherAllowances)}
            onChange={handleChange}
            type="text"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        <Grid xs={12}>
          <TextField
            fullWidth
            label="Perquisites"
            name="perquisites"
            value={getDisplayValue('perquisites', formData.perquisites)}
            onChange={handleChange}
            type="text"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            helperText="Additional benefits (car, driver, etc.)"
          />
        </Grid>
      </Grid>
    </Box>
  );
});

SalaryComponentsSection.displayName = 'SalaryComponentsSection';

export default SalaryComponentsSection;
