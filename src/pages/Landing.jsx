import { Box, Heading, Flex, Text, Stack } from '@chakra-ui/react';

export default function CallToActionWithAnnotation() {
  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg="gray.100">
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Stack spacing={8} mx={'auto'} maxW={'2xl'} py={12} px={6}>
          <Box rounded={'lg'} bg="white" boxShadow={'lg'} p={8}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}
              py={10}
            >
              Make money from <br />
              <Text as={'span'} color={'yellow.500'}>
                Uploading Images
              </Text>
            </Heading>
            <Text color={'gray.500'}>
              Pictures You need Can be Found here. Create an Account in Pixrate
              and upload yours now! upload, sell and many more.... Enjoy
              Watching Pictures of your Desired categories...
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Flex>
  );
}
