import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import React from "react";
import OutlinedButton from "../components/UI/OutlinedButton";
import { Colors } from "../constants/colors";
import { useEffect } from "react";
import { fetchPlaceById } from "../util/database";
import { useState } from "react";

const PlaceDetails = ({ route, navigation }) => {
  const [fetchedPlace, setFetchedPlace] = useState();

  // function which is used to navigate to map screen and pass the location details to map screen
  // so that that location can be shown in the map with the marker
  const showOnMapHandler = () => {
    navigation.navigate("Map", {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
    });
  };

  const selectedPlaceId = route.params.placeId;

  useEffect(() => {
    // fetching the selected place details and updating the state
    const fetchPlace = async () => {
      const place = await fetchPlaceById(selectedPlaceId);
      setFetchedPlace(place);
      navigation.setOptions({
        title: place.title,
      });
    };
    fetchPlace();
  }, [selectedPlaceId]);

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlinedButton icon={"map"} onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
