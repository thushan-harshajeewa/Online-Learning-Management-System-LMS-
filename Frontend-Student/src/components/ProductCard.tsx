import {
  Box,
  Text,
  Card,
  CardBody,
  CardFooter,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  VStack,
  Button,
  CardHeader,
  Image,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { products } from "./hooks/useProducts";
import { FaShoppingCart } from "react-icons/fa";
import apiClient from "./services/api-client";
import { useNavigate } from "react-router-dom";



interface productItem {
  productItem: products;
  
  
}



function ProductCard({ productItem }: productItem) {
      const navigate=useNavigate()
      const toast = useToast()
  //const [SelectedProduct,SetSelectedProduct]=useState<SelectedProduct>({product_id:productItem.id,quantity:1,item_price_method:'normal'})

  //function AddCart(){
    //apiClient.post('/store/cart/').then((res)=>ManageCart.AddToCart(res.data.id,SelectedProduct))
  //}

  return (
    <Card  style={{cursor:"pointer"}}   _hover={{
      
      color: "yellow.300",
    }}
   >
    <CardHeader onClick={()=>navigate(`/home-menu/course/${productItem.id}`)}><Text fontWeight={'bold'} fontSize={'2xl'}>{productItem.title}</Text></CardHeader>
      <CardBody onClick={()=>navigate(`/home-menu/course/${productItem.id}`)}><Image  width={'300px'} height={'260px'} src={productItem.image} /></CardBody>
      <CardFooter justifyContent={"space-between"} >
        {" "}
      
       
 
        
          <Stack>
            <Button
              marginTop={'100px'}
              
              rightIcon={<FaShoppingCart />}
              colorScheme="teal"
              variant="outline"
              size={'sm'}
              fontSize={'sm'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              onClick={()=>navigate(`/home-menu/course/${productItem.id}`)}
             
            
            >
              View Course
            </Button>
          </Stack>
        
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
