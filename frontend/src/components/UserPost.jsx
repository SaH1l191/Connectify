import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BsThreeDots } from "react-icons/bs";
import Actions from './Actions';
const UserPost = ({likes,replies,postTitle}) => {


    
	const [liked, setLiked] = useState(false);

  return (
    // post is a complete link itself 
    <Link to='/markzuckerberg/post/1'>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={'column'} alignItems={'center'}>
                <Avatar src='/zuck-avatar.png' name='Zuckerberg' 
                size={{base : "md"  , md : "xl"}}/>
                {/* line will stretch accoding to the post to its right side */}
                <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                
                <Box position={'relative'} w={'full'}>
                    <Avatar size={"xs"} src='/zuck-avatar.png' position={'absolute'} top={"2px"}
                    padding={"2px"} left={"1px"}/>
                    <Avatar size={"xs"} src='/zuck-avatar.png' position={'absolute'} top={"0px"}
                    padding={"2px"} left={"15px"} right={"-5px"}/>
                    <Avatar size={"xs"} src='/zuck-avatar.png' position={'absolute'} bottom={"0px"}
                    padding={"2px"} left={"4px"}/>
                
                </Box>
            </Flex>
            

            {/* post content */}
            <Flex flex={1} flexDirection={'column'} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={'full'} alignItems={"center"}>
                        <Text fontSize={"xs"} fontWeight={'bold'}>markzuckerberg</Text>
                        <Image src='/verified.png' w={4} h={4} mt={1}/>  
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
                        <BsThreeDots/>

                    </Flex>
                </Flex>

                
                    <Text fontSize={"md"}>{postTitle}</Text>
                    <Box borderRadius={6} overflow={'hidden'} 
                    borderColor={"gray.light"}>

                        <Image src='/post1.png' w={'full'} />
                        
                    </Box>
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked} replies={replies} likes={likes}/>
                    </Flex> 

                    
               

            </Flex>
        </Flex>


    </Link>
  )
}

export default UserPost