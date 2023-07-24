//Import dependencies
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

//Custom action like adding images, video, and location live in CustomActions
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    const actionSheet = useActionSheet();

    //Params for choosing the right actions
    const onActionPress = () => {
        const options = ['Choose Image from Library', 'Take Picture', 'Send Location', 'Cancel'];

        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions({ options, cancelButtonIndex },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        console.log('User wants to choose an image');
                        return;
                    case 1:
                        takePhoto();
                        console.log('User wants to take a picture');
                        return;
                    case 2:
                        getLocation();
                        console.log('User wants to send their location');
                        return;
                }
            }
        );
    };

    //Allow the user to pick an image from the library
    const pickImage = async () => {
        let permissions =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        }
    };

    //Allow user to take a photo using the devices camera
    let takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert('ChatApp does not have permission to use the camera');
        }
    };

    //Allow use to send location using devices GPS
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert('There was an error while fetching your location');
        } else Alert.alert('YOu do not have permission to access your location');
    };

    //Setting up reference ID's for the CustomActions
    const generateReference = (uri) => {
        const timeStamp = new Date().getTime();
        const imageName = uri.split('/')[uri.split('/').length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    };

    //Upload image configuration
    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            const imageURL = await getDownloadURL(snapshot.ref);
            onSend({ image: imageURL });
        });
    };

    //Return the render
    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconTextStyle, iconTextStyle]}>  +</Text>
            </View>
        </TouchableOpacity>
    );
};

//Page styling
const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 5,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 50,
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginRight: 25,
        marginLeft: 25,
    },
});

export default CustomActions;