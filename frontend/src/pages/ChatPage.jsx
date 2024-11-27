import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Conversations from '../components/Conversations'
import { GiConversation } from "react-icons/gi";
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {

  const [loadingConversations, setLoadingConversations] = useState(false)
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom)

  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast(); 
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);

  console.log("converstaion logging from cahpage", conversations)




  const { socket, onlineUsers } = useSocket();

	useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);




  const handleConversationSearch = async (e) => {
    e.preventDefault()
    setSearchingUser(true)
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }
      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: ""
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic
          }
        ]
      }
      setConversations((prevConvs) => [...prevConvs, mockConversation])

    }
    catch (error) {
      showToast("Error", error.message, "error");
    }
    finally {
      setSearchingUser(false);
    }
  }

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");

        const data = await res.json();
        console.log("data", data)
        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }
        console.log(data)
        setConversations(data)
      } catch (error) {
        showToast("Error ", error.message, "error")
      }
      finally {
        setLoadingConversations(false)
      }
    }
    getConversations()
  }, [setConversations])


  return (
    <Box
      position={"absolute"} left={"50%"} alignItems={"center"} justifyContent={"center"}
      transform={"translateX(-50%)"}
      // border={"1px solid red"}
      w={{ base: "100%", md: "80%", lg: "750px" }} p={4}
    >


      <Flex gap={4} flexDirection={{ base: "column", md: "row" }} mx={"auto"} maxW={{ sm: "400px", md: "full" }}>

        <Flex flex={30} flexDirection={"column"} gap={2} maxW={{ sm: "250px", md: "full" }}>
          {/* conversations list */}
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
            Your Conversations
          </Text>

          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2} >
              <Input type="text" placeholder={"Search..."} onChange={(e) => setSearchText(e.target.value)} />
              <Button size={"sm"} isLoading={searchingUser} onClick={handleConversationSearch}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {/* loading state in user search filter  */}
          {loadingConversations && (
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex key={i} gap={4} alignItems={"center"} borderRadius={"md"} p={2} bg={useColorModeValue("gray.200", "gray")}
              >
                <Box>
                  <SkeletonCircle size={10} />
                </Box>
                <Flex w={'full'} flexDirection={'column'} gap={3}

                >
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />

                </Flex>

              </Flex>
            ))
          )}

          {
            !loadingConversations &&
            (
              conversations.map((conversation) => (
                <Conversations key={conversation._id} conversation={conversation} 
                isOnline={onlineUsers.includes(conversation.participants[0]._id)}/>
              ))
            )
          }

        </Flex>




        {/* conditiaonlly rendering the text */}
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}

        {selectedConversation._id && <MessageContainer />}
      </Flex>

    </Box>
  )
}

export default ChatPage