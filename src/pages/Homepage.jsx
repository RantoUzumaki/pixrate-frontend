import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  Flex,
  Text,
  Input,
  Select,
  SimpleGrid,
  InputGroup,
  InputLeftAddon,
  VStack,
  Tooltip,
  StackDivider,
  CloseButton,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api, image_api } from '../utils/api';

import dummy from './../assets/images/dummy.jpg';

export default function Homepage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [image, setImage] = useState([]);
  const [filterImage, setFilterImage] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clear, setClear] = useState(false);

  useEffect(() => {
    axios
      .get(`${api}/Categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    let userDetails = localStorage.getItem('userLoggedInDetails');
    let userNotImg = [];

    axios.get(`${api}/get-images`).then(res => {
      res.data.map(e => {
        if (e.user[0]._id !== JSON.parse(userDetails)._id) {
          userNotImg.push(e);
        }
      });
      setImage(userNotImg);
      setFilterImage(userNotImg);
    });
  }, [isOpen]);

  function filterCategoriesClicked(e) {
    const filterArray = [];
    image.filter(data => {
      if (e.target.innerHTML === data.category[0].name) {
        filterArray.push(data);
      }
    });
    setClear(true);
    setFilterImage(filterArray);
  }

  function imagePicker(e) {
    if (e.target.files.length === 0) return;

    let file = e.target.files[0];
    let url = URL.createObjectURL(file);
    document.querySelector('#imgInputPreview div').innerText = file.name;
    document.querySelector('#imgInputPreview img').src = url;
  }

  function imageUpload() {
    let img = document.getElementById('imgInput').files[0];
    let category = document.getElementById('categoriesId').value;
    let userId = JSON.parse(localStorage.getItem('userLoggedInDetails'))._id;
    let price = document.getElementById('priceInput').value;

    const data = new FormData();
    data.append('file', img);
    data.append('category', category);
    data.append('userId', userId);
    data.append('price', price);

    axios
      .post(`${api}/upload`, data)
      .then(() => {
        toast({
          title: `Image Upload successfull`,
          position: 'top-right',
          variant: 'left-accent',
          isClosable: true,
          status: 'success',
        });
        onClose();
      })
      .catch(e => {
        console.log(e);
      });
  }

  function clearFilter() {
    setClear(false);
    setFilterImage(image);
  }

  function buyImage(e) {
    let data = {
      userId: JSON.parse(localStorage.getItem('userLoggedInDetails'))._id,
      imageId: e.target.id,
    };

    axios
      .post(`${api}/buy-image`, data)
      .then(res => {
        toast({
          title: `Image Purchased successfull`,
          position: 'top-right',
          variant: 'left-accent',
          isClosable: true,
          status: 'success',
        });
      })
      .catch(err => {
        console.log(err);
      });
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
            {clear && (
              <Tooltip label="clear" placement="right">
                <CloseButton m={'auto'} onClick={clearFilter} />
              </Tooltip>
            )}
            {categories.map((e, index) => {
              return (
                <Tooltip key={e._id} label={e.name} placement="top">
                  <Button
                    id={`catId${index}`}
                    onClick={filterCategoriesClicked}
                    bg={'gray.300'}
                    _hover={{
                      bg: 'gray.500',
                    }}
                  >
                    {e.name}
                  </Button>
                </Tooltip>
              );
            })}
          </VStack>
        </Flex>
      </Box>
      <Box
        h="100%"
        w="calc(100% - 350px)"
        pos={'relative'}
        left={'350px'}
        paddingTop="100px"
      >
        <Box
          m={'auto'}
          h="150px"
          w="80%"
          bg="yellow.400"
          paddingTop="30px"
          my={'20px'}
          borderRadius="lg"
        >
          <Flex flexDir={'column'} align="center">
            <Text fontWeight={'600'} paddingBottom={'5px'}>
              Upload Image here.
            </Text>
            <Button onClick={onOpen}>UPLOAD</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Upload Image</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                  <Box className="image-picker">
                    <Input
                      onInput={imagePicker}
                      type={'file'}
                      id="imgInput"
                      accept="image/*"
                    />
                    <label htmlFor="imgInput" id="imgInputPreview">
                      <img src={dummy} alt="dummy" />
                      <div>
                        <span>+</span>
                      </div>
                    </label>
                  </Box>
                  <Box>
                    <Select id="categoriesId" placeholder="Select Category">
                      {categories.map(e => {
                        return (
                          <option key={e._id} value={e.name}>
                            {e.name}
                          </option>
                        );
                      })}
                    </Select>
                  </Box>
                  <InputGroup mt={'5'}>
                    <InputLeftAddon children="Price" />
                    <Input
                      id="priceInput"
                      type="number"
                      placeholder="Enter Price"
                    />
                  </InputGroup>
                </ModalBody>

                <ModalFooter>
                  <Button
                    bg={'blackAlpha.600'}
                    color={'white'}
                    border={'blackAlpha.600'}
                    _hover={{ bg: 'blackAlpha.900', color: 'yellow.400' }}
                    onClick={imageUpload}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
        </Box>
        <SimpleGrid
          columns={2}
          spacing={5}
          w={'80%'}
          m={'auto'}
          justifyItems={'center'}
        >
          {filterImage.map(e => {
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
                  <Button
                    id={e._id}
                    onClick={buyImage}
                    mt={'4'}
                    w={'0'}
                    p={'1em 4.5em'}
                    bg={'yellow.300'}
                    pos={'absolute'}
                    bottom={'2em'}
                    right={'2em'}
                    _hover={{
                      bg: 'yellow.400',
                      boxShadow: '0 0 5px 2px rgba(0,0,0,0.5)',
                    }}
                  >{`Buy - Rs.${e.price}.00`}</Button>
                </Flex>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
