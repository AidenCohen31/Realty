import './App.css';
import { Routes, Route, Link, Outlet, useNavigate , Navigate} from "react-router-dom";
import Portal from "./portal.js"
import Login from "./login.js"
import Register from "./register.js"
import Home from "./home.js"
import Properties from './properties';
import {useEffect,useState} from 'react'
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Header from "./appbar.js"
import House from "./house.js"
import Confirm from "./confirm.js"
import Cookies from 'universal-cookie';
import Maintenence from './maintenence';
import Admin from "./admin"
axios.defaults.withCredentials = true

function App() {
    const [properties, setProperties] = useState([]);
    const [csrf, setCSRF] = useState("")
    const [admin, setAdmin] = useState(false);
    const cookies = new Cookies()
    useEffect(
      ()=>{
          if(csrf === ""){
          axios.get("http://localhost:5000/token", {withCredentials:true}).then((r)=>{

                if(r.data.csrf){
                setCSRF(r.data.csrf)
                }

          })
        }


      },[] )

      useEffect(
        ()=>{
            axios.get("http://localhost:5000/session", {withCredentials:true}).then((r)=>{
  
                  if(r.data.admin){
                  setAdmin(true);
                  }
  
            })
          
  
  
        },[] )

  

    let navigate = useNavigate()
 
  
    
return(
  <Routes>
    <Route path="/" element={<Container maxWidth={false} disableGutters>
                             <Header/>
                             <Properties properties={properties} setProperties={setProperties} csrf={csrf} admin={admin}/>
                             </Container>} />
    <Route path="/properties" element={<Container maxWidth={false} disableGutters>
                             <Header/>
                             <Properties properties={properties} setProperties={setProperties} csrf={csrf} admin={admin}/>
                             </Container>} />
    <Route path= "/portal" element = {!cookies.get("sessionid") ? <Navigate to="/login" replace></Navigate> : <Portal  setCSRF= {setCSRF} csrf={csrf} />  }  >
        <Route path="Home" element = {<Navigate to="/" replace></Navigate>}/>
        <Route path="Admin" element = {<Admin admin={admin}/>}/>

        <Route path="Maintenence" element = {<Maintenence/>}/>
    </Route>
    <Route path="/login" element={ !cookies.get("sessionid") ? <Container maxWidth={false} disableGutters><Header/>  <Login csrf={csrf} setCSRF={setCSRF} /></Container> : <Navigate to="/portal" replace></Navigate> }/>
    <Route path="/register" element={ <Container maxWidth={false} disableGutters><Header/> <Register/> </Container> }/>
    <Route path="/house/:id" element={<House/>}/>
    <Route path="/confirm/:id" element={<Confirm/>}/>
    <Route path="*" element={<p>Invalid Selection</p>}/>
  </Routes>
  );
}

export default App;
