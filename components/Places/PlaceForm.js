import { useCallback, useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { Place } from "../../models/places";
import Button from "../UI/Button";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";

const PlaceForm = ({ onCreatePlace }) => {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [pickedLocation, setPickedLocation] = useState();
  const [selectedimage, setSelectedImage] = useState();

  // function to manage the title state
  const titleChangeHandler = (enteredTitle) => {
    setEnteredTitle(enteredTitle);
  };

  // function which is passed to ImagePicker component to get the image uri
  const takeimageHandler = (imageUri) => {
    setSelectedImage(imageUri);
  };

  // function which is passed to Location Picker component to get the location data
  const pickLocationHandler = useCallback((location) => {
    setPickedLocation(location);
  }, []);

  // function to pass the data for the new place and pass in the handler which is passed as a prop
  const savePlaceHandler = () => {
    const placeData = new Place(enteredTitle, selectedimage, pickedLocation);

    onCreatePlace(placeData);
  };
  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={titleChangeHandler}
          value={enteredTitle}
          placeholder="Enter Title"
        />
      </View>
      {/* Component for clicking image from camera */}
      <ImagePicker onTakeImage={takeimageHandler} />
      {/* Component to get current location or custom location from google map */}
      <LocationPicker onPickLocation={pickLocationHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
};

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
