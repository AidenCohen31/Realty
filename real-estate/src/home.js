import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Header from "./appbar.js"
import Properties from './properties.js';
export default function Home(){


return (
    <Container maxWidth={false} disableGutters>
    <Header/>

    <Properties />
    </Container>
);

}