import Header from "./appbar"
import {Container, Box, Divider, ImageList, ImageListItem, Grid, Dialog,Button, IconButton,Chip, Card, Stack, List, ListItem , ListSubheader, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

import { useLocation } from "react-router-dom";
import {useState} from 'react'
import Carousel from 'react-material-ui-carousel'
import PhotoIcon from '@mui/icons-material/Photo';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import ShowerOutlinedIcon from '@mui/icons-material/ShowerOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import ReactMap from "./map.js"
import { Marker } from './map.js';
import { Wrapper, Status } from "@googlemaps/react-wrapper";

export default function House(props){
    const location = useLocation()
    const [slides, setSlides] = useState(false); 
    console.log(location.state)
   return ( 
    <Container maxWidth={false} disableGutters>
    <Header/>
    <Grid container>
    <Grid item xs={12}  sx={{"display":"flex", "alignItems" : "center" , "justifyContent" : "center", "position" : "relative"}} >
    <div style={{"position" : "absolute", "top" : "8%", "left" : "26%" ,"zIndex" : 2 }}> <Chip icon={<PhotoIcon/>} color="primary" label= {location.state.image.length + " images"} style={{"backgroundColor" : "black"}}/> </div>
    <ImageList variant="quilted" cols={4}  sx={{ maxWidth: "50%"}}>
        {
            location.state.image.slice(0,4).map((item,i) => (

                <ImageListItem key={i} cols={ (i==0) ? 3 : 1 } rows={(i==0) ? 4:1} sx={{'&:hover': {filter:"brightness(110%)"}}}
                    onClick={()=>{setSlides(true)}}    
                >
                    <img src={"/" + item}/>
                </ImageListItem>
                
            ))

        }
    </ImageList>
    </Grid>
    <Grid item xs={3}> 
    </Grid>
    <Grid item xs={2} sx={{"py" : 2}}> 
    <Card style={{"height" : "100%"}}>
        <div style={{ "backgroundColor" : "WhiteSmoke", "height" : "100%"}}>
        <Stack>
        <div style={{"alignItems" : "center", "display":"flex", "justifyContent" : "center"}}>
        <p style={{"display" : "inline"}} > Rent:  </p>
        <h2 style={{"display" : "inline"}}>${location.state.rent} </h2>
        </div>

        <Box sx={{"pt" : 2 }}>
                <Grid container row spacing={0}> 
                <Grid item xs={3}>
                <div style={{"textAlign" : "center"}}>
                <HotelOutlinedIcon  fontSize= "large" ></HotelOutlinedIcon> 
                </div>
                </Grid>
                <Grid item xs={3}> 
                <div style={{"textAlign" : "center"}}>

                <ShowerOutlinedIcon  fontSize= "large" ></ShowerOutlinedIcon>
                </div>
                </Grid>

                <Grid item xs={3}>
                <div style={{"textAlign" : "center"}}>

                <SquareFootOutlinedIcon fontSize= "large" ></SquareFootOutlinedIcon>
                </div>
                </Grid>
                <Grid item xs={3}>
                <div style={{"textAlign" : "center"}}>

                <PetsOutlinedIcon fontSize= "large" ></PetsOutlinedIcon>
                </div>
                </Grid>
               
                <Grid item xs={3} alignItems="flex-start" justifyContent="center">
                <div style={{"textAlign" : "center"}}>

                <h6 style={{"marginTop" : "0px"}}>{location.state.beds} Beds</h6>
                </div>
                </Grid>
                <Grid item xs={3} alignItems="flex-start"  justifyContent="center" >
                <div style={{"textAlign" : "center"}}>

                <h6 style={{"marginTop" : "0px"}}>{location.state.baths} Baths</h6>
                </div>
                </Grid>
                <Grid item xs={3} alignItems="flex-start" justifyContent="center" >
                <div style={{"textAlign" : "center"}}>

                <h6 style={{"marginTop" : "0px"}}>{location.state.dim} sqft</h6>
                </div>
                </Grid>
                <Grid item xs={3} alignItems="flex-start"  justifyContent="center" >
                <div style={{"textAlign" : "center"}}>
                <h6 style={{"marginTop" : "0px"}}>{location.state.pets === "" ? "N" : "Y" }</h6>
                </div>
                </Grid>


                </Grid>

            </Box>

            <Box>
                <ul style={{"listStyleType" : "none", "paddingLeft" : "10px"}} >
                <li style={{
        fontWeight: 700, lineHeight: '24px', fontSize: '16px', color: 'black'
      }}
      > Terms</li>
                   <ul style={{"fontSize" : "14px", "listStyleType" : "disc"}}>
                        <li> <div style={{"fontWeight" : "bold", "display" : "inline"}}>Rent:</div> ${location.state.rent}</li>
                        <li>  <div style={{"fontWeight" : "bold", "display" : "inline"}}>Application Fee:</div> ${location.state.appfee}</li>
                        <li> <div style={{"fontWeight" : "bold", "display" : "inline"}}>Security Deposit:</div> ${location.state.deposit} </li>
                   </ul>


                </ul>

                <ul style={{"listStyleType" : "none", "paddingLeft" : "10px"}} >
                <li style={{
        fontWeight: 700, lineHeight: '24px', fontSize: '16px', color: 'black'
      }}
      > Pets</li>
                   <ul style={{"fontSize" : "14px", "listStyleType" : "disc"}}>
                        {
                            location.state.pets === "" ? <li> None allowed</li> :
                            location.state.pets.split(",").map( (obj) =>(
                               <li> {obj.charAt(0).toUpperCase() + obj.slice(1)} allowed </li>

                            )
                            )

                        }
                   </ul>


                </ul>
                
                <ul style={{"listStyleType" : "none", "paddingLeft" : "10px"}} >
                <li style={{
        fontWeight: 700, lineHeight: '24px', fontSize: '16px', color: 'black'
      }}
      > Contact Info</li>
                   <ul style={{"fontSize" : "14px", "listStyleType" : "none"}}>
                        <li> {location.state.contact} </li>
                   </ul>


                </ul>



            </Box>

        </Stack>    
        </div>
    </Card>
    </Grid>
    <Grid item xs={5}> 
    <Box sx={{"m" : 2}}>
        <div style={{"fontWeight" : "1000", "fontSize" : "18pt"}}>{location.state.address}</div>
        <div style={{"fontSize" : "16pt", "marginLeft" : "", "paddingTop" : "2%", "fontWeight" : "750", "color" : "rgba(61,72,82,1)"}}> Description</div>   
        <Typography sx={{"m" : 2}}> {location.state.summary}   </Typography>  
    </Box>
    <Divider />
    <Box sx={{"m" : 2, "height" : "50vh"}}>
    <Wrapper apiKey="AIzaSyCjl42UhWDtO8hZByUbclFaI72jDs4k9ag">
        <ReactMap zoom={12} style={{ height: "50%", width:"40%",position:"absolute" }}>
        <Marker position={{lat:location.state.lat,lng:location.state.lng}} />

        </ReactMap>

        </Wrapper>
    </Box>
    </Grid>
    </Grid>
    <Grid item xs={2}> 
    
    </Grid>


    <Dialog fullScreen open={slides} onClose={() => {setSlides(false)}}>
    <Box sx={{"display" : "flex", "marginLeft" : "auto"}}>
    <IconButton
              edge="start"
              color="inherit"
              onClick={()=>{setSlides(false )}}
              aria-label="close"
            >
                <CloseIcon />
            </IconButton>
    </Box>
    <Box style={{"maxHeight" : "90vh", "maxWidth" : "90vw"}}>
    <Carousel autoPlay={false} navButtonsAlwaysVisible>
            {  
                location.state.image.map( (obj,i) => (
                    <Box sx={{"display":"flex", "justifyContent" : "center" , "alignItems" : "center"}}>
                    <img  src={"/" + obj} key={i} style={{"maxHeight" : "90vh", "maxWidth" : "90vw"}}/> 
                    </Box>  

                
                
                ))

            }   

        </Carousel>
    </Box>

    </Dialog>
    
    </Container>


   );
}