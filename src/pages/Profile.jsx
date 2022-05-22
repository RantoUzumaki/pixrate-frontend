import {
  Center,
  Container,
  Box,
  Heading,
  Text,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Button,
  Input,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { api, image_api } from '../utils/api';

export default function Profile() {
  let userDetails = JSON.parse(localStorage.getItem('userLoggedInDetails'));
  const toast = useToast();

  const [buyImage, setBuyImage] = useState([]);
  const [images, setImages] = useState([]);
  const [boughtImage, setBoughtImage] = useState([]);
  const [editImagePrice, setEditImagePrice] = useState(false);

  useEffect(() => {
    let userDetails = localStorage.getItem('userLoggedInDetails');
    let userNotImg = [];

    axios.get(`${api}/get-images`).then(res => {
      res.data.map(e => {
        if (e.user[0]._id === JSON.parse(userDetails)._id) {
          userNotImg.push(e);
        }
      });
      setBuyImage(res.data);
      setImages(userNotImg);
    });
  }, [editImagePrice]);

  useEffect(() => {
    let userDetails = localStorage.getItem('userLoggedInDetails');
    let buyersList = [];

    axios
      .get(`${api}/get-buyers`, {
        params: { userId: JSON.parse(userDetails)._id },
      })
      .then(res => {
        res.data.map(e => {
          buyersList.push(e.image[0]);
        });
        setBoughtImage(buyersList);
      });
  }, []);

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
        setEditImagePrice(false);
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

  return (
    <Container w={'100vw'} pos={'relative'} top={'100px'} overflowX={'hidden'}>
      <Center pt={'50px'}>
        <Box
          role={'group'}
          p={6}
          maxW={'330px'}
          w={'full'}
          bg="white"
          boxShadow={'0 10px 50px 0 rgba(0,0,0,0.5)'}
          rounded={'lg'}
          pos={'relative'}
          zIndex={1}
        >
          <Box
            rounded={'lg'}
            display={'flex'}
            m={'auto'}
            w={'230px'}
            height={'230px'}
          >
            <Text
              boxShadow={'0 2px 10px 2px rgba(0,0,0,0.5)'}
              h={'100%'}
              w={'100%'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              fontSize={'5rem'}
              backgroundColor={'#ffd200'}
              borderRadius={'100%'}
            >
              {userDetails.firstname.charAt(0).toUpperCase()}
            </Text>
          </Box>
          <Stack pt={10} align={'center'}>
            <Text
              color={'gray.500'}
              fontSize={'sm'}
              textTransform={'uppercase'}
            >
              {`${userDetails.firstname} ${userDetails.lastname}`}
            </Text>
            <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
              {userDetails.email}
            </Heading>
          </Stack>
        </Box>
      </Center>

      <Tabs pt={'50px'} isFitted variant="soft-rounded">
        <TabList mb="1em">
          <Tab>UPLOADED IMAGES</Tab>
          <Tab>BOUGHT IMAGES</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {images.length === 0 && <Text>No Images Uploaded</Text>}
            {images.map(e => {
              return (
                <Box
                  w={'95%'}
                  rounded={'lg'}
                  bg="white"
                  boxShadow={'0 0px 10px 0px rgb(0 0 0 / 20%)'}
                  p={8}
                  key={e._id}
                  mb={'30px'}
                  pos={'relative'}
                >
                  <Flex flexDir={'column'}>
                    <Box pos={'relative'} overflow={'hidden'}>
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
                  {editImagePrice ? (
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
                        onClick={() => setEditImagePrice(true)}
                      />
                    </Flex>
                  )}
                  <Flex pt={'1.5em'} justifyContent={'space-between'}>
                    <Button
                      disabled={!editImagePrice}
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
          </TabPanel>
          <TabPanel>
            {boughtImage.length === 0 && <Text>No Images Purchased</Text>}
            {buyImage.map(e => {
              return (
                boughtImage.includes(e._id) && (
                  <Box
                    w={'95%'}
                    rounded={'lg'}
                    bg="white"
                    boxShadow={'0 0px 10px 0px rgb(0 0 0 / 20%)'}
                    p={8}
                    key={e._id}
                    mb={'30px'}
                    pos={'relative'}
                  >
                    <Flex flexDir={'column'}>
                      <Box pos={'relative'} overflow={'hidden'}>
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
                  </Box>
                )
              );
            })}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
