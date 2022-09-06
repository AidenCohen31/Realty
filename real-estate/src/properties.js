import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider';
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import {Stack} from '@mui/material'
import MenuItem from '@mui/material/MenuItem';
import MuiInput from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import {useNavigate} from 'react-router-dom'
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import ReactMap from "./map.js"
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Card from '@mui/material/Card';
import Pagination from '@mui/material/Pagination';
import axios from "axios";
import {addModal} from "./modal.js"
import { modalClasses } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import {AddModal, EditModal} from './modal.js'
import Carousel from 'react-material-ui-carousel'
import { Marker } from './map.js';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import ShowerOutlinedIcon from '@mui/icons-material/ShowerOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';   
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material';

const Input = styled(MuiInput)`
  width: 42px;
`;
const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
 
  const Select2 = styled(Select)`
  MenuProps: {disableScrollLock: true}
  `;

  const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  }));

export default function Properties(props){
    const [searchResults, setSearchResults] = useState({name:[],city : [], beds:[], baths:[],pets:[], date:[], price:[]});
    const [options, setOptions] = useState({city : null, beds:null, pets:null, date:null, price:null});
    const [page, setPage] = useState(0);
    const [admin, setAdmin] = useState(false);
    const [price, setPrice] = useState([0,10]);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selected, setSelected] = useState({});
    const [name, setName] = useState("");
    const theme = useTheme();
    const [propCopy, setPropCopy] = useState([]);
    let navigate = useNavigate();


    useEffect(
        ()=>{
            axios.get("http://localhost:5000/session", {withCredentials:true}).then((r)=>{
  
                  if(r.data.admin){
                  setAdmin(true);
                  }
  
            })
          
  
  
        },[] )
        
    useEffect(() => {
        axios.get("http://localhost:5000/properties").then( (r) => {setPropCopy(r.data); props.setProperties(r.data)})
      },[])  
    function editProperty(obj){
        setEditModal(true);
        setSelected(obj);
    }

    function deleteProperty(pk){
        const fd = new FormData()
        fd.append("pk", pk)
        fd.append("csrf", props.csrf)
        axios.post("http://localhost:5000/delete",fd ).then(()=>{
            window.location.reload(false)
        })
    }
    useEffect(()=>{
        axios.get("http://localhost:5000/search").then((r)=> {
            var n = options
            console.log(r.data)
            for(const i of ["city", "beds", "pets","price", "baths"]){
                var vals = new Set()
                for (const j in r.data){
                    if(i === "pets"){
                        for(const z of r.data[j][i].split(",")){
                        if(z === ""){
                            vals.add("none")
                        }
                        else{
                        vals.add(z)
                        }
                        }
                    }
                    else{
                    vals.add(r.data[j][i])
                    }
                }

                n = {...n, [i]:vals}
            }
            setOptions((prev)=>({...prev, ...n}))
        })

    },[])
    useEffect(()=> {
        
        options.price ? setPrice([Math.min(...options.price), Math.max(...options.price)]) : setPrice([0,10]);
        console.log(options.price)},[options.price])
    useEffect(()=> {
        var newprops = propCopy
        for(const i of Object.keys(searchResults)){

            if(searchResults[i].length > 0){
                var temp = [];
                for(const j of newprops ){
                    if(i === "name" && j["address"].toLowerCase().includes(searchResults[i][0].toLowerCase())){
                        temp.push(j)
                    }
                    else if(i === "price" && (j["rent"] >= searchResults[i][0]  && j["rent"] <= searchResults[i][1]) ){
                        temp.push(j)
                    }
                    else if(i==="date" && Date.parse(j["date"]) <= Date.parse(searchResults[i][0]) ){
                    
                        temp.push(j)
                    }
                    else if(searchResults[i].includes(j[i]) ){
                        temp.push(j)
                    }

                }
                newprops=temp
            }
            
        }
        if(searchResults["name"].length === 0){
            setName(""); 

        }
        if(searchResults["price"].length === 0){
            setPrice(options.price? [Math.min(...options.price), Math.max(...options.price)] : ["",""]); 
        }
        props.setProperties(newprops)
    }, [searchResults])

    
    useEffect(()=> {console.log(props.properties);console.log(propCopy)}, [props.properties])
 

    // useEffect(()=>{ 
    //     axios.get("https://localhost:3000/session", {})
    // })
    return (
        <Grid container>
            
        <Grid item xs={12} sx={{"backgroundColor":"dimgray", "py" : 2}}  align="center">
            <ThemeProvider theme={darkTheme}>

            <Box sx={{"display" : "flex", "flexDirection" : "row", "justifyContent" : "center", "alignItems" : "center", "width" : "80%", "height" : 50, "p" : 2}}>
            <FormControl sx={{ m: 1, maxWidth: 120}}>
            <TextField id="outlined-basic" label="Search" variant="outlined" value={name} onChange={(e) => {setName(e.target.value)}}
onKeyUp={
                (e) => {e.code === 'Enter' ? setSearchResults((prev)=>({...prev, name:[e.target.value]})) : void(0)  }}/>
            </FormControl>
            <FormControl  sx={{ m: 1, width:120 }}>
            <InputLabel id="city">City</InputLabel>

            <Select inputProps={{MenuProps: {disableScrollLock: true}}} labelId="city" label="City" value={searchResults.city} 
                renderValue={(selected) => selected.join(', ')}

            multiple 
             onChange={
                (e) => {setSearchResults(prev => ({...prev, city : e.target.value}));  }}>

             {options.city ? [...options.city].map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={searchResults.city.indexOf(name) > -1}/>
                        <ListItemText primary={name}/>
                    </MenuItem>

            )) : null}

            </Select>
            </FormControl>
            <FormControl  sx={{ m: 1,p:1, width: 120}}>
            <InputLabel shrink={true} sx={{"z-index":100}}>Price</InputLabel>    

            <Slider value={price}  marks={options.price ? [...options.price].map((a) => ({value:a, label:""})) : false } min={options.price? Math.min(...options.price): 1} max={options.price ? Math.max(...options.price) : 1} step={options.price ? null: 1} valueLabelDisplay="auto" label="price" onChange={(e,v)=>{setPrice(v); setSearchResults((prev) => ({...prev, price:price}))}}>

            </Slider>
            <Box sx={{"display" : "flex " ,justifyContent:"space-between" }}>
            <Input
            size="small"
            placeholder="min"
                value={price[0]}
            onChange={
                (e,v) => {setPrice(isNaN(e.target.value) ? ["",""] : [e.target.value,price[1]] ); setSearchResults((prev) => (!isNaN(e.target.value) ? {...prev, price:[e.target.value,prev.price[1]]} : prev ))}
            }
        
            />
              <Input
            size="small"
            placeholder="max"

            value={price[1]}
            onChange={
                (e,v) => {setPrice(isNaN(e.target.value) ? ["",""] :[price[0],e.target.value]); setSearchResults((prev) => (!isNaN(e.target.value) ? {...prev, price:[prev.price[0],e.target.value]} : prev))  }
            }
            onBlur = {(e,v) => { if (v < 0) {setPrice(0);} else if (v > 100) {setPrice(10);}}}
            />
            </Box>
            </FormControl>
            <FormControl  sx={{ m: 1, width: 120 }}>
            <InputLabel id="beds">Beds</InputLabel>

            <Select inputProps={{MenuProps: {disableScrollLock: true}}} labelId="beds" label="beds" multiple value={searchResults.beds}    renderValue={(selected) => selected.join(', ')}
 onChange={
                (e) => {setSearchResults(prev => ({...prev, beds : e.target.value}))  }}>
                     {options.beds ? [...options.beds].map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={searchResults.beds.indexOf(name) > -1}/>
                        <ListItemText primary={name}/>
                    </MenuItem>

            )) : null}

            </Select>
            </FormControl>
            <FormControl  sx={{ m: 1, width: 120 }}>
            <InputLabel id="beds">Baths</InputLabel>

            <Select inputProps={{MenuProps: {disableScrollLock: true}}} labelId="baths" label="baths" multiple value={searchResults.baths}    renderValue={(selected) => selected.join(', ')}
 onChange={
                (e) => {setSearchResults(prev => ({...prev, baths : e.target.value}))  }}>
                     {options.baths ? [...options.baths].map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={searchResults.baths.indexOf(name) > -1}/>
                        <ListItemText primary={name}/>
                    </MenuItem>

            )) : null}

            </Select>
            </FormControl>
            <FormControl  sx={{ m: 1, width: 120 }}>
            <InputLabel id="pets">Pets</InputLabel>

            <Select inputProps={{MenuProps: {disableScrollLock: true}}} labelId="pets" label="pets" renderValue={(selected) => selected.join(', ')} value={searchResults.pets} multiple   onChange={
                (e) => {setSearchResults(prev => ({...prev, pets : e.target.value}))}}>
                         {options.pets ? [...options.pets].map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={searchResults.pets.indexOf(name) > -1}/>
                        <ListItemText primary={name}/>
                    </MenuItem>

            )) : null}


            </Select>
            </FormControl>
            <FormControl  sx={{ m: 1, width: 220 }}>
            <TextField
                id="date"
                label="Start Date"
                type="date"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={
                    (e) => {setSearchResults((prev) => ( {...prev, date : [e.target.value]}))  }}
                value={searchResults.date.length > 0 ? searchResults.date[0] : ""}
            />
            </FormControl>

            </Box>
            </ThemeProvider>
        </Grid>

        { Object.keys(searchResults).find((key) => searchResults[key].length !== 0) ? <Grid item xs={12} sx={{"backgroundColor":"dimgray", "pb" :1 ,"px" : 2 ,  "display" : "flex"}}>
        <div style={{"marginRight" : "auto "}}></div>
            {   
                Object.keys(searchResults).map( (key)=> {
                return (
                <div>   
                {searchResults[key].map((val) => <Chip label={key + ': ' + val }  variant="outlined"  onDelete={()=>{setSearchResults((prev) => ({...prev, [key] : prev[key].filter(x => x !== val)  }))}}/>)}
                </div>
                )
                    
            })
            }

        <Button variant="contained" color="error" sx={{"marginLeft" : "auto"}} onClick={()=>{setSearchResults({city : [], beds:[], pets:[], date:[], price:[], baths:[], name : []}); }}>Clear All</Button>
        </Grid> : null} 
        <Grid item xs={4} alignItems="stretch">
        <Wrapper apiKey="AIzaSyCjl42UhWDtO8hZByUbclFaI72jDs4k9ag">
        <ReactMap zoom={11} style={{ height: "75%", width:"33%",position:"absolute" }}>
            { props.properties.map( (obj)=>(
                <Marker position={{lat:obj.lat,lng:obj.lng}} />
            ))
            }

        </ReactMap>

        </Wrapper>
        </Grid>
        <Grid item xs={8}  sx={{ "p" : 1}} alignItems="stretch" >
        <Grid container spacing={1} direction="row" justify="space-between" sx={{"overflow" : "auto"}}>
        <Grid item xs={12}>
            <Grid container spacing={5} > 
                
                {
                    admin ? 
                props.properties.slice( page*2, (page*2)+2 ).map((obj,i)=> (   
                <Grid item xs={4} style={{'position' : "relative"}} >
                    
                    <IconButton onClick={()=>{editProperty(obj)}} variant="contained" sx={{'position' : "absolute", "zIndex" : 2, "right" : "65px", "borderRadius" : "50%", "backgroundColor" : theme.palette.primary.main}}> <EditIcon/></IconButton>
                    <IconButton  onClick={()=>{deleteProperty(obj.pk)}} variant="contained" sx={{'position' : "absolute", "zIndex" : 2, "right" : "20px", "borderRadius" : "50%", "backgroundColor" : theme.palette.primary.main}}><DeleteIcon/></IconButton>

                    <PropertyCard handleRedirect={()=>{navigate("/house/" + i, {state:obj});} } key={i} property={obj} id={(page*2) + i} style={{'position' : "absolute"}}></PropertyCard>
                </Grid>
                
                
                )) :


                props.properties.slice( page*3, (page*3)+3 ).map((obj,i)=> (   
                    <Grid item xs={4} style={{'position' : "relative"}} >
                        <PropertyCard handleRedirect={()=>{navigate("/house/" + i, {state:obj});} } key={i} property={obj} id={(page*2) + i} style={{'position' : "absolute"}}></PropertyCard>
                    </Grid>
                    
                    
                    ))

                }  

                   
                {
                    admin ? 
                                <Grid item xs={4}>
                                    <Card variant="outlined" sx={{ "height" : "99%"}} >
                                    <Box container alignItems="center" justifyContent={"center"} style= {{display:"flex", "height" : "100%"}} onClick={()=>{setAddModal(true);}}>
                                        <AddIcon fontSize="large"> </AddIcon>  
                                       <Div>  Add Listing</Div> 
                                        
                                    </Box>
                                    </Card>
                                </Grid>
                    : null
                                
                }
                   
                         
                      

            </Grid>
            {admin ? <AddModal csrf={props.csrf} open={addModal} onClose={()=> {setAddModal(false);}}></AddModal> : null}
            {editModal ? <EditModal csrf={props.csrf} open={editModal} onClose={()=>{setEditModal(false)}} property={selected}></EditModal> : null}
        </Grid>
       
        <Grid item xs={12}> 
            <Box sx={{alignItems:"flex-end", "justifyContent" : "center", "display" : "flex", "height": "100%"}}>
                  {admin ?  <Pagination count={Math.ceil(props.properties.length /2 )} color="secondary" onChange={(e,v) => {setPage(v-1)}}/> :  <Pagination count={Math.ceil(props.properties.length /2 )} color="secondary" onChange={(e,v) => {setPage(v-1)}}/>}
            </Box>
        </Grid>
        </Grid>

        </Grid>
        </Grid>


   );
}




function PropertyCard(props){

 
    return (<Card variant="outlined" sx={{"p" : 2 }}>
        <Carousel autoPlay={false}  sx={{"height" : "500"}}>
            {
                props.property.image.map( (obj,i) => (
                    <Box style={{"position" : "relative"}}>
                    <div style={{"position" : "absolute", "top" : 0 , "width" : "100%", "height" : 300,"background" : "linear-gradient( rgba(0,0,0,0), 90%, black  )"}}>
                    </div>

                    <h4 style={{"position" : "absolute", "bottom" : "2px", "left" : "10px", color :"white"}}>
                        {props.property.address}</h4>
                    <img  width="100%" height="300" src={obj} key={i}/> 
                    </Box>
                ))
                     

            }   

        </Carousel>
            <div style={{"display":"flex", "justifyContent" : "space-between"}} >
            <Box>
            <p style={{"display" : "inline"}} > Rent:  </p>
            <h2 style={{"display" : "inline"}}>${props.property.rent} </h2>
            </Box>
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

                <h6 style={{"marginTop" : "0px"}}>{props.property.beds} Beds</h6>
                </div>
                </Grid>
                <Grid item xs={3} alignItems="flex-start"  justifyContent="center" >
                <div style={{"textAlign" : "center"}}>

                <h6 style={{"marginTop" : "0px"}}>{props.property.baths} Baths</h6>
                </div>
                </Grid>
                <Grid item xs={3} alignItems="flex-start" justifyContent="center" >
                <div style={{"textAlign" : "center"}}>

                <h6 style={{"marginTop" : "0px"}}>{props.property.dim} sqft</h6>
                </div>
                </Grid>
                <Grid item xs={3} alignItems="flex-start"  justifyContent="center" >
                <div style={{"textAlign" : "center"}}>
                <h6 style={{"marginTop" : "0px"}}>{props.property.pets === "" ? "N" : "Y" }</h6>
                </div>
                </Grid>


                </Grid>

            </Box>
            <Box sx={{"display":"flex" , "justifyContent" : "space-between" , "alignItems" : "center"}}>
            <Box>
            <div style={{"fontSize" : "12px"}}>Available:</div>
            <div style={{"fontSize" : "12px", "fontWeight" : "bold"}}>{props.property.date}</div>
            </Box>
            <Button onClick={props.handleRedirect}> See Details</Button>
            </Box>
    </Card>)

}