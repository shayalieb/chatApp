import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native-web";

//Core variables
const Chat = ({ route, navigation }) => {
    const [messages, setMessages] = useState([])
    const { name } = route.params;
    const { color } = route.params;

    //Mount the setMessage to the page
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello i am a developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any'
                },
            },
            {
                _id: 2,
                text: 'This is a system test',
                createdAt: new Date(),
                system: true,
            }
        ]);
    }, []);

    //Functionality of the bubble that surrounds the text, like color...
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#59c281'
                },
                left: {
                    backgroundColor: '2de373'
                }
            }}
        />
    }

    //Mounting the name and background color to the chat page
    useEffect(() => {
        navigation.setOptions({
            title: name,
            color: color
        })
    }, []);

    //when a message is sent, it should be shown 
    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    }

    //the render that applies all the functionality
    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <GiftedChat
                style={styles.chatBox}
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                    name
                }}
            />
            {/* In case the keyboard cuts into the view */}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatBox: {
        width: '80%',
        backgroundColor: 'white',
        justifyContent: 'center'
    }
});

export default Chat;