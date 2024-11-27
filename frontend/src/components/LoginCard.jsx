
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { authScreenAtom } from '../atoms/authAtom'
import userAtom from '../atoms/userAtom'

export default function LoginCard() {

    const toast = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [inputs, setInputs] = useState({
        username: "", password: ""
    })

    const setUser = useSetRecoilState(userAtom);
    // console.log("loggign useratom state ",userAtom)

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    // tells that input is of json format to the server
                    "Content-Type": "application/json"
                },
                // used when the input contains java script objcet to json output 
                body: JSON.stringify(inputs)
            })
            const data = await res.json()
            console.log(data)
            if (!res.ok) {
                // This will handle any error response from the server
                toast({
                    title: "Error",
                    description: data.error || "Login failed",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return; // Stop further execution if there was an error
            }
            localStorage.setItem('user-threads', JSON.stringify(data))
            setUser(data)
        }
        catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: data.error,
                status: "error",
                duration: 3000,
                isClosable: true
            })
        }
    }



    // this return a setter function 
    const setAuthScreenState = useSetRecoilState(authScreenAtom)

    return (
        <Flex
            align={'center'}
            justify={'center'}
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Login
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={'lg'}
                    p={8}
                    w={{
                        base: "full",
                        sm: "400px",
                    }}>
                    <Stack spacing={4}>
                        <FormControl id="username" isRequired>
                            <FormLabel>UserName</FormLabel>
                            <Input type="text" value={inputs.username}
                                onChange={(e) => { setInputs({ ...inputs, username: e.target.value }) }} />
                        </FormControl>

                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={inputs.password}
                                    onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
                                />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                onClick={handleLogin}
                                loadingText="Submitting"
                                size="lg"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Sign In
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Don't have an account? <Link color={'blue.400'}
                                    onClick={() => setAuthScreenState("signup")}>Sign up</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}