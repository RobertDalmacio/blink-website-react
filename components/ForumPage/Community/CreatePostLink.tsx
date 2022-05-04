import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import {useAuthState} from 'react-firebase-hooks/auth'
import { BsLink45Deg } from "react-icons/bs";
import { IoImageOutline, IoCreate  } from "react-icons/io5";
import {useSetRecoilState} from 'recoil'
import {authModalState} from '../../../atoms/authModalAtom'
import {auth} from '../../../firebase/clientApp'

type CreatePostProps = {};

const CreatePostLink: React.FC<CreatePostProps> = () => {
    const router = useRouter();
    const [user] = useAuthState(auth)
    const setAuthModalState = useSetRecoilState(authModalState)

    const onClick = () => {
        if(!user) {
            setAuthModalState({open: true, view:'login'})
            return
        }
        const {communityId} = router.query
        router.push(`/forum/b/${communityId}/submit`)
    }
    
    return (
        <Flex
        justify="space-evenly"
        align="center"
        bg="brand.400"
        height="56px"
        borderRadius={4}
        border="1px solid"
        borderColor="black"
        p={2}
        mb={4}
        >
        <Icon as={IoCreate} fontSize={38} mr={4} />
        <Input
            placeholder="Create Post"
            fontSize="10pt"
            _placeholder={{ color: "gray.500" }}
            _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
            }}
            _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
            }}
            bg="gray.50"
            borderColor="gray.200"
            height="36px"
            borderRadius={4}
            mr={4}
            onClick={onClick}
        />
        <Icon
            as={IoImageOutline}
            fontSize={24}
            mr={4}
            cursor="pointer"
        />
        <Icon as={BsLink45Deg} fontSize={24} cursor="pointer" />
        </Flex>
    );
};
export default CreatePostLink;