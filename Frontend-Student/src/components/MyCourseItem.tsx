import { Card, useColorModeValue, CardHeader, CardBody, Img, CardFooter, Stack, Button,Text, Box, ListItem, OrderedList } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from './services/api-client';
import { Course } from './StudentCourses';

interface CourseFindings {
  id: number;
  description: string;
}

interface CourseContents {
  id: number;
  description: string;
}

function MyCourseItem() {
    const { course_id } = useParams();
    const [CourseDetails,SetCourseDetails]=useState<Course>()
    const [courseFindings, SetCourseFindings] = useState<CourseFindings[]>([]);
    const [courseContents, SetCourseContents] = useState<CourseContents[]>([]);
    const navigate=useNavigate()

    useEffect(()=>{
            apiClient.get(`store/courses/${course_id}/`).then((res)=>SetCourseDetails(res.data))
            apiClient.get(`store/courses/${course_id}/aims/`).then((res)=>SetCourseFindings(res.data))
            apiClient.get(`store/courses/${course_id}/contents/`).then((res)=>SetCourseContents(res.data))
    },[])

  return (
    <Box  justifyContent={"center"}>
       
       
          <Text marginLeft={'200px'} fontSize={'4xl'} fontWeight={'bold'}>{CourseDetails?.title}</Text>
          
            <Img boxSize={'450px'} src={CourseDetails?.image}/>
            <Text fontSize={'xl'} marginY={5} ><span style={{color:'red',fontSize:'30px'}}>"</span>{CourseDetails?.description}<span style={{color:'red',fontSize:'30px'}}>"</span></Text>
            
      
          <Box>
            <Text  fontSize={'2xl'} fontWeight={'bold'}>What You Will Learn</Text>
            <OrderedList>
                    {courseFindings?.map((item)=>
            <ListItem>{item.description}</ListItem>
                    )}
                 
                  </OrderedList>
                  <Text  fontSize={'2xl'} fontWeight={'bold'}>Course Contents</Text>
                  <OrderedList>
                    {courseContents?.map((item)=><ListItem>{item.description}</ListItem>)}
                 
                  </OrderedList>
                
              <Button onClick={()=>navigate(`tutorials`)}>Watch Course Tutorials</Button>
              <Button onClick={()=>navigate(`documents`)} marginLeft={10}>Download Course Documents</Button>
          </Box>


        
        
      </Box>
  )
}

export default MyCourseItem