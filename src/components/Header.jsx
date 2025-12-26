import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 50%, #0d47a1 100%)',
        boxShadow: '0 8px 32px rgba(21, 101, 192, 0.3)',
        mb: 4,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 0,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 3, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 2,
                p: 1,
                mr: 2,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CalculateIcon sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.5,
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Indian Income Tax Calculator
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
