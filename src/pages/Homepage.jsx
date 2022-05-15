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
  VStack,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import Sidemenu from '../components/sidemenu';
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

  useEffect(() => {
    axios
      .get(`${api}/Categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(`${api}/get-images`).then(res => {
      setImage(res.data);
      setFilterImage(res.data);
    });
  }, [isOpen]);

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

    const data = new FormData();
    data.append('file', img);
    data.append('category', category);
    data.append('userId', userId);

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
      })
      .catch(e => {
        console.log(e);
      });
  }

  return (
    <Flex h="100vh" w={'100vw'} align={'start'} justify={'start'}>
      <Box h="100%" w="350px" bg="yellow.500">
        <Sidemenu />
      </Box>
      <Box h="100%" w="75%" paddingTop="100px" zIndex={'-1'}>
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
          spacing={10}
          w={'80%'}
          m={'auto'}
          justifyItems={'center'}
        >
          {filterImage.map(e => {
            return (
              <Box
                w={'85%'}
                rounded={'lg'}
                h={'450px'}
                bg="white"
                boxShadow={'0 0px 10px 0px rgb(0 0 0 / 20%)'}
                p={8}
                key={e._id}
              >
                <Image
                  w={'100%'}
                  h={'100%'}
                  objectFit={'contain'}
                  src={`${image_api}/${e.image_name}`}
                  alt={e.image_name}
                />
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
