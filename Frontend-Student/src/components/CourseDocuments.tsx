import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import apiClient from './services/api-client';
import {
 
    List,
    ListIcon,
    ListItem,
    Text,
  } from "@chakra-ui/react";
import { MdCheckCircle } from 'react-icons/md';

interface Documents{
    id:number;
    title:string;
    pdf:string;
}

function CourseDocuments() {
    const [documents,SetDocuments]=useState<Documents[]>([])
    const { course_id } = useParams();

    useEffect(()=>{
        apiClient.get(`/store/courses/${course_id}/documents/`).then((res)=>SetDocuments(res.data))
},[])

  return (
    <>
    <Text fontSize={'4xl'} fontWeight={'bold'}>Download Course Documents</Text>

    <List spacing={3}>
    {documents.map((item)=>
      <ListItem fontSize={'xl'}>
      <ListIcon as={MdCheckCircle} color='green.500' />
      <a  href={'http://127.0.0.1:8000'+item.pdf} download>
      {item.title}
    </a>
    </ListItem>)}

 
</List>
    
    
    </>
  )
}

export default CourseDocuments