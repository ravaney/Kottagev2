import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
interface ILoadingSearch {
  searchCriteria?:
    | {
        location?: string;
        checkIn?: Date;
        checkOut?: Date;
        guests?: number;
      }
    | undefined;
}
export const Loadingproperties = ({ searchCriteria }: ILoadingSearch) => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#666' }}>
          {searchCriteria?.checkIn && searchCriteria?.checkOut
            ? 'Checking availability for your dates...'
            : 'Searching for properties...'}
        </Typography>
      </Container>
    </Box>
  );
};
