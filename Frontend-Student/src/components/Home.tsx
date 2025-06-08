import React from "react";
import { Link } from "react-router-dom";

import { Box, Button ,Text} from "@chakra-ui/react";


function Home() {
  const tokenFromLocalStorage = localStorage.getItem("token");
  return (
    <>
      <div className="container">
        <h1>Welcome to Our Student Learning Management System</h1>
       
        <p>Step into a new world where learning knows no boundaries. Our Learning Management System is designed to empower you to reach your educational goals conveniently and efficiently. Dive into a vast array of courses, modules, and resources meticulously crafted to cater to diverse interests and skill levels.

</p>
        {tokenFromLocalStorage?<Link to="/home-menu" className="btn btn-danger">
          Get Started
        </Link>:<Link to="/login" className="btn btn-danger" >
          Get Started
        </Link>}
        <Button marginLeft={10}><a href="http://localhost:5174/">Login As A Lecturer</a></Button>
      </div>
    </>
  );
}

export default Home;
