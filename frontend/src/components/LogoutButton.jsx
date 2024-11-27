import { Button, useToast } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import {  useNavigate } from 'react-router-dom'
import userAtom from '../atoms/userAtom'

const LogoutButton = () => {

    const setUser = useSetRecoilState(userAtom)
    const toast = useToast()
    const navigate = useNavigate()
    
    const handleLogout=async()=>{
        try{
          const res = await fetch("/api/users/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
    
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
    
          localStorage.removeItem("user-threads");
          setUser(null);

          navigate ("/auth")
        }  
        catch(error){
            console.log('Error: ', error);
        }
    }



  return (
    <Button position={'fixed'} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
        Logout

    </Button>
  )
}

export default LogoutButton