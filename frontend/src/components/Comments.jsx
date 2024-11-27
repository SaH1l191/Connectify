import { Avatar, Divider, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'
import { Link, useNavigate } from 'react-router-dom'

const Comments = ({reply,lastReply}) => {
    const [liked,setLiked] = useState(false)
	const navigate = useNavigate()

	const commenter = reply.username
	console.log(commenter)

  return (
    <>
    <Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar src={reply.userProfilePic} size={"sm"} cursor={"pointer"} onClick={() => navigate(`/${commenter}`)}/>
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"} onClick={() => navigate(`/${commenter}`)}>
						<Text fontSize='sm' fontWeight='bold ' cursor={"pointer"}  
						_hover={{
							textDecorationLine:"underline"
						}}
						>
							{reply.username} 
						</Text>
					</Flex>
					<Text>{reply.text}</Text>
				</Flex>
			</Flex>
			{!lastReply ? <Divider /> : null}

    </>
  )
}

export default Comments