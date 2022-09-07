
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AdbIcon from '@mui/icons-material/Adb';
import Grid from '@mui/material/Grid';
import { useWindowDimensions } from './hooks';
import { useNavigate } from 'react-router-dom';
export default function Header(){
    let navigate = useNavigate();
    return (
        <AppBar  sx={{"backgroundColor" : "white", "position" : "static"}}>
        <Toolbar sx={{"pb" : 3}}>
        <Box alignItems="center" justifyContent="space-between" sx={{"display" : "flex","flexWrap" : "noWrap", "width" : "100%"}}>
        <Box sx={{"maxWidth" : "20%"}}>
        <img src={"/logo.jpeg"} style={{"maxWidth": "100%" ,"maxHeight": 100}}></img>
        </Box>
            <Box sx={{"justifyContent" : "center"}}>
        { Object.entries({"Availability" : "/properties", "Portal" : "/portal"}).map((value, i) => (
                    <Button
                    key={i}
                    sx={{ color: 'black', "mx" : 1}}
                    onClick={navigate(value[1])}
                  >
                    {value[0]}
            </Button>

        ))
        
        }
        </Box>
        <Box display="flex" sx={{"maxWidth" : "30%","justifyContent" : "flex-end", "height" : "auto"}}>
        <Button variant="outlined" style={{"width": 200, "height" :70}} color="error">
            See Listings
        </Button>
        </Box>
        </Box>
        </Toolbar>
    </AppBar>
    );
}
