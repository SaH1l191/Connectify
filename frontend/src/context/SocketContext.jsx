import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import io from "socket.io-client";


const SocketContext = createContext()


export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {

  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const user = useRecoilValue(userAtom)

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: {
        userId: user?._id
      }
    })
    setSocket(socket)

    //after client sent uesrid query to socket backedn it will emit getOnlineUsers which will be triggered here

    socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});
    


    return () => socket && socket.close()

  }, [user?._id])

  return (
    <SocketContext.Provider value={{ socket , onlineUsers}}>
      {children}
    </SocketContext.Provider>
  )
}


