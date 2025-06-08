import React, { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import apiClient from './services/api-client';
import { AspectRatio, Box, Button, Input,Text } from '@chakra-ui/react';

interface Tutorials{
    id:number;
    title:string;
    video:string;
}

function ManageTutorials() {
    const { course_id } = useParams();
    const [tutorials,SetTutorial]=useState<Tutorials[]>([])
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title,SetTitle]=useState('')

    useEffect(()=>{
            apiClient.get(`/store/courses/${course_id}/tutorials/`).then((res)=>SetTutorial(res.data))
    },[])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setSelectedFile(event.target.files[0]);
        }
      };

      const handleUpload = () => {
        if (selectedFile) {
          const formData = new FormData();
          formData.append("video", selectedFile);
          formData.append("title", title);
    
          apiClient
            .post(`/store/courses/${course_id}/tutorials/`, formData)
            .then((response) => {
              SetTutorial([...tutorials,response.data]);
            })
            .catch((error) => {
              console.error("Error uploading photo:", error);
            });
        } else {
          console.warn("No file selected for upload.");
        }
      };

  return (
    <>

  <Text fontSize={'4xl'} fontWeight={'bold'}>Watch and Download Course Tutorials</Text>
    <Input
        color={"yellow"}
        onChange={(e)=>SetTitle(e.target.value)}
        type="text"
        placeholder='Type Tutorial Title'
      />
    <Input
        color={"yellow"}
        onChange={handleFileChange}
        type="file"
      />
      <Button onClick={handleUpload} marginY={5}>Add</Button>
      
        {tutorials.map((item)=><Box marginTop={10}>
          <Text fontSize={'xl'} fontWeight={'bold'}>{item.title}</Text>
          <video height={'300px'} width={'300px'} controls src={'http://127.0.0.1:8000'+item.video} />
        </Box>)}


    </>
  )
}

export default ManageTutorials