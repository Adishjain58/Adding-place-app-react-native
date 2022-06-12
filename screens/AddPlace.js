import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";

const AddPlace = ({ navigation }) => {
  // function which will take the place data as a input and store it in the local db
  const createPlaceHandler = async (place) => {
    await insertPlace(place);
    navigation.navigate("AllPlaces");
  };

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
};

export default AddPlace;
