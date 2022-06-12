import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image, Text } from "react-native";
import { Colors } from "../../constants/colors";
import { getAddress, getMapPreview } from "../../util/location";
import OutlinedButton from "../UI/OutlinedButton";

/*
 Note:- If we move back from one screen to another screen in that case the component
 is not reevaluated and the code won't be re-executed, so to solve this problem we can use
 useIsFocued hook like we used in this component
*/
const LocationPicker = ({ onPickLocation }) => {
  // to get the location permissions and a method to set request the permissions
  const [locationPermissionInfo, requestPermission] =
    useForegroundPermissions();

  const [location, setLocation] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  // A hook that returns true if the screen is focused or not
  const isFocused = useIsFocused();

  // if there is some location data when the component is mounted
  // set the location state with that data
  useEffect(() => {
    if (isFocused && route.params) {
      // in case we are navigating from the Map Screen extracting the passed location info
      const mapPickedLocation = {
        lat: route.params.pickedLocation.lat,
        lng: route.params.pickedLocation.lng,
      };
      setLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    // to call async code in useEffect
    const handleLocation = async () => {
      if (location) {
        const address = await getAddress(location.lat, location.lng);
        onPickLocation({ ...location, address });
      }
    };
    handleLocation();
  }, [location, onPickLocation]);

  // function to verify the location permissions
  const verifyPermission = async () => {
    if (locationPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions",
        "You need to grant location permissions to use this app."
      );
      return false;
    }

    return true;
  };

  // function to get the current location of user and set the state with that data
  const getLocationHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    const location = await getCurrentPositionAsync();
    setLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  // If we want to select location from map then navigating to Map Screen
  const pickOnMapHandler = () => {
    navigation.navigate("Map");
  };

  let locationPreview = <Text>No location picked yet</Text>;

  if (location) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{ uri: getMapPreview(location.lat, location.lng) }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>

      <View style={styles.actions}>
        <OutlinedButton icon={"location"} onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon={"map"} onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
