import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

interface Genres{
  id:number;
  title:string;
}

function useGenres() {

  const [genre,SetGenre]=useState<Genres[]>()

  useEffect(()=>{
          apiClient.get('/store/collections').then((res)=>SetGenre(res.data))
  },[])
  
  return {genre}
}

export default useGenres