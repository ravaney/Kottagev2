import { Paper, Typography, Button } from '@mui/material';
import { Box, Container } from '@mui/system';

export const NoPropertiesFound = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
            No properties found
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            We couldn't find any properties matching your criteria. Try
            adjusting your search criteria.
          </Typography>
          <Button variant="contained" size="large">
            Browse All Properties
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
