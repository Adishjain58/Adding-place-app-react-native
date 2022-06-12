// Add your google api key here to make it work
const GOOGLE_API_KEY = "";

// function which generates an image url based on the location coordinates
export const getMapPreview = (lat, lng) => {
  // api provided by google to generate an image of the picked location
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap
&markers=color:red%7Clabel:S%7C${lat},${lng}
&key=${GOOGLE_API_KEY}`;
  //   console.log(imagePreviewUrl);
  return imagePreviewUrl;
};

// function which takes location info and returns an address
export const getAddress = async (lat, lng) => {
  // Api provided by google to get geocoding data for this geocoding api is required
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  // to make  a get request
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error("Failed to fetch address");
  }

  const data = await response.json();

  // how to extract address info from the response from google api
  const address = data.results[0].formatted_address;
  return address;
};
