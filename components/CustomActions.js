
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker'
import MapView from 'react-native-maps'
import { Alert, TouchableOpacity } from "react-native";
import { Text, View, StyleSheet } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ref } from 'firebase/storage';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage }) => {
    onActionPress = () => {
        const actionSheet = useActionSheet();

        const onActionPress = () => {
            const options = ['Choose from Library', 'Take Picture', 'Send Location', 'Cancel']
            const cancelButtonIndex = options.length - 1;
            actionSheet.showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex,
                },
                async (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            console.log(pickImage, 'User wants to choose an image');
                            return;
                        case 1:
                            console.log(takePhoto, 'User wants to take a photo');
                            return;
                        case 2:
                            console.log(getLocation, 'User wants to get location info');
                        default:
                    }
                },
            );
        };

        //Pick image from library
        const pickImage = async () => {
            let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissions?.granted) {
                let result = await ImagePicker.launchImageLibraryAsync();
                if (!result.canceled) {
                    console.log('Uploading the images here');
                    const imageURI = result.assets[0].uri;
                    const response = await fetch(imageURI);
                    const blob = await response.blob();
                    //Continue here

                    console.log('Image has  been uploaded successfully')
                } else {
                    Alert.alert('You do NOT have permissions to upload images')
                }
            }
        }


        //Take a photo using the devices camera
        const takePhoto = async () => {
            let permissions = await ImagePicker.requestCameraPermissionsAsync();
            if (permissions?.granted) {
                let result = await ImagePicker.launchCameraAsync();
                if (!result.canceled) {
                    console.log('Uploading your camera image');
                } else Alert.alert('You do not have permission to use the camera')
            }
        }

        //Get the devices location using GPS
        const getLocation = async () => {
            let permissions = await Location.requestForegroundPermissionsAsync();
            if (permissions?.granted) {
                const location = await Location.getCurrentPositionAsync({});
                if (location) {
                    console.log('Sending location data happens here');
                    onSend({
                        location: {
                            longitude: location.coords.longitude,
                            latitude: location.coords.latitude
                        }
                    })
                } else Alert.alert('There was an error while fetching your location')
            } else Alert.alert('You do NOT have permission to access location info')

        }
    }

    const newUploadRed = ref(storage, 'image724')


    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onActionPress}
        >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
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
        fontSize: 10,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;