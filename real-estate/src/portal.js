import './App.css';
import { Routes, Route, Link , Outlet, useNavigate, Navigate,useLocation} from "react-router-dom";
import Login from "./login.js"
import Register from "./register.js"
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/system/Unstable_Grid';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import Properties from './properties';
function Portal(props) {
  const cookies = new Cookies()
  const [anchor, setAnchor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  useEffect(()=>{
    
    axios.get("http://localhost:5000/session", {params:{csrf: props.csrf} , withCredentials:true }).then((r) => {setUser(r.data);} )


  },[props.csrf])
  let navigate=useNavigate()
  return(
<Box>
<AppBar position="static" sx={{"height" : "50px","pt" : 1}}>
<Grid container spacing={1}>
  <Grid xs={2}></Grid>
  <Grid xs>
<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    {user.admin ? "Admin Dashboard" : user.address}
</Typography>
</Grid>

<Grid xs={2}>
  <Button sx={{ "color" : "white"}} onClick={(e)=>{setAnchor(e.currentTarget)}}>{user.user}</Button>
  <Menu variant="menu" anchorEl={anchor} open={Boolean(anchor)} onClose={()=>{setAnchor(null)}}>
    <MenuItem onClick={(e)=>{axios.get("http://localhost:5000/logout",{withCredentials:true}).then(()=>{setLoading(true); setAnchor(null)});  }}>Logout</MenuItem>
  </Menu>
</Grid>
</Grid>
</AppBar>
{loading ? <LinearProgress/> : null}

<Drawer variant="permanent" anchor="left">
  <List>
    <img src="/logo.jpeg" width="125px" height="80px" style={{"paddingLeft" : "10px"}} onClick={()=>{navigate("/")}}/>
    <Divider />
    { user.admin ?    Object.entries({"Home" : "Home" , "Admin Panel" : "Admin"}).map((text) => 
      <ListItem key={text[0]} >
        <Link to={text[1]}> {text[0]} </Link>
      </ListItem>
      
      ) 
      :
      Object.entries({"Home" : "Home" , "Maintenance" : "Maintenence"}).map((text) => 
      <ListItem key={text[0]} >
        <Link to={text[1]}> {text[0]} </Link>
      </ListItem>
      
      ) 

    }
  </List>
</Drawer>
<Container component="main"    sx={{"overflow":"auto" }}>

 { cookies.get("sessionid")  ? <Outlet user={user}/> : <Navigate to=""></Navigate>}  
</Container>
</Box>

  );
}

export default Portal;
