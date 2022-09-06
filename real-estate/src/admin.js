export default function Admin(props){

    return (
        
        <div>
        {props.admin ? <p> Admin</p> : <p> Not Admin</p>}
        </div>

    )

}