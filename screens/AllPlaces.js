import { useIsFocused, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PlacesList from "../components/Places/PlacesList";
import { fetchPlaces } from "../util/database";

const AllPlaces = () => {
  const [places, setPlaces] = useState([]);
  // hook provided by react-navigation which tells whether the screen is focused or not
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadPlaces = async () => {
      // if the component is focused then fetch places from dp and update the state
      if (isFocused) {
        const places = await fetchPlaces();
        setPlaces(places);
      }
    };
    loadPlaces();
  }, [isFocused]);
  return <PlacesList places={places} />;
};

export default AllPlaces;
