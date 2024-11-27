import  React, { useRef, useState } from "react";
import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";


const CreatePost = () => {

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const imageRef = useRef(null);

    const maxChar = 500
    const user = useRecoilValue(userAtom);
    const [remainingChar,setRemainingChar] = useState(maxChar)
    const [postText,setPostText] = useState("")
	const [loading, setLoading] = useState(false);
    const [post,setPost] = useRecoilState(postAtom)

    const handleTextChange=(e)=>{
        let inputText = e.target.value;
        if(inputText>maxChar){
            const truncatedText = inputText.slice(0,maxChar);
            setRemainingChar(truncatedText)
            setPostText(truncatedText)
        }
        else{
            setPostText(inputText)
            setRemainingChar(maxChar-inputText.length)
        }
    }
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

    const handleCreatePost=async()=>{
        setLoading(true);
        try{
            const res= await fetch(`/api/posts/create`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(
                    {
                        postedBy: user._id, postText, img: imgUrl
                    }
                )
            })
            const data = await res.json();
			if (data.error) {
                toast({
                    title:"Error",
                    description: data.error,
                    status : "error",
                    duration : 3000,
                    isClosable:true
                  
                  })
				return;
			}
            toast({
                title:"Success",
                description: "Post created successfully",
                status : "success",
                duration : 3000,
                isClosable:true
              
              })
              //setter funciton from teh recoil 
              // so seeting the new post (in var data) and the rest posts as it is  
              setPost([data , ...post])
                onClose();
			    setPostText("");
			    setImgUrl("");
        }
        catch(error){
            toast({
                title:"Error",
                description: error.message,
                status : "error",
                duration : 3000,
                isClosable:true
              
              })
        }
        finally{
            setLoading(false);
        }
    }


    return (<>
        <Button
				position={"fixed"}
				bottom={10}
				right={5}
				bg={useColorModeValue("gray.300", "gray.dark")}
				onClick={onOpen}
				size={{ base: "sm", sm: "md" }}
			>
				<AddIcon/>
			</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder='Post content goes here..'
								onChange={handleTextChange}
								value={postText}
							/>
							<Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
								{remainingChar}/{maxChar}
							</Text>

							<Input type='file' hidden ref={imageRef} onChange={handleImageChange} />

							<BsFillImageFill
								style={{ marginLeft: "5px", cursor: "pointer" }}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>

						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt='Selected img' />
								<CloseButton
									onClick={() => {
										setImgUrl("");
									}}
									bg={"gray.800"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
    </>
    )
}

export default CreatePost