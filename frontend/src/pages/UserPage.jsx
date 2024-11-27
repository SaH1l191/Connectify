import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { Flex, Spinner } from '@chakra-ui/react'
import Post from "../components/Post";
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useRecoilState } from 'recoil';
import postAtom from '../atoms/postAtom';
import useShowToast from '../hooks/useShowToast';
import { useNavigate, useParams } from 'react-router-dom';
const UserPage = () => {


  const { username } = useParams()
  const [post, setPost] = useRecoilState(postAtom)
  const showToast = useShowToast()
  const [fetchingPosts, setFetchingPosts] = useState(true)
  //need to load the user(any) dynamically from the params 
  const { user, loading } = useGetUserProfile()
  const navigate = useNavigate()
  console.log("fetchign the user profile based on username ", user)

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return
      setFetchingPosts(true)
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        console.log("control reached post api ");
        const data = await res.json();

        setPost(data);

      }
      catch (error) {
        showToast("Error", error.message, "error");
        setPost([]);
        navigate("/")

      }
      finally {
        setFetchingPosts(false)
        console.log("control readcahed here ")
      }
    }

    getPosts()
  }, [username, user, setPost, showToast])







  if (!user && loading) {
    return <h1>User not found or invalid username.</h1>;
  }

  // if ( !user) {
  //   return <h1>User not found or invalid username.</h1>; // Error message for invalid username
  // }


  console.log(post);

  return (
    <>
      <UserHeader user={user} />
      {/* <UserPost likes={10} replies={5}  postTitle="Post title"/>
    <UserPost likes={10} replies={5}  postTitle="Post title"/>
    <UserPost likes={10} replies={5}  postTitle="Post title"/>
    <UserPost likes={10} replies={5}  postTitle="Post title"/> */}

      {!fetchingPosts && post.length === 0 && <h1>User has not posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {
        post.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))
      }
    </>
  )
}

export default UserPage