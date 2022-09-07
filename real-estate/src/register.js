import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import Alert from '@mui/material/Alert';

export default function Register() {
  const [address, setAddress] = React.useState([])
  const [admin, setAdmin] = React.useState(false);
  const [error, setError] = React.useState(["",""]);
  const [text, setText] = React.useState("")
  const firstName = React.useRef(null);
  const lastName = React.useRef(null);
  const email = React.useRef(null);
  const password = React.useRef(null);
  const addr = React.useRef(null);
  const ad = React.useRef(null);
  const captcha = React.useRef(null);
  let navigate = useNavigate()


  async function handleSubmit(event){
    event.preventDefault();
    const data = new FormData();
    data.append("first", firstName.current.value)
    data.append("last", lastName.current.value)
    data.append("email", email.current.value )
    data.append("password", password.current.value)
    data.append("address", ad.current.control.checked ? "admin" : addr.current.value)
    data.append("admin", ad.current.control.checked ? 1 : 0);
    data.append("recap", captcha.current.getValue())
    captcha.current.reset();

    for(const i of data.entries()){
      

        if(i[1] === ""){
            console.log(i)
            setError(["error", "Form not fully filled in"])
            return;
        }
    }
    const resp = await axios.get("/api/email")
        if(resp.data.includes(email.current.value) ){
            setError(["error", "duplicate email used"])
            return;
        }
        
   

   const r = await axios.post("/api/register" , data)
        if(r.data.success){
        setError( ["success","Thanks for registering, login will unavailable until confirmed by admins"])
        }
        else{
            setError(["error", "registering failed"])
            
        }


  }
  React.useEffect(() => {
    axios.get("/api/managed").then( (r) => {r.data.map((obj) => {setAddress((prev) => [...prev,obj.address])})})
  },[])  

  return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems  : 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          
          <Box component="form" noValidate onSubmit={(e) => {handleSubmit(e)}} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            { error[1] !== "" ? 
              <Grid item xs={12}>
            <Alert severity={error[0]}>{error[1]}</Alert>

              </Grid> : null}
              <Grid item xs={12} sm={6}>
                <TextField
                  inputRef={firstName}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  inputRef={lastName}

                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                inputRef={email}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                inputRef={password}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                inputRef={addr}
                select
                fullWidth
                disabled={admin}
                value={admin ? "" : text }
                onChange={(e) => {setText(e.target.value)}}
                label="Address">
                    <MenuItem value={"other"}> Other </MenuItem>
                    {
                        [...address].map((obj) => (<MenuItem value={obj}>{obj}</MenuItem>))

                    }
                </TextField>

              </Grid>
              <Grid item  xs={3}>
              <FormControlLabel ref={ad} control={<Checkbox onChange={() => setAdmin((prev)=>!prev)} />} label="Admin?" />
              </Grid>
            
            <Grid item xs={6} >

            <ReCAPTCHA
                 sitekey="6Lfv6NEhAAAAAMbZKPu8UiRp8TnhxMeeuD-SZLCM"
                 ref ={captcha}
                 />  
            </Grid>
     
                          
  
            </Grid>
                <br/>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}