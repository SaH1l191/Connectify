import { Avatar, AvatarBadge, Flex, Image, useColorModeValue, WrapItem, Text, Stack, useColorMode, Box } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from "../atoms/userAtom";
import { selectedConversationAtom } from '../atoms/messagesAtom';
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
const Conversations = ({ conversation, isOnline }) => {


  const user = conversation.participants[0];
  const currentUser = useRecoilValue(userAtom)
  const text = conversation.lastMessage.text;
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const lastMessage = conversation.lastMessage;
  const colorMode = useColorMode()
  console.log('lastMessage', lastMessage)
  console.log("selectedConverstion", selectedConversation);
  return (
    <Flex gap={4} alignItems={'center'} p={1} _hover={{
      cursor: 'pointer',
      bg: useColorModeValue('gray.600', 'gray.light'), color: 'white'
    }} borderRadius={'md'}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
          mock: conversation.mock
        })
      }
      bg={
        selectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.400" : "gray.600") : ""
      }

    >
      <WrapItem>
        <Avatar
          src={user.profilePic}
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }} >
          {/* is oneline  */}
          {isOnline ? <AvatarBadge boxSize='1em' bg='green.500' /> : ""}
        </Avatar>
      </WrapItem>


      <Stack direction={"column"} fontSize={"sm"}


      >
        <Text fontWeight='700' display={"flex"} alignItems={"center"}>
          {user.username} <Image src='/verified.png' w={4} h={4} ml={1}
          />
        </Text>

        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser._id === lastMessage.sender ? (
            // sent or received tick display 
            <Box color={lastMessage.seen ? "blue.400" : ""}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ""
          )}
          {/* truncate  */}
          {lastMessage.length > 18
            ? lastMessage.substring(0, 18) + "..."
            : lastMessage.text || <BsFillImageFill size={16}

            />}
        </Text>
      </Stack>

    </Flex>
  )
}

export default Conversations