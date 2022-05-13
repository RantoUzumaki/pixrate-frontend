import { extendTheme } from '@chakra-ui/react';

const fonts = {
    heading: 'Poppins-Bold, sans-serif',
    body: 'Poppins-Regular, sans-serif'
}

const customTheme = extendTheme({ fonts });

export default customTheme;