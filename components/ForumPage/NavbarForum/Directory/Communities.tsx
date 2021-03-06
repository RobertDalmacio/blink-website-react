/* eslint-disable react/jsx-key */
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GrAdd } from 'react-icons/gr';
import { useRecoilValue } from "recoil";
import { communityState } from "../../../../atoms/communitiesAtom";
import { auth } from "../../../../firebase/clientApp";
import React, { useState } from "../../../../node_modules/react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import MenuListItem from "./MenuListItem";

const Communities:React.FC = () => {
    const [user] = useAuthState(auth);
    const [open, setOpen] = useState(false)
    const mySnippets = useRecoilValue(communityState).mySnippets

    return (
        <>
            <CreateCommunityModal 
                open={open} 
                handleClose={() => setOpen(false)}
                userId={user?.uid!}
            />
            <Box mt={3} mb={4}>
                <Text pl={3} mb={1} fontSize='7pt' fontWeight={500} bg='brand.400'>MODERATING</Text>
                {mySnippets
                    .filter(snippet => snippet.isModerator)
                    .map(snippet => (
                        <MenuListItem 
                        key={snippet.communityId} 
                        displayText={`b/${snippet.communityId}`} 
                        link={`/forum/b/${snippet.communityId}`}
                        imageURL={snippet.imageURL}
                        />
                    ))}
            </Box>
            <Box mt={3} mb={4}>
                <Text pl={3} mb={1} fontSize='7pt' fontWeight={500}  bg='brand.400'>MY COMMUNITIES</Text>
                <MenuItem 
                    width="100%" 
                    fontSize="10pt" 
                    _hover={{bg: 'brand.300', color: 'white'}}
                    onClick={() => setOpen(true)}
                    >
                    <Flex align="center">
                        <Icon as={GrAdd} fontSize={20} mr={2}/>
                        Create Community
                    </Flex>
                </MenuItem>
                {mySnippets.map(snippet => (
                    <MenuListItem 
                    key={snippet.communityId} 
                    displayText={`b/${snippet.communityId}`} 
                    link={`/forum/b/${snippet.communityId}`}
                    imageURL={snippet.imageURL}
                    />
                ))}
            </Box>
        </>
    )
}
export default Communities;