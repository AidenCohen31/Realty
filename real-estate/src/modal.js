import { DialogTitle, DialogContent, TextField, Select, Popover, Paper, Button, IconButton, LinearProgress} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {useState, useRef, useEffect} from 'react'
import Stack from '@mui/material/Stack';
import Carousel from 'react-material-ui-carousel'
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MenuItem from '@mui/material/MenuItem';

import { handleBreakpoints } from '@mui/system';
import axios from 'axios';
export function AddModal(props){
    const [termPop, setTermPop] = useState(null);
    const [addrPop, setAddrPop] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [pets, setPets] = useState([]);
    const [index, setIndex] = useState(0);
    const [errors, setErrors] = useState({"terms" : false, "baths":false, "address" : false, "beds" : false, "sqft" : false, "pets" : false, "contact" : false,  "summary" : false, "date" : false})
    const address = useRef(null);
    const terms = useRef(null);
    const beds = useRef(null);
    const baths = useRef(null);
    const sqft = useRef(null);
    const date = useRef(null);
    const contact = useRef(null);
    const summary = useRef(null);
    const open = Boolean(termPop)
    const [spinner, setSpinner] = useState(false);
    useEffect(
        () => {console.log(imageList)}
    , [imageList])
    useEffect(
        () => {console.log(index)}
    , [index])
    var items = [
    ]

async function submitForm(e){
    
    e.preventDefault();
    setSpinner(true); 
    setErrors({"terms" : false, "baths":false, "address" : false, "beds" : false, "sqft" : false, "pets" : false, "contact" : false,  "summary" : false, "date" : false});
    var queryParams = new FormData();
    var termArray= terms.current.value.split(",");
    var error = false;
    var valid = await axios("http://localhost:5000/api/geocode" , {params:{"address" : address.current.value }})
    console.log(!valid.data.success)
    if(termArray.length != 3){
        setErrors((prev) => ({...prev, "terms" : true }))
        error = true;
    } 
    if(address.current.value === "" || !valid.data.success){
        setErrors((prev) => ({...prev, "address" : true }))
        error = true;

    }
    if(beds.current.value === ""){
        setErrors((prev) => ({...prev, "beds" : true }))
        error = true;

    }
    if(baths.current.value === ""){
        setErrors((prev) => ({...prev, "baths" : true }))
        error = true;

    }
    if(sqft.current.value === ""){
        setErrors((prev) => ({...prev, "sqft" : true }))
        error = true;

    }
    if(contact.current.value === ""){
        setErrors((prev) => ({...prev, "contact" : true }))
        error = true;

    }
    if(date.current.value === ""){
        setErrors((prev) => ({...prev, "date" : true }))
        error = true;

    }

    if(error){
        return;
    }


    queryParams.append("address", address.current.value)
    queryParams.append("price",  termArray[0])
    queryParams.append("app", termArray[1])
    queryParams.append("deposit", termArray[2])
    queryParams.append("beds", beds.current.value)
    queryParams.append("baths", baths.current.value)
    queryParams.append("dim", sqft.current.value)
    queryParams.append("pets", pets)
    queryParams.append("date", date.current.value)
    queryParams.append("contact", contact.current.value)
    queryParams.append("summary", summary.current.value)
    queryParams.append("csrf", props.csrf)
    for(const i in imageList){
        queryParams.append("images[]", imageList[i])
    }

    axios.post("http://localhost:5000/api/add", queryParams).then(
    ()=>{
        window.location.reload(false)
    }
    );

}
 return (

    <Dialog open={props.open} onClose={props.onClose} maxWidth="lg" fullWidth={true}>
      <DialogTitle justifyContent="space-between" sx={{"display" : "flex"}}> Add Properties <Button type="submit" form="modalform"> Submit</Button> </DialogTitle>
        <DialogContent>
            {spinner?<LinearProgress />:null}
            {Object.values(errors).some(x=>x) ? <Box> <Typography color="red">Error! Please Resubmit</Typography> </Box> : null }
            <Box id="modalform" component="form" noValidate onSubmit={(e) => {submitForm(e).done(setTimeout(()=>setSpinner(false),1000 ))}} sx={{mt:3}}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack spacing={2}>
                        <TextField label="Address" error={errors["address"]} inputRef={address} onMouseEnter={(e)=> {setAddrPop(e.currentTarget);}} onMouseLeave={()=> setAddrPop(null)} ></TextField>
                        <Popover open={Boolean(addrPop)} anchorEl={addrPop}  
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }} 
                        onClose={()=>{setAddrPop(null)}}   
                        disableRestoreFocus     
                        disableAutoFocus
                        disableEnforceFocus    
                        sx={{
                            pointerEvents: 'none',
                          }}>
                            <Box sx={{"m" : 1}}> 
                            <Typography>Input Format Example:  </Typography>
                            <Typography sx={{ fontStyle: 'italic' }}>&ensp; 5702 Claredon Dr., Fitchburg, WI 53711</Typography>
                            </Box>
                        </Popover>
                        <TextField label="Terms" error={errors["terms"]} inputRef= {terms} onMouseEnter={(e)=> {setTermPop(e.currentTarget); console.log(e)}} onMouseLeave={()=> setTermPop(null)}></TextField>
                        <Popover open={open} anchorEl={termPop}  
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }} 
                        onClose={()=>{setTermPop(null)}}   
                        disableRestoreFocus     
                        disableAutoFocus
                        disableEnforceFocus    
                        sx={{
                            pointerEvents: 'none',
                          }}>
                            <Box sx={{"m" : 1}}> 
                            <Typography>Input Format:  </Typography>
                            <Typography>&ensp; &#123;Rent&#125;,&#123;Application Fee&#125;,&#123;Security Deposit&#125;</Typography>
                            </Box>
                        </Popover>
                        <Stack direction="row" spacing={1}>
                        <TextField error={errors["beds"]} type= "number" label="Beds" inputRef={beds}></TextField>
                        <TextField error={errors["baths"]} type="number" label="Baths" inputRef={baths}></TextField>
                        <TextField error={errors["sqft"]} type= "number" label="Sqft" inputRef={sqft}></TextField>
                        <Select value= {pets} onChange={(e) => setPets(e.target.value)} multiple
                            renderValue={(selected) => {
                                if (selected.length === 0) {
                                  return <em>No Pets </em>;
                                }
                    
                                return selected.join(', ');
                              }}
                              displayEmpty

                        >
                        <MenuItem disabled value=""> <em>No Pets</em> </MenuItem>
                            <MenuItem value={"dogs"}>Dogs Allowed</MenuItem>
                            <MenuItem value={"cats"}>Cats Allowed</MenuItem>

                        </Select>

                        </Stack>
                        <TextField error={errors["date"]} label="Starting Date" inputRef={date} type="date" InputLabelProps={{ shrink: true }}></TextField>

                        <TextField error={errors["contact"]} label="Contact Info" inputRef={contact}></TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={6} >
                    <Stack spacing={2}>
                    <TextareaAutosize ref={ref => summary.current=ref} placeholder="Summary"  minRows={3} style={{"width" : "100%"}}></TextareaAutosize>
                    <Carousel autoPlay={false} navButtonsAlwaysVisible={true} index={index}>
                        { imageList.length > 0 ? imageList.map( (item, i) => <Slide key={i} pic={item} setImageList={setImageList} id={i} setIndex={setIndex}/>) : <Slide key={0} pic={null} setImageList={setImageList} id={-1} setIndex={setIndex}/>
                        }
                    </Carousel>
                    </Stack>
                    </Grid>
                    
                    </Grid>
           </Box>
        </DialogContent>

    </Dialog>


 )
}

export function EditModal(props){
    const [termPop, setTermPop] = useState(null);
    const [addrPop, setAddrPop] = useState(null);
    const [imageList, setImageList] = useState(props.property.image);
    const [pets, setPets] = useState(props.property.pets.split(","));
    const [index, setIndex] = useState(0);
    const [errors, setErrors] = useState({"terms" : false, "baths":false, "address" : false, "beds" : false, "sqft" : false, "pets" : false, "contact" : false,  "summary" : false, "date" : false})
    const address = useRef(null);
    const terms = useRef(null);
    const beds = useRef(null);
    const baths = useRef(null);
    const sqft = useRef(null);
    const date = useRef(null);
    const contact = useRef(null);
    const summary = useRef(null);
    const open = Boolean(termPop)
    const [spinner, setSpinner] = useState(false);
    console.log(props.property)
    const pk = props.property.pk
    var items = [
    ]
  
async function submitForm(e,pk){
    
    e.preventDefault();
    setSpinner(true); 
    setErrors({"terms" : false, "baths":false, "address" : false, "beds" : false, "sqft" : false, "pets" : false, "contact" : false,  "summary" : false, "date" : false});
    var queryParams = new FormData();
    var termArray= terms.current.value.split(",");
    var error = false;
    var valid = await axios("http://localhost:5000/api/geocode" , {params:{"address" : address.current.value }})
    console.log(!valid.data.success)
    if(termArray.length != 3){
        setErrors((prev) => ({...prev, "terms" : true }))
        error = true;
    } 
    if(address.current.value === "" || !valid.data.success){
        setErrors((prev) => ({...prev, "address" : true }))
        error = true;

    }
    if(beds.current.value === ""){
        setErrors((prev) => ({...prev, "beds" : true }))
        error = true;

    }
    if(baths.current.value === ""){
        setErrors((prev) => ({...prev, "baths" : true }))
        error = true;

    }
    if(sqft.current.value === ""){
        setErrors((prev) => ({...prev, "sqft" : true }))
        error = true;

    }
    if(contact.current.value === ""){
        setErrors((prev) => ({...prev, "contact" : true }))
        error = true;

    }
    if(date.current.value === ""){
        setErrors((prev) => ({...prev, "date" : true }))
        error = true;

    }

    if(error){
        return;
    }


    queryParams.append("address", address.current.value)
    queryParams.append("price",  termArray[0])
    queryParams.append("app", termArray[1])
    queryParams.append("deposit", termArray[2])
    queryParams.append("beds", beds.current.value)
    queryParams.append("baths", baths.current.value)
    queryParams.append("dim", sqft.current.value)
    queryParams.append("pets", pets)
    queryParams.append("date", date.current.value)
    queryParams.append("contact", contact.current.value)
    queryParams.append("summary", summary.current.value)
    queryParams.append("pk", pk)
    for(const i in imageList){
        queryParams.append("images[]", imageList[i])
    }

    axios.post("http://localhost:5000/api/edit", queryParams).then(
    ()=>{
        window.location.reload(false)
    }
    );

}
 return (

    <Dialog open={props.open} onClose={props.onClose} maxWidth="lg" fullWidth={true}>
      <DialogTitle justifyContent="space-between" sx={{"display" : "flex"}}> Edit Properties <Button type="submit" form="modalform"> Submit</Button> </DialogTitle>
        <DialogContent>
            {spinner?<LinearProgress />:null}
            {Object.values(errors).some(x=>x) ? <Box> <Typography color="red">Error! Please Resubmit</Typography> </Box> : null }
            <Box id="modalform" component="form" noValidate onSubmit={(e) => {submitForm(e,pk).done(setTimeout(()=>setSpinner(false),1000 ))}} sx={{mt:3}}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack spacing={2}>
                        <TextField defaultValue={props.property.address} label="Address" error={errors["address"]} inputRef={address} onMouseEnter={(e)=> {setAddrPop(e.currentTarget);}} onMouseLeave={()=> setAddrPop(null)} ></TextField>
                        <Popover open={Boolean(addrPop)} anchorEl={addrPop}  
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }} 
                        onClose={()=>{setAddrPop(null)}}   
                        disableRestoreFocus     
                        disableAutoFocus
                        disableEnforceFocus    
                        sx={{
                            pointerEvents: 'none',
                          }}>
                            <Box sx={{"m" : 1}}> 
                            <Typography>Input Format Example:  </Typography>
                            <Typography sx={{ fontStyle: 'italic' }}>&ensp; 5702 Claredon Dr., Fitchburg, WI 53711</Typography>
                            </Box>
                        </Popover>
                        <TextField defaultValue={String(props.property.rent) + "," + String(props.property.appfee) + "," + String(props.property.deposit)} label="Terms" error={errors["terms"]} inputRef= {terms} onMouseEnter={(e)=> {setTermPop(e.currentTarget); console.log(e)}} onMouseLeave={()=> setTermPop(null)}></TextField>
                        <Popover open={open} anchorEl={termPop}  
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }} 
                        onClose={()=>{setTermPop(null)}}   
                        disableRestoreFocus     
                        disableAutoFocus
                        disableEnforceFocus    
                        sx={{
                            pointerEvents: 'none',
                          }}>
                            <Box sx={{"m" : 1}}> 
                            <Typography>Input Format:  </Typography>
                            <Typography>&ensp; &#123;Rent&#125;,&#123;Application Fee&#125;,&#123;Security Deposit&#125;</Typography>
                            </Box>
                        </Popover>
                        <Stack direction="row" spacing={1}>
                        <TextField defaultValue={props.property.beds} error={errors["beds"]} type= "number" label="Beds" inputRef={beds}></TextField>
                        <TextField defaultValue={props.property.baths} error={errors["baths"]} type="number" label="Baths" inputRef={baths}></TextField>
                        <TextField defaultValue={props.property.dim} error={errors["sqft"]} type= "number" label="Sqft" inputRef={sqft}></TextField>
                        <Select value= {pets} onChange={(e) => setPets(e.target.value)} multiple
                            renderValue={(selected) => {
                                if (selected.length === 0 || selected[0] === "") {
                                  return <em>No Pets </em>;
                                }
                    
                                return selected.join(', ');
                              }}
                              displayEmpty

                        >
                        <MenuItem disabled value=""> <em>No Pets</em> </MenuItem>
                            <MenuItem value={"dogs"}>Dogs Allowed</MenuItem>
                            <MenuItem value={"cats"}>Cats Allowed</MenuItem>

                        </Select>

                        </Stack>
                        <TextField defaultValue={props.property.date} error={errors["date"]} label="Starting Date" inputRef={date} type="date" InputLabelProps={{ shrink: true }}></TextField>

                        <TextField defaultValue={props.property.contact} error={errors["contact"]} label="Contact Info" inputRef={contact}></TextField>
                        </Stack>
                    </Grid>
                    <Grid item xs={6} >
                    <Stack spacing={2}>
                    <TextareaAutosize defaultValue={props.property.summary} ref={ref => summary.current=ref} placeholder="Summary"  minRows={3} style={{"width" : "100%"}}></TextareaAutosize>
                    <Carousel autoPlay={false} navButtonsAlwaysVisible={true} index={index}>
                        { imageList.length > 0 ? imageList.map( (item, i) => <Slide key={i} pic={item} setImageList={setImageList} id={i} setIndex={setIndex}/>) : <Slide key={0} pic={null} setImageList={setImageList} id={-1} setIndex={setIndex}/>
                        }
                    </Carousel>
                    </Stack>
                    </Grid>
                    
                    </Grid>
           </Box>
        </DialogContent>

    </Dialog>


 )
}
function Slide(props){
    const uploadInputRef = useRef(null);
    function handleUpload(f){
        const r = new FileReader();
        r.addEventListener("load", () => { props.setImageList( (prev) => [...prev, r.result]) }, false)
        if(f){
            r.readAsDataURL(f)
        }
    }
    function handleDelete(){
        if(props.id != -1){
        props.setImageList((prev) => [].concat(prev.slice(0,props.id), prev.slice(props.id + 1)))
        props.setIndex(1)
        }
    }
    return (

        <Paper sx={{"px" : 10}}>
            {props.pic  ? 
            <img src={props.pic} width="100%" height="200" style={{"zIndex" : "-1"}}/> : <img width="100%" height="200" />}
            <Box direction="row" justifyContent="space-between" alignItems="center" sx={{"display" : "flex"}}>
                <Box>
                <input
                    ref={uploadInputRef}
                    accept="image/*"
                    type="file"
                    onChange={(e)=>{handleUpload(e.target.files[0]); e.target.value=''}}
                    hidden
                />
                    <IconButton  onClick={() => uploadInputRef.current && uploadInputRef.current.click()} component="span" variant="contained"> <AddCircleOutlineIcon fontSize="small"/> </IconButton>

                    <IconButton  onClick={()=>{handleDelete()}}>  <DeleteIcon fontSize="small" /></IconButton>
                
                </Box>
                </Box>
            
            
        </Paper>



    )



}