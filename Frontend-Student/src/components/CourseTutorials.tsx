import React, { useEffect, useState } from 'react'
import apiClient from './services/api-client';
import { useParams } from 'react-router-dom';
import { Box,Text } from '@chakra-ui/react';

interface Tutorials{
    id:number;
    title:string;
    video:string;
}

function CourseTutorials() {
    const [tutorials,SetTutorial]=useState<Tutorials[]>([])
    const { course_id } = useParams();

    useEffect(()=>{
        apiClient.get(`/store/courses/${course_id}/tutorials/`).then((res)=>SetTutorial(res.data))
},[])
    
  return (
    <>
        <Text fontSize={'4xl'} fontWeight={'bold'}>Watch and Download Course Tutorials</Text>
         {tutorials.map((item)=><Box marginTop={10}>
            <Text fontSize={'xl'} fontWeight={'bold'}>{item.title}</Text>
             <video height={'300px'} width={'300px'} controls src={'http://127.0.0.1:8000'+item.video} />
         </Box>)}

    </>
  )
}

export default CourseTutorials