import { Button, Card, CardBody, CardFooter, CardHeader, Image, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import apiClient from "./services/api-client";
import { useNavigate } from "react-router-dom";


export interface Course{
    id:number;
    title:string;
    description:string;
    image:string;
}

interface StudentCourses{
    id:number;
    order_id:number;
    course:Course
}

function StudentCourses() {

    const[CompleteOrder,SetCompleteOrder]=useState<StudentCourses[]>([])
    const navigate=useNavigate()

    useEffect(()=>{
            apiClient.get('store/courseses/s/').then((res)=>SetCompleteOrder(res.data))
    },[])



  return (
    <>
      <Text>My Courses</Text>

      <SimpleGrid columns={2} spacing={10}>
        {CompleteOrder.map((item)=><Card>
                <CardHeader>{item.course.title}</CardHeader>
                <CardBody><Image src={item.course.image} /></CardBody>
                <CardFooter><Button onClick={()=>navigate(`${item.course.id}`)}>Start Course</Button></CardFooter>
        </Card>)}
        
      </SimpleGrid>
      
    </>
  );
}

export default StudentCourses;
