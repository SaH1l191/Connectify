import { Avatar, Box, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsThreeDots } from "react-icons/bs";
import Actions from './Actions';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DeleteIcon } from "@chakra-ui/icons";
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postAtom';
import { formatDistanceToNow } from "date-fns";

const Post = ({ postedBy, post }) => {

  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  console.log("poosts from post compoonent ", post)
  //fetching the postprofileUser link 
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedBy])

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    }
    catch (error) {
      showToast("Error", error.message, "error");
    }
  }
 if(!user) return null 
   
  return (
    // post is a complete link itself 
    <>
    
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Avatar src={user.profilePic} name={user.name}
            onClick={(e) => { e.preventDefault(); navigate(`/${user.username}`) }}
            size={{ base: "md", md: "xl" }} />
          {/* line will stretch accoding to the post to its right side */}
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>

          <Box position={'relative'} w={'full'}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {
              post.replies[0] && (
                <Avatar
                  size='xs'
                  name='John doe'
                  src={post.replies[0].userProfilePic}
                  position={"absolute"}
                  top={"0px"}
                  left='15px'
                  padding={"2px"}
                />
              )}

            {post.replies[1] && (
              <Avatar
                size='xs'
                name='John doe'
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right='-5px'
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size='xs'
                name='John doe'
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left='4px'
                padding={"2px"}
              />
            )}

          </Box>
        </Flex>


        {/* post content */}
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={'full'} alignItems={"center"}>
              <Text fontSize={"xs"} fontWeight={'bold'}
                onClick={(e) => { e.preventDefault(); navigate(`/${user.username}`) }}>
                {user?.username}</Text>
              <Image src='/verified.png' w={4} h={4} mt={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} fontSize={'xs'} width={36} color={"gray.light"} textAlign={"right"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              <BsThreeDots />

              {currentUser._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}

            </Flex>
          </Flex>


          <Text fontSize={"md"}>{post.text}</Text>
          <Box borderRadius={6} overflow={'hidden'}
            borderColor={"gray.light"}>

            <Image src={post.img} w={'full'} />

          </Box>
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>




        </Flex>
      </Flex>


    </Link>
    </>
  )
}

export default Post