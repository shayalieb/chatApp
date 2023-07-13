//Import app components 
import Start from './components/Start';
import Chat from './components/Chat';

//import React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';

import { useEffect } from 'react';
import { Alert } from 'react-native';

//Firestore config
import { initializeApp } from 'firebase/app';
import { disableNetwork, enableNetwork, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

//Create the navigator
const Stack = createNativeStackNavigator();

//Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDKAbZ8IkaFuDK_p-hlvictwPTARQ3NnqY",
  authDomain: "chatapp-fd387.firebaseapp.com",
  projectId: "chatapp-fd387",
  storageBucket: "chatapp-fd387.appspot.com",
  messagingSenderId: "914012315662",
  appId: "1:914012315662:web:7293d2848eefba99d2dc5f"
};

//App component
//When there is a connection using netInfo - connectionStatus
//We will initialize our Firebase config - app
//Than get in the database of the cloud - getFirestore
//Using the access to db (firestore cloud) we will use app to store and query data
const App = () => {
  const connectionStatus = useNetInfo();
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const storage = getStorage(app)


//If there is or isn't internet connection
useEffect(() => {
  if (connectionStatus === false) {
    Alert.alert('There is no internet connection')
    disableNetwork(db);
  } else if (connectionStatus === true) {
    enableNetwork(db);
  }
}, [connectionStatus.isConnected])


return (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Start'>
      <Stack.Screen name='Start' component={Start} />
      <Stack.Screen name='Chat'>
        {(props) => (
          <Chat
            isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
);
        }

export default App;

