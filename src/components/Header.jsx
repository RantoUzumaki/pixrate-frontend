import React from 'react';
import { Link, Box, Flex, Text, Button, Stack } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

import Logo from './Logo';

const NavBar = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const Router = new useNavigate();

  const location = new useLocation();

  const toggle = () => setIsOpen(!isOpen);

  if (location.pathname === '/admin/dashboard') {
    return <></>;
  } else {
    return (
      <NavBarContainer>
        <Logo
          w="200px"
          color="BlackAlpha.800"
          onClick={() => Router('/')}
          cursor={'pointer'}
          userSelect={'none'}
        />
        <MenuToggle toggle={toggle} isOpen={isOpen} />
        <MenuLinks prop={props} isOpen={isOpen} />
      </NavBarContainer>
    );
  }
};

const CloseIcon = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill="black"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="black"
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

const MenuItem = ({ children, isLast, to, ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};

const MenuLinks = ({ prop, isOpen }) => {
  let userDetails = localStorage.getItem('userLoggedInDetails');
  const Router = new useNavigate();

  return (
    <Box
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      flexBasis={{ base: '100%', md: 'auto' }}
    >
      <Stack
        spacing={8}
        align="center"
        justify="flex-end"
        direction={['column', 'row']}
        pt={[4, 4, 0, 0]}
      >
        {prop.logval ? (
          <>
            <MenuItem>
              <Text
                fontWeight="bold"
                fontSize="2xl"
                onClick={() => Router('/profile')}
              >
                {JSON.parse(userDetails).firstname.toUpperCase()}
              </Text>
            </MenuItem>
            <MenuItem to="/logout">
              <Button
                size="sm"
                rounded="md"
                color="whiteAlpha.600"
                bg="blackAlpha.800"
                _hover={{
                  bg: 'red.600',
                  color: 'blackAlpha.800',
                }}
              >
                Logout
              </Button>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem to="/login">
              <Button
                size="sm"
                rounded="md"
                color="whiteAlpha.600"
                bg="blackAlpha.800"
                _hover={{
                  bg: 'whiteAlpha.600',
                  color: 'blackAlpha.800',
                }}
              >
                Login
              </Button>
            </MenuItem>
            <MenuItem to="/signup">
              <Button
                size="sm"
                rounded="md"
                color="whiteAlpha.600"
                bg="blackAlpha.800"
                _hover={{
                  bg: 'whiteAlpha.600',
                  color: 'blackAlpha.800',
                }}
              >
                Create Account
              </Button>
            </MenuItem>
          </>
        )}
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg="yellow.400"
      color="BlackAlpha.800"
    >
      {children}
    </Flex>
  );
};

export default NavBar;
