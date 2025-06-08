import { Button, FormLabel, Input, Select } from "@chakra-ui/react";
import useGenres from "./hooks/useGenres";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import apiClient from "./services/api-client";

export interface Courses{
    id:number;
    title:string;
    description:string;
    unit_price:number;
    collection:number;
    image:string
}

function CreateCourse() {

    const navigate = useNavigate();
    const {genre}=useGenres()
    const { register,getValues, handleSubmit } = useForm<Courses>();

    function handle(data:FieldValues){
            apiClient.post('/store/courses/',data).then((res)=>navigate(`/home-menu/update-course/${res.data.id}`))
    }

  return (
    <>
      <form onSubmit={handleSubmit(handle)}>
          <FormLabel marginTop={"50px"}>Course Title</FormLabel>
          <Input {...register('title')} placeholder="Type Your New Course Title" size="md" />
          <FormLabel marginTop={"50px"}>Course Description</FormLabel>
          <Input {...register('description')} placeholder="Type Your New Course Title" size="md" />
          <FormLabel marginTop={"50px"}>Course Price</FormLabel>
          <Input {...register('unit_price')} type="number" placeholder="Type Your New Course Title" size="md" />
          <FormLabel marginTop={"50px"}>Course Catergorie</FormLabel>
          <Select placeholder="Select option"  {...register('collection')} onChange={(e)=>console.log(e.target.value)} >
            {genre?.map((item)=><option  value={item.id}>{item.title}</option>)}
          </Select>
          <Button type="submit" >Next</Button>
      </form>
    </>
  );
}

export default CreateCourse;
