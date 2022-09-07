
import {Alert, Card, TextField, Box, Spacer, Button} from '@mui/material'
import axios from 'axios'
import {useRef, useState} from 'react'
export default function Maintenence(props){
    const msg = useRef(null)
    const [complete, setComplete] = useState(false);
    function handleSubmit(){
        axios.get("/api/maintenance", {params:{"email": props.user.email,"msg" : msg.current.value  }}).then((

            setComplete(true)
        ))

    }
    return (

        <Card sx={{"m" : 1, "maxWidth":"50%", "p" : 2}}>
                <Box sx={{"m" : 2}}><h2>Create a New Maintenance Request</h2> </Box>
                <Alert severity="info" sx={{"m" : 2}}> Explain the details of the issue </Alert>
                { complete ? <Alert sx={{"m" : 2}}> Explain the details of the issue </Alert> : null}

                <Box sx={{"m" : 2   }}><TextField minRows={4} multiline fullWidth /></Box>
                <Box sx={{"justifyContent" : "right", "display" : "flex"}} onClick={()=>handleSubmit}> <Button> Submit</Button></Box>
        </Card>

    )

}