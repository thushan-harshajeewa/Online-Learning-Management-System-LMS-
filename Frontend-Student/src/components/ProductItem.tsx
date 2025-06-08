import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  HStack,Img,
  Input,
  List,
  ListIcon,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  
  Textarea,
  
  useColorModeValue,
  useDisclosure,
  useNumberInput,
} from "@chakra-ui/react";
import { IoAdd } from "react-icons/io5";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text
} from '@chakra-ui/react'

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ManageProductsAndReviews from "./ManageProductAndReviews";
import { FaShoppingCart } from "react-icons/fa";
import apiClient from "./services/api-client";
import ManageCart from "./AddToCart";
import { Customer } from "./hooks/useCustomer";
import { MdCheckCircle } from "react-icons/md";

interface cartID{
  cartID:(cart_id:string)=>void
  cartCondition:()=>void
}

interface reviews{
  id:number
  description:string
  date:string
  student:Customer

}

interface CourseFindings {
  id: number;
  description: string;
}
interface CourseContents {
    id: number;
    description: string;
  }

function ProductItem({cartID,cartCondition}:cartID) {
  const { product_id } = useParams();
  const productID = product_id;
  const { productItem } = ManageProductsAndReviews.FecthProduct(product_id);
  const [PriceMethod,SetPriceMethod]=useState('normal')
  const [quantity, setQuantity] = useState(1);
  const [Review,SetReview]=useState<reviews[]>([])
  const [description,SetDescription]=useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [courseFindings, SetCourseFindings] = useState<CourseFindings[]>([]);
  const [courseContents, SetCourseContents] = useState<CourseContents[]>([]);

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  console.log(quantity)
  //Chakra ui quantity input field
  



  function AddCart(product_id: number | undefined) {
    let SelectedProduct = {
      course_id: product_id,
     
    };
    apiClient
      .post("/store/cart/")
      .then((res) => {ManageCart.AddToCart(res.data.id, SelectedProduct);cartID(res.data.id);cartCondition()});
  }

  useEffect(()=>{

        apiClient.get(`/store/courses/${product_id}/reviews/`).then((res)=>SetReview(res.data))

  },[])

  useEffect(() => {
    apiClient
      .get(`/store/courses/${product_id}/aims`)
      .then((res) => SetCourseFindings(res.data));
    apiClient
      .get(`/store/courses/${product_id}/contents`)
      .then((res) => SetCourseContents(res.data));
    
  }, []);

  function AddComment(){
    apiClient.post(`/store/courses/${product_id}/reviews/`,{description:description}).then((res)=>SetReview([res.data,...Review]))
  }

  return (
    <>
      <Box display={"flex"} justifyContent={"center"}>
        <Card
          width={'500px'}
          bg={useColorModeValue('white', 'gray.900')}
          marginTop={10}
          textAlign={"center"}
        >
          <CardHeader><Text marginRight={'100px'} fontSize={'3xl'} fontWeight={'bold'}>{productItem?.title}</Text></CardHeader>
          <CardBody>
            <Img boxSize={'350px'} src={productItem?.image}/>
            <Text fontSize={'xl'} marginY={5} ><span style={{color:'red',fontSize:'30px'}}>"</span>{productItem?.description}<span style={{color:'red',fontSize:'30px'}}>"</span></Text>
          </CardBody>
          <CardFooter justifyContent={"space-between"}>
            {" "}

            <Stack>

              <Button
                marginTop={"10px"}
                rightIcon={<FaShoppingCart />}
                colorScheme="teal"
                variant="outline"
                size={"sm"}
                fontSize={"sm"}
                onClick={() => AddCart(productItem?.id)}
              >
                Add To Cart
              </Button>
            </Stack>
          </CardFooter>
        </Card>
      </Box>
      <Text marginTop={'100px'} fontSize={"2xl"}>
      What You Will Learn From This Course
      </Text>
      <List marginTop={5}>
        {courseFindings?.map((item)=><HStack>
          <ListIcon as={MdCheckCircle} color='green.500' />
          <ListItem>{item.description}</ListItem>
        </HStack>)}
     
      </List>

      <Text marginTop={10} fontSize={"2xl"}>
         Course Contents
      </Text>
      <List>
        {courseContents?.map((item)=><HStack>
          <ListIcon as={MdCheckCircle} color='green.500' />
          <ListItem>{item.description}</ListItem>
        </HStack>)}
     
      </List>

      <Box marginY={10}><Text fontWeight={'bold'} fontSize={'3xl'}>Product Reviews</Text>
    
      <Button leftIcon={<IoAdd />} onClick={onOpen} colorScheme='yellow' >Add Review</Button>
      

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            
              <Text>Description</Text>
              
              <Textarea onChange={(e)=>SetDescription(e.target.value)} placeholder='Type Your Comment Here' />
            

           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={()=>{AddComment();onClose()}} >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        {Review?.map((review)=><Card marginY={10} width={'550px'}>
          <CardHeader borderBottom={"solid"} borderBottomColor={'white'} borderBottomWidth={'1px'}><Avatar name={review.student.user.first_name+' '+review.student.user.last_name} src={"http://127.0.0.1:8000" + review.student.image}/>
<Text display={"inline-block"} marginLeft={5} fontWeight={'bold'} fontSize={'xl'}>{review.student.user.first_name} {review.student.user.last_name}</Text> </CardHeader>
          <CardBody fontWeight={'bold'} color={'yellow'}>## {review.description}</CardBody>
          <CardFooter>{review.date}</CardFooter>
        </Card>)}

      </Box>
    </>
  );
}

export default ProductItem;
