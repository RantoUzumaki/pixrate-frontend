import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { api } from './../utils/api';

export default function Login(props) {
  const toast = useToast();
  const Router = useNavigate();

  function logIn() {
    let data = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };
    console.log(data);
    axios
      .post(`${api}/Login`, data)
      .then(res => {
        localStorage.setItem(
          'userLoggedInDetails',
          JSON.stringify(res.data.user)
        );
        toast({
          title: `Registeration Successful`,
          position: 'top-right',
          variant: 'left-accent',
          isClosable: true,
          status: 'success',
        });
        props.logval(true)
        Router('/');
      })
      .catch(err => console.log(err));
  }

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg="gray.100">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box rounded={'lg'} bg="white" boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input id="email" type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input id="password" type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              ></Stack>
              <Button
                onClick={logIn}
                bg={'yellow.400'}
                color={'white'}
                _hover={{
                  bg: 'yellow.600',
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
