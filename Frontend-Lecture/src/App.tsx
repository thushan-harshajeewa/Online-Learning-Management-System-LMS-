import { Grid, GridItem, useColorModeValue, HStack } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import HomeMenu from "./components/HomeMenu";
import Signin from "./components/Signin";
import Login from "./components/Login";
import Home from "./components/Home";
import { useState } from "react";
import Navbar from "./components/Navbar";
import CreateCourse from "./components/CreateCourse";
import UpdateCourse from "./components/UpdateCourse";
import ManageTutorials from "./components/ManageTutorials";
import ManageDocuments from "./components/ManageDocuments";

function App() {
  const [ChangeLoginButton, setLoginButton] = useState(() => {
    const status = localStorage.getItem("status");
    if (status !== null) {
      return status;
    } else return false;
  });

  return (
    <>
      <Grid
        templateAreas={{
          base: `"nav" "main" `,
          sm: `"nav" "main" `,
          lg: `"nav nav" "aside main" `,
        }}
        gridTemplateColumns={{ base: "1fr", lg: "150px 1fr" }}
      >
        <GridItem
          bg={useColorModeValue("white", "gray.900")}
          area="nav"
          position={"fixed"}
          top={0}
          left={0}
          right={0}
          zIndex={10}
          height={"75px"}
          borderStyle={"solid"}
          borderWidth={1}
          borderBottomColor={useColorModeValue("white", "yellow.400")}
        >
          {" "}
          <Navbar
            status={ChangeLoginButton}
            handleStatus={(status) => setLoginButton(status)}
          />
        </GridItem>

        <GridItem
          bg={useColorModeValue("white", "gray.800")}
          area="main"
          padding={"100px"}
        >
          <div>
            <Routes>
              <Route path="/sign" element={<Signin />} />
              <Route
                path="/login"
                element={
                  <Login
                    ChangeLoginButton={(status) => setLoginButton(status)}
                  />
                }
              ></Route>
              <Route
                path="/home-menu"
                element={
                  <>
                    <HomeMenu />
                  </>
                }
              ></Route>
              <Route path="/create-course" element={<CreateCourse />} />
              <Route
                path="/home-menu/update-course/:course_id"
                element={<UpdateCourse />}
              />
              <Route
                path="/home-menu/update-course/:course_id/tutorials"
                element={<ManageTutorials />}
              />
               <Route
                path="/home-menu/update-course/:course_id/documents"
                element={<ManageDocuments/>}
              />
              
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
