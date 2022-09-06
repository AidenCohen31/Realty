
import {Alert, Card, TextField, Box, Spacer} from '@mui/material'

export default function Maintenence(){

    return (

        <Card sx={{"mt" : 1, "maxWidth":"50%", "p" : 2}}>
                <Box sx={{"m" : 2}}><h2>Create a New Maintenance Request</h2> </Box>
                <Alert severity="info" sx={{"m" : 2}}> Explain the details of the issue </Alert>
                <Box sx={{"m" : 2   }}><TextField minRows={4} multiline fullWidth /></Box>

        </Card>

    )

}