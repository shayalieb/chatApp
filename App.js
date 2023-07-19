import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';
import { initializeApp } from 'firebase/app';
import { disableNetwork, enableNetwork, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import Start from './components/Start';
import Chat from './components/Chat';

//Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  //Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyCjo34apZMDZz3HUcLybIeipw5XUqFF3XU",
    authDomain: "chat-app-19063.firebaseapp.com",
    projectId: "chat-app-19063",
    storageBucket: "chat-app-19063.appspot.com",
    messagingSenderId: "620983038173",
    appId: "1:620983038173:web:eabd5ddaf33b0ecdb7ab34",
    measurementId: "G-0M0EDT94BN"
  };

  const connectionStatus = useNetInfo();
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);


  //If there is or isn't internet connection
  useEffect(() => {
    if (!connectionStatus.isConnected) {
      Alert.alert('There is no internet connection');
      disableNetwork(db);
    } else {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected, db]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat'>
          {props => (
            <Chat app={app} db={db} storage={storage} isConnected={connectionStatus.isConnected} {...props} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

