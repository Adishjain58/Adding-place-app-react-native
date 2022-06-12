import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconButton from "../components/UI/IconButton";

// component responsible to show a full map
const Map = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // if some route params are there then that means some location data is passed
  // that's why extracting that data and creating the object and passing it into the state
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  // default data based on which map will open and show this place in map
  const region = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // functon which gets executed whenever a location is selected in the map.
  // here we get an event which will have all the required data.
  const selectLocationHandler = (event) => {
    // if we have passed the intitialLocation then that means we can't chnage the marker
    if (initialLocation) {
      return;
    }
    // extracting the data and setting the state
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setSelectedLocation({ lat, lng });
  };

  // function which is called when we click on save button on tha map screen
  const savePickedLocationHandler = useCallback(() => {
    // if no location is selected then show an alert to end user
    if (!selectedLocation) {
      Alert.alert(
        "No location picked!",
        "You have to pick a location by tapping on the mao first"
      );
      return;
    }
    // else navigate to Add Place screen and pass data of the selected location as params
    navigation.navigate("AddPlace", { pickedLocation: selectedLocation });
  }, [navigation, selectedLocation]);

  // hook to create a save button in the header of map screen
  // we used layout hook because it is called before the ui layout is created
  useLayoutEffect(() => {
    // if initialLocation is there then that means we should create the save button
    // as in this case the user is just seeing the location that he previously selected
    if (initialLocation) {
      return;
    }
    // else add a save button to top right of the screen
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon={"save"}
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler, initialLocation]);

  return (
    // Component provided by react-native-maps package to show the map
    <MapView
      style={styles.map}
      // to set which area should show when you first open the app
      initialRegion={region}
      // to execute a function whenever someone clicks on the map
      onPress={selectLocationHandler}
    >
      {/* Only show this marker when a user has selected a location */}
      {selectedLocation && (
        // A component provide by react-native-maps package to show a marker at the location
        // that the user has selected
        <Marker
          title="Picked Location"
          // pass the latitude and longitude coordinated where the marker should show
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
