import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from 'axios'
export default function Confirm(){
    const params = useParams()
    const [msg, setMsg] = useState(null);
    useEffect( ()=>{
        axios.post(
            "http://localhost:5000/api/confirm/" + params.id ).then( (e)=>{
                setMsg(JSON.stringify(e.data))

            }


            )}

    , [])


    return (

        <p>{msg} </p>

    );


}