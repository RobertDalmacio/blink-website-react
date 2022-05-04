/* eslint-disable jsx-a11y/alt-text */
import { Flex, Image } from "@chakra-ui/react";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../../../firebase/clientApp'
import Directory from "./Directory/Directory";

const NavbarForum:React.FC = () => {
    const [user, loading, error] = useAuthState(auth)
    return (
        <>
            <Flex 
                bg='brand.400' 
                height='44px' 
                padding='6px 12px'
                justify={{md: 'space-between'}}
            >
                <Flex align='center' width={{base: '40px', md:'auto'}} mr={{base: 0, md: 2}}>
                    <Image src='/logos/BLINK.webp' height='50px'/>
                </Flex>
                {user && <Directory />}
                <SearchInput user={user}/>
                <RightContent user={user}/> 
            </Flex>
        </>
    )
}
export default NavbarForum;