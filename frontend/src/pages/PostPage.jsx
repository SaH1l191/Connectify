import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react' 
import Actions from '../components/Actions'
import Comments from '../components/Comments'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useNavigate, useParams } from 'react-router-dom'
import postAtom from '../atoms/postAtom'
import useShowToast from '../hooks/useShowToast'
import { formatDistanceToNow } from "date-fns";
const PostPage = () => {
  // in routes we have used pid . so use pid here or else it wont wokr 
  const { user, loading } = useGetUserProfile()
  const currentUser = useRecoilState(userAtom)
  const navigate = useNavigate()
  const { pid } = useParams();
  console.log("pid", { pid })
  const [posts, setPosts] = useRecoilState(postAtom)
  const useToast = useShowToast()

  //getting a particular post means that
  // logic here is to reeset postsAtom and fetch particular post api and set the postAtom to that post 


  let currentPost = posts[0]
  useEffect(() => {
    const getPost = async () => {
      setPosts([])
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          useToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);

      }
      catch (error) {
        useToast("Error", error.message, "error");
      }

    }
    getPost()
  }, [pid, setPosts])



  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        useToast("Error", data.error, "error");
        return;
      }
      useToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      useToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;
  console.log("currentPost", currentPost);



  return (
    <>

      {/* name and verified + image logo */}
      <Flex>
        
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src={user.profilePic} size={"md"} onClick={(e) => { e.preventDefault(); navigate(`/${user.username}`) }} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={600} onClick={(e) => { e.preventDefault(); navigate(`/${user.username}`) }}>{user.username}</Text>
            <Image src='/verified.png' w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        {/* rgiht side 3dots and time */}
        <Flex gap={4} alignItems={"center"}>
          <Text fontStyle={"sm"} fontSize={'xs'} width={36} color={"gray.light"} textAlign={"right"}>{formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text>
         
        </Flex>
      </Flex>


      {currentUser?._id === user._id && (
        <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
      )}

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      {/* actions */}
      <Flex gap={3} my={1}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />


      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"} >Get the app to like , reply and post .</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />


      {/* <Comments comment={"hey this looks great"} createdAt={"1d"} likes={4}/>
      <Comments comment={"Nah "} createdAt={"3d"} likes={4}/>
      <Comments comment={"I like it "} createdAt={"2d"} likes={4}/>
      <Comments comment={"Nah "} createdAt={"4d"} likes={4}/> */}
      {currentPost.replies.map((reply) => (
        <Comments 
          key={reply._id}
          reply={reply}
          lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
        />
      ))}
    </>
  )
}

export default PostPage