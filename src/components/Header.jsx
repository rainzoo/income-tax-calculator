import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

export default function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2', mb: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 2 }}>
          <CalculateIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            Indian Income Tax Calculator
          </Typography>
          <Typography
            variant="body2"
            sx={{
              ml: 'auto',
              opacity: 0.9,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            FY 2025-26
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

