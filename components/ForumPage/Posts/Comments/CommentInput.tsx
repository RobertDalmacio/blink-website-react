import { Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import AuthButtons from '../../NavbarForum/RightContent/AuthButtons';

type CommentInputProps = {
    commentText: string
    setCommentText: (value: string) => void
    user: User
    createLoading: boolean
    onCreateComment: (commentText: string) => void
};

const CommentInput:React.FC<CommentInputProps> = ({commentText, setCommentText, user, createLoading, onCreateComment}) => {
    
    return (
        <Flex direction="column" position="relative">
            {user ? (
                <>
                    <Text mb={1}>
                        Comment as{" "}
                        <span style={{ color: "#3182CE" }}>
                            {user?.email?.split("@")[0]}
                        </span>
                    </Text>
                    <Textarea 
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder='What are your thoughts?'
                        fontSize='10pt'
                        borderRadius={4}
                        border='1px solid'
                        borderColor='black'
                        bg='white'
                        minHeight="160px"
                        _placeholder={{color: 'black'}}
                        _focus={{
                            outline: 'none',
                            border: '1px solid',
                            borderColor: 'brand.300'
                        }}
                    />
                    <Flex
                        position="absolute"
                        left="1px"
                        right={0.1}
                        bottom="1px"
                        justify="flex-end"
                        bg="gray.200"
                        p="6px 8px"
                        borderRadius="0px 0px 4px 4px"
                    >
                        <Button
                        height="26px"
                        disabled={!commentText.length}
                        isLoading={createLoading}
                        onClick={() => onCreateComment(commentText)}
                        >
                            Comment
                        </Button>
                    </Flex>
                </>
            ) : (
                <Flex
                align="center"
                justify="space-between"
                borderRadius={2}
                border="1px solid"
                borderColor="brand.300"
                p={4}
                >
                    <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
                    <AuthButtons />
                </Flex>
            )}
        </Flex>
    );
}
export default CommentInput;