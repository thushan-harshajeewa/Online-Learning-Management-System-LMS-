import { Button, Card, CardBody, CardFooter,Image,Text } from '@chakra-ui/react'

import React from 'react'
import { Cart } from '../App'
import { useNavigate } from 'react-router-dom'

interface ManageCartLabel{
    AllCartItems:Cart|undefined
}

function CartPriceLabel({AllCartItems}:ManageCartLabel) {
  const navigate=useNavigate()
  return (
    <>
            <Card  top={'100px'} position={'fixed'} right={'20px'} >
                <CardBody><Text fontSize={'2xl'}>Sub Total: <Text display={'inline-block'} fontSize={'4xl'} fontWeight={'bold'}>Rs {AllCartItems?.Total_price}</Text></Text></CardBody>
                <CardFooter><Button marginLeft={4} onClick={(()=>navigate('/store/cart/checkouts'))} >Proceed To Checkouts</Button></CardFooter>
            </Card>

    </>
  )
}

export default CartPriceLabel