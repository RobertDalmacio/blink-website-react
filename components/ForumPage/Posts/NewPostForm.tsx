import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { firestore, storage } from '../../../firebase/clientApp';
import useSelectFile from '../../../hooks/useSelectFile';
import ImageUpload from './PostForm/ImageUpload';
import TextInputs from './PostForm/TextInputs';
import TabItem from './TabItem';

type NewPostFormProps = {
    user: User
    communityImageURL?: string
};

const formTabs: TabItem[] = [
    {
        title: 'Post',
        icon: IoDocumentText
    },
    {
        title: 'Images & Video',
        icon: IoImageOutline
    }
]

export type TabItem = {
    title: string
    icon: typeof Icon.arguments
}

const NewPostForm:React.FC<NewPostFormProps> = ({user, communityImageURL}) => {
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
    const [textInputs, setTextInputs] = useState({title:'', body:''})
    const {selectedFile, setSelectedFile, onSelectFile} = useSelectFile()
    const selectFileRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleCreatePost = async () => {
        const {communityId} = router.query
        const { title, body } = textInputs;
        setLoading(true)
        try {
            const postDocRef = await addDoc(collection(firestore, 'posts'), {
                communityId,
                communityImageURL: communityImageURL || '',
                creatorId: user.uid,
                userDisplayText: user.email!.split("@")[0],
                title,
                body,
                numberOfComments: 0,
                voteStatus: 0,
                createdAt: serverTimestamp(),
                editedAt: serverTimestamp(),
            })
            console.log("HERE IS NEW POST ID", postDocRef.id);

            if (selectedFile) {
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
                await uploadString(imageRef, selectedFile, "data_url")
                const downloadURL = await getDownloadURL(imageRef)

                await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                })
                console.log("HERE IS DOWNLOAD URL", downloadURL)
            }
            router.back()
        } catch (error) {
            console.log('handleCreatePost error', error.message)
            setError(true)
        }
        setLoading(false)
    }

    const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0])
        }
    
        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target?.result as string)
            }
        }
    }

    const onTextChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {target: {name, value}} = event
        setTextInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <Flex direction='column' bg='brand.400' borderRadius={4} mt={2}>
            <Flex width='100%'>
                {formTabs.map((item) => (
                    <>
                        <TabItem
                            key={item.title}
                            item={item} 
                            selected={item.title === selectedTab}
                            setSelectedTab={setSelectedTab}
                        />
                    </>
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === 'Post' && 
                <TextInputs 
                    textInputs={textInputs}
                    handleCreatePost={handleCreatePost}
                    onChange={onTextChange}
                    loading={loading}
                />}
                {selectedTab === 'Images & Video' && 
                <ImageUpload 
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    setSelectedTab={setSelectedTab}
                    selectFileRef={selectFileRef}
                    onSelectImage={onSelectImage}
                />}
            </Flex>
            {error && (
                <Alert status='error'>
                    <AlertIcon />
                    <Text mr={2}>Error creating post.</Text>
                </Alert>
            )}
        </Flex>
    )
}
export default NewPostForm;