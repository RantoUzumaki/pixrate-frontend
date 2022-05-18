import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';

import customTheme from './utils/theme';
import Fonts from './utils/Fonts';

import './style/style.css';

ReactDOM.render(
  <ChakraProvider theme={customTheme}>
    <Fonts />
    <>
      <App />
    </>
  </ChakraProvider>,
  document.getElementById('root')
);
