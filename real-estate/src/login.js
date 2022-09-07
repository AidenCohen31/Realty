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
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GoogleLogin from 'react-google-login';
import {useEffect, useState} from 'react'
import { gapi } from 'gapi-script';
import axios from 'axios';
import Alert from '@mui/material/Alert'
import { createRoutesFromChildren } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function Login(props) {
  let email = React.useRef(null)
  let pass = React.useRef(null)
  const [error, setError] = React.useState(["",""])
  let navigate = useNavigate()
  async function handleSubmit(params){
      const fd = new FormData()
      for (const i of Object.entries(params)){
        console.log(i)
        fd.append(i[0], i[1])
      }
      console.log(fd)
       await axios.post("/api/login", fd).then(
          (r) => {
            console.log(r)
              if("csrf" in r.data){

                  props.setCSRF(r.data["CSRF"])
                  navigate("/portal", {state: {csrf: props.csrf}})

              }
              else{
                setError(["error", "Failed Authentication"])
              }
          }


       )
  }
  let clientId='1052655601857-kcn7hhr8igo5943uks9govuil8mh36u6.apps.googleusercontent.com'
  useEffect(() => {
    const initClient = () => {
          gapi.auth2.init({
          clientId: clientId,
          scope: ''
        });
     };
     gapi.load('client:auth2', initClient);
 });
   return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        { error[1] !== "" ? 
              <Grid item xs={12}>
            <Alert severity={error[0]}>{error[1]}</Alert>

              </Grid> : null}
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={(e)=>{e.preventDefault(); handleSubmit({email : email.current.value, password:pass.current.value})}}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              inputRef={email}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              inputRef={pass}
              id="password"
              autoComplete="current-password"
            />
            <Grid container>
              <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            </Grid>
            <Grid item xs={6} style={{"display" :"flex" , "alignItems" : "center", "justifyContent" : "center"}}>
            <GoogleLogin
              clientId={clientId}
              buttonText="Sign in with Google"
              onSuccess={(r)=>handleSubmit({email : r.getBasicProfile().getEmail(), oauth:true})}
            ></GoogleLogin>
            </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}

