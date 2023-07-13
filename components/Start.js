import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { getAuth, signInAnonymously } from 'firebase/auth';
import { Alert } from "react-native";

//Start component
const Start = ({ navigation }) => {
    const auth = getAuth();

        //Params that define the user
        const [name, setName] = useState('');
        const [color, setColor] = useState('');
        const [user, setUser] = useState(null);

    //User signs in anonymously 
    const signInUser = () => {
        signInAnonymously(auth)
            .then((result) => {
                const newUser = {
                    userID: result.user.uid,
                    name: name,
                    color: color,
                };
                setUser(newUser);
                Alert.alert('You are now signed in');
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Unable to sign in. Please try again');
            });
    };



    //If there is a user, stringify the user and send it on to the chat
    useEffect(() => {
        if (user) {
            const serializedUser = JSON.stringify(user);
            navigation.navigate('Chat', { serializedUser });
        }
    }, [user, navigation]);

    return (
        <ImageBackground
            source={require('../img/BackgroundImage.png')}
            resizeMode="cover"
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>chatApp!</Text>
                <View style={styles.subContainer}>
                    <TextInput
                        accessible={true}
                        accessibilityHint="Choose a color from the color picker"
                        accessibilityLabel="Let's choose the color for the background screen"
                        placeholder="What's your name?"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <Text style={styles.colorText}>Choose a background color:</Text>
                    <View style={styles.radioButtonContainer}>
                        <TouchableOpacity
                            style={[styles.radioButton, { backgroundColor: '#090C08' }]}
                            onPress={() => setColor('#090C08')}
                        />
                        <TouchableOpacity
                            style={[styles.radioButton, { backgroundColor: '#474056' }]}
                            onPress={() => setColor('#474056')}
                        />
                        <TouchableOpacity
                            style={[styles.radioButton, { backgroundColor: '#8A95A5' }]}
                            onPress={() => setColor('#8A95A5')}
                        />
                        <TouchableOpacity
                            style={[styles.radioButton, { backgroundColor: '#B9C6AE' }]}
                            onPress={() => setColor('#B9C6AE')}
                        />
                    </View>
                    <Button
                        title='Start Chatting'
                        // onPress={signInUser}
                        onPress={() => navigation.navigate('Chat', { name: name, color: color })}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 25,
        borderRadius: 15,
        backgroundColor: '#d9d9d9',
        paddingVertical: 75,
        paddingHorizontal: 75,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 35,
        marginBottom: 40,
    },
    colorText: {
        fontSize: 16,
        marginBottom: 20,
    },
    radioButton: {
        backgroundColor: 'black',
        width: 30,
        height: 30,
        borderRadius: 50,
        margin: 10,
    },
    input: {
        height: 40,
        width: '90%',
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
    },
});

export default Start;
