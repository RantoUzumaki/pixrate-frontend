import {
  StackDivider,
  VStack,
  Flex,
  Box,
  Tooltip,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  SimpleGrid,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Center,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { api, image_api } from './../../utils/api';
import { useToast } from '@chakra-ui/react';

export default function Admin() {
  const toast = useToast();

  const [tabs, setTabs] = useState('users');
  const [users, setUsers] = useState([]);
  const [images, setImages] = useState([]);
  const [editImagePrice, setEditImagePrice] = useState(-1);
  const [buyedImages, setBuyedImages] = useState([]);

  useEffect(() => {
    axios.get(`${api}/get-users`).then(res => setUsers(res.data));

    axios.get(`${api}/get-images`).then(res => {
      setImages(res.data);
    });

    axios
      .get(`${api}/get-all-buyers`)
      .then(res => setBuyedImages(res.data))
      .catch(err => console.error(err));
  }, [editImagePrice]);

  function Users() {
    return (
      <Box
        h="92vh"
        w="calc(100vw - 350px)"
        pos={'relative'}
        left={'350px'}
        top={'8vh'}
      >
        <Text
          textAlign={'center'}
          mb={'2em'}
          fontWeight={'700'}
          fontSize={'20px'}
        >
          List of Users
        </Text>
        <Box
          m={'auto'}
          overflowY={'scroll'}
          w={'80%'}
          h={'80vh'}
          border={'1px solid #333'}
          borderRadius={'5px'}
        >
          <TableContainer m={'2em'}>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map(e => {
                  return (
                    <Tr key={e._id}>
                      <Td>{e.firstname}</Td>
                      <Td>{e.lastname}</Td>
                      <Td>{e.email}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  }

  function editImage(e) {
    axios
      .post(`${api}/edit-image`, {
        imageid: e.target.id,
        price: document.getElementById('imagePriceEdited').value,
      })
      .then(res => {
        toast({
          title: `${res.data.message} Successfully`,
          position: 'top-right',
          variant: 'left-accent',
          isClosable: true,
          status: 'success',
        });
        setEditImagePrice(-1);
      })
      .catch(err => console.error(err));
  }

  function deleteImage(e) {
    let confm = window.confirm('Are you sure you want to delete?');

    if (!confm) return;

    axios
      .delete(`${api}/delete-image`, { data: { imageid: e.target.id } })
      .then(res => {
        toast({
          title: `${res.data.message}`,
          position: 'top-right',
          variant: 'left-accent',
          isClosable: true,
          status: 'success',
        });
        setEditImagePrice(false);
      })
      .catch(err => console.error(err));
  }

  function ImageUpload() {
    return (
      <Box
        h="92vh"
        w="calc(100vw - 350px)"
        pos={'relative'}
        left={'350px'}
        top={'8vh'}
      >
        <Text
          textAlign={'center'}
          mb={'2em'}
          fontWeight={'700'}
          fontSize={'20px'}
        >
          List of Images Uploaded
        </Text>
        <Box
          m={'auto'}
          overflowY={'scroll'}
          w={'80%'}
          h={'80vh'}
          border={'1px solid #333'}
          borderRadius={'5px'}
        >
          <SimpleGrid
            columns={2}
            spacing={5}
            w={'calc(100% - 40px)'}
            m={'20px'}
            justifyItems={'center'}
          >
            {images.map((e, idx) => {
              return (
                <Box
                  w={'95%'}
                  rounded={'lg'}
                  bg="white"
                  boxShadow={'0 0px 10px 0px rgb(0 0 0 / 20%)'}
                  p={8}
                  key={e._id}
                  pos={'relative'}
                >
                  <Flex flexDir={'column'}>
                    <Flex mb={'4'} align={'center'}>
                      <Box
                        mr={'4'}
                        w={'40px'}
                        h={'40px'}
                        borderRadius={'100%'}
                        bg={'yellow.400'}
                        pos={'relative'}
                      >
                        <Text
                          pos={'absolute'}
                          top={'50%'}
                          left={'50%'}
                          transform={'translate(-50%, -50%)'}
                          fontWeight={'700'}
                        >
                          {e.user[0].firstname.charAt(0).toUpperCase()}
                        </Text>
                      </Box>
                      <Text fontWeight={'600'}>
                        {e.user[0].firstname.toUpperCase()}
                      </Text>
                    </Flex>
                    <Box pos={'relative'} overflow={'hidden'} mb={'3.5em'}>
                      <Box
                        background={`url(${image_api}/${e.image_name}) center no-repeat`}
                        backgroundSize={'contain'}
                        filter={'none'}
                        zIndex={'2'}
                        pos={'relative'}
                        maxW={'100%'}
                        h={'400px'}
                        m={'0 auto'}
                        boxShadow={'0 20px 40px #000'}
                      ></Box>
                      <Box
                        background={`linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3) ),  url(${image_api}/${e.image_name}) center no-repeat`}
                        backgroundSize={'cover'}
                        filter={'blur(5px)'}
                        w={'100%'}
                        h={'400px'}
                        pos={'absolute'}
                        zIndex={'1'}
                        top={'0'}
                      ></Box>
                    </Box>
                  </Flex>
                  {editImagePrice === idx ? (
                    <Input
                      id="imagePriceEdited"
                      mt={'1em'}
                      placeholder={e.price}
                    />
                  ) : (
                    <Flex
                      mt={'1em'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Text fontSize={'1.25em'}>
                        Price -
                        <span
                          style={{ fontWeight: '600' }}
                        >{` Rs.${e.price}.00`}</span>
                      </Text>
                      <EditIcon
                        w={'20px'}
                        h={'20px'}
                        cursor={'pointer'}
                        color={'grey.400'}
                        onClick={() => setEditImagePrice(idx)}
                      />
                    </Flex>
                  )}
                  <Flex pt={'1.5em'} justifyContent={'space-between'}>
                    <Button
                      {...(editImagePrice === idx ? 'disabled' : 'enabled')}
                      id={e._id}
                      colorScheme={'yellow'}
                      onClick={editImage}
                    >
                      Edit
                    </Button>
                    <Button
                      id={e._id}
                      colorScheme={'red'}
                      onClick={deleteImage}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>
    );
  }

  function ImageSold() {
    return (
      <Box
        h="92vh"
        w="calc(100vw - 350px)"
        pos={'relative'}
        left={'350px'}
        top={'8vh'}
      >
        <Text
          textAlign={'center'}
          mb={'2em'}
          fontWeight={'700'}
          fontSize={'20px'}
        >
          List of Images Bought by users
        </Text>
        <Box
          m={'auto'}
          overflowY={'scroll'}
          w={'80%'}
          h={'80vh'}
          border={'1px solid #333'}
          borderRadius={'5px'}
        >
          <SimpleGrid
            columns={2}
            spacing={5}
            w={'calc(100% - 40px)'}
            m={'20px'}
            justifyItems={'center'}
          >
            {buyedImages.map(e => {
              return (
                <Box
                  w={'95%'}
                  rounded={'lg'}
                  bg="white"
                  boxShadow={'0 0px 10px 0px rgb(0 0 0 / 20%)'}
                  p={8}
                  key={e._id}
                  pos={'relative'}
                >
                  <Flex flexDir={'column'}>
                    <Flex mb={'4'} align={'center'}>
                      <Box
                        mr={'4'}
                        w={'40px'}
                        h={'40px'}
                        borderRadius={'100%'}
                        bg={'yellow.400'}
                        pos={'relative'}
                      >
                        <Text
                          pos={'absolute'}
                          top={'50%'}
                          left={'50%'}
                          transform={'translate(-50%, -50%)'}
                          fontWeight={'700'}
                        >
                          {e.user[0].firstname.charAt(0).toUpperCase()}
                        </Text>
                      </Box>
                      <Text fontWeight={'600'}>
                        {e.user[0].firstname.toUpperCase()}
                      </Text>
                    </Flex>
                    <Box pos={'relative'} overflow={'hidden'}>
                      <Box
                        background={`url(${image_api}/${e.image[0].image_name}) center no-repeat`}
                        backgroundSize={'contain'}
                        filter={'none'}
                        zIndex={'2'}
                        pos={'relative'}
                        maxW={'100%'}
                        h={'400px'}
                        m={'0 auto'}
                        boxShadow={'0 20px 40px #000'}
                      ></Box>
                      <Box
                        background={`linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3) ),  url(${image_api}/${e.image[0].image_name}) center no-repeat`}
                        backgroundSize={'cover'}
                        filter={'blur(5px)'}
                        w={'100%'}
                        h={'400px'}
                        pos={'absolute'}
                        zIndex={'1'}
                        top={'0'}
                      ></Box>
                    </Box>
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>
    );
  }

  function GeneratedReport() {
    return (
      <Box
        h="92vh"
        w="calc(100vw - 350px)"
        pos={'relative'}
        left={'350px'}
        top={'8vh'}
      >
        <Text
          textAlign={'center'}
          mb={'2em'}
          fontWeight={'700'}
          fontSize={'20px'}
        >
          Generate Report
        </Text>
        <Flex
          m={'auto'}
          w={'max-content'}
          h={'max-content'}
          p={'3em'}
          border={'1px solid #333'}
          borderRadius={'5px'}
          boxShadow={'0 0 2px 0 #333, 3px 3px 8px 2px #333'}
        >
          <Center>
            <VStack>
              <Text
                fontWeight={'700'}
              >{`Total no. of users - ${users.length}`}</Text>
              <Text
                fontWeight={'700'}
              >{`Total no. of Images Uploaded - ${images.length}`}</Text>
              <Text
                fontWeight={'700'}
              >{`Total no. of Images Purchased - ${buyedImages.length}`}</Text>
            </VStack>
          </Center>
          {/* <TableContainer m={'20px'}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>User Email</Th>
                  <Th>Image</Th>
                  <Th>Price</Th>
                  <Th>Purchased By</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>inches</Td>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td>25.4</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer> */}
        </Flex>
      </Box>
    );
  }

  return (
    <Flex h="100vh" w={'100vw'}>
      <Box h="100%" w="350px" bg="yellow.500" pos={'fixed'}>
        <Flex h="100%" align={'center'} justify={'center'}>
          <VStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
          >
            <Tooltip label={'users'} placement="top">
              <Button
                onClick={() => setTabs('users')}
                bg={'gray.300'}
                _hover={{
                  bg: 'gray.500',
                }}
              >
                Users
              </Button>
            </Tooltip>
            <Tooltip label={'Images Uploaded'} placement="top">
              <Button
                onClick={() => setTabs('image-upload')}
                bg={'gray.300'}
                _hover={{
                  bg: 'gray.500',
                }}
              >
                Images Uploaded
              </Button>
            </Tooltip>
            <Tooltip label={'Images Sold'} placement="top">
              <Button
                onClick={() => setTabs('image-sold')}
                bg={'gray.300'}
                _hover={{
                  bg: 'gray.500',
                }}
              >
                Images Sold
              </Button>
            </Tooltip>
            <Tooltip label={'Generate report'} placement="top">
              <Button
                onClick={() => setTabs('Generate-report')}
                bg={'gray.300'}
                _hover={{
                  bg: 'gray.500',
                }}
              >
                Generate report
              </Button>
            </Tooltip>
          </VStack>
        </Flex>
      </Box>
      {tabs === 'users' && <Users />}
      {tabs === 'image-upload' && <ImageUpload />}
      {tabs === 'image-sold' && <ImageSold />}
      {tabs === 'Generate-report' && <GeneratedReport />}
    </Flex>
  );
}
