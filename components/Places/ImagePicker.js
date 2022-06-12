import { View, Text, Alert, Image, StyleSheet } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState } from "react";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

const ImagePicker = ({ onTakeImage }) => {
  // hook which returns us an object which tells the current status of permission and a function to request for permission
  const [cameraPermissionInfo, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState();

  // to get permissions in ios and check if we already have the permissions or not
  const verifyPermissions = async () => {
    // if the permission status is not determined then request for permisson
    if (cameraPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      // here we will get true if the permission is granted else false if permission is denied
      return permissionResponse.granted;
    }

    // if the request is denied then show an alert to the end user about the permissions
    if (cameraPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions",
        "You need to grant camera permissions to use this app."
      );
      return false;
    }

    return true;
  };

  // function which is responsible to click the image and save it's data in state
  const takeimageHandler = async () => {
    // to check if we have the permission or not.
    const hasPermission = await verifyPermissions();
    // if there are no permissions then return
    if (!hasPermission) {
      return;
    }

    // launchCameraAsync function provided by image-picker package to click the images
    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    // pass the image url to the function provided so that lateron it can be stored
    onTakeImage(image.uri);
    // updating state with current image url
    setImage(image.uri);
  };

  let imagePreview = <Text>No image taken yet.</Text>;

  if (image) {
    imagePreview = (
      <Image
        style={styles.image}
        source={{
          uri: image,
        }}
      />
    );
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton icon={"camera"} onPress={takeimageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
