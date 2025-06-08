import { Avatar, Box, Button, HStack, Input, List, ListIcon, ListItem, OrderedList, Text } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Courses } from "./CreateCourse";
import apiClient from "./services/api-client";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle } from 'react-icons/md';
export interface CoursesUpdate{
  id:number;
  title:string;
  description:string;
  unit_price:number;
  image:string
}

interface CourseFindings {
  id: number;
  description: string;
}
interface CourseContents {
    id: number;
    description: string;
  }

function UpdateCourse() {
  const [course, SetCourse] = useState<CoursesUpdate>({} as Courses);
  const [edit, SetEdit] = useState(false);
  const { course_id } = useParams();
  const [courseFindings, SetCourseFindings] = useState<CourseFindings[]>([]);
  const [courseContents, SetCourseContents] = useState<CourseContents[]>([]);
  const [updateCourse,SetUpdateCourse]=useState<boolean>();
  const [description,SetDescription]=useState('')
  const [descriptionContents,SetDescriptionContents]=useState('')
  const navigate=useNavigate()


  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function AddComment(){
    apiClient.post(`/store/courses/${course_id}/aims/`,{description:description}).then((res)=>SetCourseFindings([...courseFindings,res.data]))
    SetDescription('')
  }
  function DeleteComment(aims_id:number){
    apiClient.delete(`/store/courses/${course_id}/aims/${aims_id}/`).then((res)=>updateCourse?SetUpdateCourse(false):SetUpdateCourse(true))
  }

  function AddCommentContents(){
    apiClient.post(`/store/courses/${course_id}/contents/`,{description:descriptionContents}).then((res)=>{SetCourseContents([...courseContents,res.data]);})
    SetDescriptionContents('')
  }

  function DeleteContents(content_id:any){
    apiClient.delete(`/store/courses/${course_id}/contents/${content_id}/`).then((res)=>updateCourse?SetUpdateCourse(false):SetUpdateCourse(true))
  }

  function UpdateCourse(){
    apiClient.put(`/store/courses/${course_id}/`,course).then((res)=>updateCourse?SetUpdateCourse(false):SetUpdateCourse(true))
    SetEdit(false)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  console.log(selectedFile);
  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      apiClient
        .patch(`/store/courses/${course_id}/`, formData)
        .then((response) => {
          SetCourse({ ...course, image: response.data.image });
        })
        .catch((error) => {
          console.error("Error uploading photo:", error);
        });
    } else {
      console.warn("No file selected for upload.");
    }
  };

  useEffect(() => {
    apiClient
      .get(`/store/courses/${course_id}`)
      .then((res) => SetCourse(res.data));
  }, [updateCourse]);

  useEffect(() => {
    apiClient
      .get(`/store/courses/${course_id}/aims`)
      .then((res) => SetCourseFindings(res.data));
    apiClient
      .get(`/store/courses/${course_id}/contents`)
      .then((res) => SetCourseContents(res.data));
    
  }, [updateCourse]);

  return (
    <>
      <Text marginTop={10} fontSize={"4xl"}>
        Update Course
      </Text>
      <Text marginTop={10} fontSize={"2xl"}>
        Course Title
      </Text>
      <Input
        value={course?.title}
        color={"yellow"}
        disabled={!edit}
        onChange={(e) => SetCourse({ ...course, title: e.target.value })}
        type="text"
      />

      <Text marginTop={5} fontSize={"2xl"}>
        Description
      </Text>
      <Input
        value={course?.description}
        color={"yellow"}
        disabled={!edit}
        onChange={(e) => SetCourse({ ...course, description: e.target.value })}
        type="text"
      />

      <Text marginTop={5} fontSize={"2xl"}>
        Course Price
      </Text>
      <Input
        value={course?.unit_price}
        color={"yellow"}
        disabled={!edit}
        type="number"
        onChange={(e) => SetCourse({ ...course, unit_price: parseInt(e.target.value) })}
      />

      {edit || (
        <Button marginTop={7} size={"md"} onClick={() => SetEdit(true)}>
          Edit
        </Button>
      )}
      {edit && (
        <Button marginTop={7} size={"md"} onClick={() => SetEdit(false)}>
          Cancel
        </Button>
      )}
      {edit && (
        <Button onClick={UpdateCourse} marginLeft={5} marginTop={7} colorScheme="yellow" size={"lg"}>
          Update
        </Button>
      )}
      <br /><br /><br />
      <Avatar
        size="2xl"
        boxSize={"300px"}
        name={course.title}
        src={course.image}
      />
      <Box marginTop={"200px"} marginLeft={3} display={"inline-block"}>
        <Input
          bgColor={"none"}
          border={"none"}
          color="yellow"
          type="file"
          onChange={handleFileChange}
        />
        <Button marginTop={3} colorScheme="yellow" onClick={handleUpload}>
          Upload Photo
        </Button>
      </Box>
      

      <Text marginTop={'100px'} fontSize={"2xl"}>
      Tell, What  Student Can Learn From This Course 
      </Text>
      <Input
        color={"yellow"}
        onChange={(e)=>SetDescription(e.target.value)}
        type="text"
        value={description}
      />
      <Button onClick={AddComment} marginTop={5} >Add</Button>
      <List marginTop={5}>
        {courseFindings?.map((item)=><HStack>
          <ListIcon as={MdCheckCircle} color='green.500' />
          <ListItem>{item.description}</ListItem><Button onClick={()=>{DeleteComment(item.id)}}>Delete</Button>
        </HStack>)}
     
      </List>

      <Text marginTop={10} fontSize={"2xl"}>
        Add course Contents
      </Text>
      <Input
        color={"yellow"}
        onChange={(e)=>SetDescriptionContents(e.target.value)}
        type="text"
        value={descriptionContents}
      />
      <Button onClick={AddCommentContents} marginTop={5}>Add</Button>
      <List>
        {courseContents?.map((item)=><HStack>
          <ListIcon as={MdCheckCircle} color='green.500' />
          <ListItem>{item.description}</ListItem><Button onClick={()=>{DeleteContents(item.id);console.log(item.id)}}>Delete</Button>
        </HStack>)}
     
      </List>
      <Button marginTop={10} onClick={(()=>navigate(`/home-menu/update-course/${course_id}/tutorials`))}>Upload Tutorials</Button>
      <Button marginTop={10} marginLeft={10} onClick={(()=>navigate(`/home-menu/update-course/${course_id}/documents`))}>Upload Documents</Button>
      <Button marginTop={'200px'} colorScheme="green" marginLeft={'200px'} onClick={(()=>navigate(`/home-menu`))}>Finish</Button>

    </>
  );
}

export default UpdateCourse;
