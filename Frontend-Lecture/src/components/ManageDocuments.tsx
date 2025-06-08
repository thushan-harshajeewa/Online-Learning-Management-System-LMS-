import { Input, Button,Text, List, ListIcon, ListItem, Box } from '@chakra-ui/react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import apiClient from './services/api-client';
import { MdCheckCircle } from 'react-icons/md';

interface Documents{
    id:number;
    title:string;
    pdf:string;
}

function ManageDocuments() {
    const { course_id } = useParams();
    const [documents,SetDocuments]=useState<Documents[]>([])
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title,SetTitle]=useState('')
    const [editimage, SetEditimage] = useState(false);
    const [updateCourse,SetUpdateCourse]=useState<boolean>();

    useEffect(()=>{
            apiClient.get(`/store/courses/${course_id}/documents/`).then((res)=>SetDocuments(res.data))
    },[updateCourse])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setSelectedFile(event.target.files[0]);
        }
      };


      function DeleteContents(document_id:any){
        apiClient.delete(`/store/courses/${course_id}/documents/${document_id}/`).then((res)=>updateCourse?SetUpdateCourse(false):SetUpdateCourse(true))
      }

      const handleUpload = () => {
        if (selectedFile) {
          const formData = new FormData();
          formData.append("pdf", selectedFile);
          formData.append("title", title);
    
          apiClient
            .post(`/store/courses/${course_id}/documents/`, formData)
            .then((response) => {
              SetDocuments([...documents,response.data]);
            })
            .catch((error) => {
              console.error("Error uploading file:", error);
            });
        } else {
          console.warn("No file selected for upload.");
        }
      };

      const handleUploadUpdate = (document_id:number) => {
        if (selectedFile) {
          const formData = new FormData();
          formData.append("pdf", selectedFile);
          formData.append("title", title);
    
          apiClient
            .put(`/store/courses/${course_id}/documents/${document_id}/`, formData)
            .then((response) => {apiClient
              .get(`/store/courses/${course_id}/documents/`)
              .then((response) => {
                SetDocuments(response.data);
              })
              
            })
            .catch((error) => {
              console.error("Error uploading file:", error);
            });
            SetEditimage(false)
        } else {
          console.warn("No file selected for upload.");
        }
      };
  return (
    <>
    <Text fontSize={'4xl'} fontWeight={'bold'}>Add Course Documents</Text>
    <Input
        color={"yellow"}
        onChange={(e)=>SetTitle(e.target.value)}
        type="text"
      />
    <Input
        color={"yellow"}
        onChange={handleFileChange}
        type="file"
        placeholder='Type File Title'
      />
      <Button onClick={handleUpload} marginY={5} >Add</Button>
        

    <List spacing={10}>
    {documents.map((item)=>
      <ListItem  fontSize={'xl'}>
      <ListIcon as={MdCheckCircle} color='green.500' />
      <a  href={'http://127.0.0.1:8000'+item.pdf} download>
      {item.title}
    </a>{editimage || (
        <Button colorScheme="yellow"  marginLeft={3} onClick={() => {SetEditimage(true);SetTitle(item.title)}}>Update</Button>
      )}
      {editimage && (
        <Box  marginLeft={3} display={"inline-block"}>
           <Input
        color={"yellow"}
        onChange={(e)=>SetTitle(e.target.value)}
        type="text"
        value={title}
      />
          <Input bgColor={'none'}  border={"none"} color="yellow" type="file" onChange={handleFileChange} />
          <Button marginTop={3} colorScheme="yellow" onClick={() => handleUploadUpdate(item.id)}>Upload Document</Button>
        </Box>
      )}<Button onClick={()=>{DeleteContents(item.id);console.log(item.id)}}>Delete</Button>
    </ListItem>)}

 
</List>


    </>
  )
}

export default ManageDocuments