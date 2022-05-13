import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../utils/api';
import { VStack, Tooltip, StackDivider, Flex, Button } from '@chakra-ui/react';

export default function Sidemenu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${api}/Categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        {categories.map(e => {
          return (
            <Tooltip key={e._id} label={e.name} placement="top">
              <Button
                bg="gray.300"
                _hover={{
                  bg: 'gray.500'
                }}
              >
                {e.name}
              </Button>
            </Tooltip>
          );
        })}
      </VStack>
    </Flex>
  );
}
