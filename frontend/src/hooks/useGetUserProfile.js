import { useToast } from '@chakra-ui/react'
import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'

const useGetUserProfile = () => {

    const toast = useToast()
    const [loading, setLoading] =useState(true)
    const {username }  = useParams()
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const getUser=async()=>{
            try{
                const res = await fetch(`/api/users/profile/${username}`)
                const data = await res.json()
                if(data.error){
                    toast({
                    title: "Error",
                    description: data.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    })
                    return
                }
                if(data.isFrozen){
                    setUser(null)
                    return ;
                }
                setUser(data)
            }
            catch(error){
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
            setLoading(false)
        }

        getUser()
    },[username,toast ])
        
        return {loading,user}
}

export default useGetUserProfile