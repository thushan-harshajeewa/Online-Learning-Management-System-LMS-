import React, { useEffect, useState } from "react";
import apiClient from "./services/api-client";
import ManageUsers from './services/user-services'
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Image, SimpleGrid } from "@chakra-ui/react";


interface CoursesCard{
  id:number;
  title:string
  image:string
}

function HomeMenu() {

  const navigate = useNavigate();
  const [CourseCard,SetCourseCard]=useState<CoursesCard[]>([])
 
  ManageUsers.CheckTokenAvailability('/');

  useEffect(() => {
    apiClient
      .get(`/store/courseses/l/`)
      .then((res) => SetCourseCard(res.data));
  }, []);
  
  

  
  return (
    <div>
      <h1>"Education is not the filling of a pail, but the lighting of a fire." - William Butler Yeats</h1>

      <SimpleGrid columns={2} spacing={10}>
              {CourseCard.map((item)=><Card onClick={()=>navigate(`/home-menu/update-course/${item.id}`)}><CardHeader fontWeight={'bold'}>{item.title}</CardHeader><CardBody><Image  width={'300px'} height={'260px'} src={item.image} /></CardBody></Card>)}
</SimpleGrid>

      <Button marginTop={10} onClick={()=>navigate('/create-course')} >Create New Course</Button>
      
    </div>
  );
}

export default HomeMenu;
