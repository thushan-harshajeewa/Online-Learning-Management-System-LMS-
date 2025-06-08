import { Box, Button, IconButton, Input, InputGroup, InputRightElement, SimpleGrid ,Text} from '@chakra-ui/react'
import { IoSearchOutline } from "react-icons/io5";
import useProducts from './hooks/useProducts'
import ProductCard from './ProductCard'
import apiClient from './services/api-client'
import ManageCart from './AddToCart'
import { Genre } from './hooks/useGenre'
import ProductContainer from './ProductContainer';
import SkeletonCards from './SkeletonCards';



 interface props{
  cartID:(cart_id:string)=>void
  cartCondition:()=>void
  SelectedGenre:Genre|null|undefined
  SearchProduct:string|null|undefined
  
}

function FectchProducts({cartID,cartCondition,SelectedGenre,SearchProduct}:props) {
    console.log(SearchProduct)
    const {products,loading}=useProducts({params:{collection_id:SelectedGenre?.id,search:SearchProduct}},[SelectedGenre?.id,SearchProduct])
    
    //const [SelectedProduct,SetSelectedProduct]=useState<SelectedProduct>({product_id:0,quantity:1,item_price_method:'normal'})

    
    const skeletonCards = [1, 2, 3, 4, 5, 6];
  return (
    <>
    
    


    
    <Text fontWeight={'bold'} fontSize='4xl'>{SelectedGenre?.title}</Text>
    {SearchProduct && <Text fontWeight={'light'} opacity={0.5} fontSize='4xl'>Search Product:{SearchProduct}</Text>}
    <SimpleGrid columns={{'sm':1,'md':2,'lg':3}} spacing={'50px'}>
    {loading &&
          skeletonCards.map((item) => (
            <ProductContainer key={item}>
              <SkeletonCards  />
            </ProductContainer>
          ))}
            {products.map((productItem)=><ProductContainer>
              <ProductCard   productItem={productItem} />
            </ProductContainer>)}
    </SimpleGrid>
    </>
  )
}

export default FectchProducts