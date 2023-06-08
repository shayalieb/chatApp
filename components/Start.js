//Import dependencies 
import { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ImageBackground } from "react-native";



//"Start" is the function that start the process of using the chatApp
const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    return (
        <ImageBackground
            source={require('../img/BackgroundImage.png')}
            resizeMode="cover"
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.title}>chatApp!</Text>
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder="What's your name?"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <Text>Choose a background color?</Text>
                    <View 
                        style={styles.radioButtonContainer}
                        
                    >
                        <TouchableOpacity
                            style={[styles.radioButton, { backgroundColor: '#090C08' }]}
                            onPress={() => setColor('#090C08')}></TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.radioButton, { backgroundColor: '#474056' }]}
                            onPress={() => setColor('#474056')}></TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.radioButton, { backgroundColor: '#8A95A5' }]}
                            onPress={() => setColor('#8A95A5')}></TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.radioButton, { backgroundColor: '#B9C6AE' }]}
                            onPress={() => setColor('#B9C6AE')}></TouchableOpacity>
                    </View>
                    <Button
                        style={styles.button}
                        title='Start Chatting'
                        onPress={() => navigation.navigate('Chat')}
                    >
                        <Text
                            style={styles.title}
                        >
                            Start Chatting
                        </Text>
                    </Button>
                </View>
            </View>
        </ImageBackground>
    )
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 25,
    },
    radioButtonContainer: {
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 35,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '6FA8DC',
        padding: 15,
    },
    radioButton: {
        backgroundColor: 'black',
        width: 30,
        height: 30,
        borderRadius: 50,
    },
    input: {
        height: 40,
        width: '90%',
        margin: 15,
        borderWidth: 1,
        padding: 10,
    },
})

export default Start;