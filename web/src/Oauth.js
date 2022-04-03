import React, { useState } from 'react'
import axios from 'axios'

function Oauth() {
    
    const [staffs, setStaffs] = useState([]);
    const [name, setName] = useState([]);
    const [team, setTeam] = useState([]);
    function getStaff() {
        axios.get('http://localhost:8000/staffs', { crossdomain: true })
             .then(response => {
                 setStaffs(response.data.data);
                 console.log(response.data);
             })
    }

    function addStaff() {
        axios.post('http://localhost:8000/staff', { crossdomain: true, "name" : name,
        "team" : team })
            
             .then(response => {
                 console.log(response.data);
                 getStaff();
             })
    }

    function deleteStaff(id) {
        axios.delete(`http://localhost:8000/staff/${id}`, { crossdomain: true})
            
             .then(response => {
                 console.log(response.data);
                 getStaff();
             })
             console.log(id)
    }

    function handleName(e){ 
        console.log(e.target.value);
        setName(e.target.value)
    }

    function handleTeam(e){ 
        console.log(e.target.value);
        setTeam(e.target.value)
    }

    return (
        <div>
            <div>
            <button onClick={getStaff}>
                Get staff 
            </button>
            </div>
            <div>    
            <h3>{"name : "}</h3>
            <input value={name} onChange={handleName}></input>
            <input value={team} onChange={handleTeam}></input>
            <button onClick={addStaff}>
                Add staff 
            </button>
            </div>
            {staffs.map((staff)=>(
                <div>
                <h1>{staff.name}</h1>
                <h3>{"team : " + staff.team }</h3>
                <button onClick={()=>deleteStaff(staff.id)}>
                    Delete Staff</button>
                </div>
            ))}

            
        </div>
    );
}
export default Oauth