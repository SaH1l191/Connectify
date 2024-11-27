import { Avatar, Divider, Flex, useColorModeValue, Text, Image, Skeleton, SkeletonCircle } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Messages from './Messages'
import MessageInput from './MessageInput'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from "../context/SocketContext.jsx";
import messageSound from "../assets/sounds/message.mp3";


const MessageContainer = () => {

    const showToast = useShowToast();
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const currentUser = useRecoilValue(userAtom);
    const setConversations = useSetRecoilState(conversationsAtom);
    console.log("logging messages in msgcontainer ", messages)
    console.log("selectedConversations", selectedConversation)


    const messageEndRef = useRef(null);
    const { socket } = useSocket();

    useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);


    useEffect(() => {

        const getMessages = async () => {

            setLoadingMessages(true);
            setMessages([]);
            try {
                if (selectedConversation.mock) return;
                const res = await fetch(`/api/messages/${selectedConversation.userId}`);
                const data = await res.json();
                console.log("logging data here ", data)
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setMessages(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingMessages(false);
            }
        };

        getMessages();
    }, [useShowToast, selectedConversation.userId]);



    useEffect(() => {
        socket.on("newMessage", (message) => {
            if (selectedConversation._id === message.conversationId) {
                setMessages((prev) => [...prev, message])
            }


            if (!document.hasFocus()) {
                const sound = new Audio(messageSound);
                sound.play();
            }

            setConversations((prev) => {
                const updatedConversation = prev.map((conversation) => {
                    if (conversation._id === message.conversation) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender,
                            },
                        }
                    }
                    return conversation
                })
                return updatedConversation
            })
        })

        return () => socket.off("newMessage");

    }, [socket, selectedConversation, setConversations])


    useEffect(() => {
        const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
        if (lastMessageIsFromOtherUser) {
            socket.emit("markMessagesAsSeen", {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId,
            });
        }

        socket.on("messagesSeen", ({ conversationId }) => {
            if (selectedConversation._id === conversationId) {
                setMessages((prev) => {
                    const updatedMessages = prev.map((message) => {
                        if (!message.seen) {
                            return {
                                ...message,
                                seen: true,
                            };
                        }
                        return message;
                    });
                    return updatedMessages;
                });
            }
        });
    }, [socket, currentUser._id, messages, selectedConversation]);


    return (
        <Flex
            flex='70'
            bg={useColorModeValue("gray.200", "gray.dark")}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
        >

            {/* message header */}
            <Flex w={'full'} h={12} alignItems={"center"} gap={2} >
                <Avatar src='' size={"sm"} />
                <Text display={"flex"} alignItem={"center"}>
                    {selectedConversation.username}
                    <Image src='/verified.png' w={4} h={4} ml={1} />

                </Text>
            </Flex>

            <Divider />
            {/* messages */}


            {/* just showing the left right sernder and receiver texts  */}
            <Flex flexDirection={'column'} gap={2} p={1} height={"400px"} overflowY={"auto"}>
                {loadingMessages &&
                    [...Array(20)].map((_, i) => (
                        <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={'md'} alignSelf={
                            i % 2 === 0 ? "flex-start" : "flex-end"
                        } >
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex flexDir={"column"} gap={2}>
                                <Skeleton h='8px' w='250px' />
                                <Skeleton h='8px' w='250px' />
                                <Skeleton h='8px' w='250px' />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}


                        </Flex>

                    ))
                }

                {!loadingMessages &&
                    messages.map((message) => (
                        <Flex
                            key={message._id}
                            direction={"column"}
                            ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}

                        >
                            <Messages message={message} ownMessage={currentUser._id === message.sender} />
                        </Flex>
                    ))}
            </Flex>
            <MessageInput messages={messages} setMessages={setMessages} />
        </Flex>
    )
}

export default MessageContainer