//React dependencies
import { useEffect, useState } from "react";
//React native dependencies
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
//Firestore dependencies
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

//Main Chat component
const Chat = ({ db, route, navigation, isConnected }) => {
  const { name, color, userID } = route.params;//Get the name and background color
  const [messages, setMessages] = useState([])//Set the state of the messages

  //Load the cached messages
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem('messages') || '[]';//Load the cached messages
    setMessages(JSON.parse(cachedMessages));
  };

  //Subscribe and unsubscribe to sending messages
  let unsubMessages;
  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerStyle: {
        backgroundColor: color,
      },
      headerTitleStyle: {
        color: color === '?' ? '#000' : '#fff',//Incase no color selected set default
      },
    });

    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      //Sending and receiving query's
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),//Setting the date objects
          });
        });
        cachedMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    //Clean up messages
    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    }
  }, [isConnected]);

  //Cache current messages
  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message)
    }
  };

  //Send new messages
  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
  };

  //Remove the text input function if there is no connection, and show if there is connection
  const renderInputToolBar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      setMessages(newMessages);
    })
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

  //Visual text bubble configuration
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#aff5a2' },
          left: { backgroundColor: '#a7e6f2' },
        }}
      />
    );
  };

  //Return the final render  
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userID, name }}
        renderInputToolbar={renderInputToolBar}
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  )
}

//Styling configurator
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10
  }
})

export default Chat;