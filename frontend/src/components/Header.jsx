import { Flex, Image, useColorMode, Link, Button } from '@chakra-ui/react'
import React from 'react'
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useRecoilValue } from 'recoil';
import useLogout from '../hooks/useLogout';

const Header = () => {

  const { colorMode, toggleColorMode } = useColorMode()
  const logout = useLogout();
  const user = useRecoilValue(userAtom);


  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to='/'>
          <AiFillHome size={24} />
        </Link>
      )}
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
          Login
        </Link>
      )}


      <Image alt="Logo" w={6}
        cursor={"pointer"}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />


      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>
          <Link as={RouterLink} to={`/settings`}>
            <MdOutlineSettings size={20} />
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}

      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
          Sign up
        </Link>
      )}

    </Flex>
  )
}

export default Header