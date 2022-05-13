import { Box } from '@chakra-ui/react';
import Sidemenu from '../components/sidemenu';

export default function Homepage() {
  return (
    <>
      <Box h="100vh" w="20vw" bg="yellow.500">
        <Sidemenu />
      </Box>
    </>
  );
}
