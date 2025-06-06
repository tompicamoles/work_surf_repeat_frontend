const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API;

export async function getGeolocation(name, country) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${name},${country}&key=${apiKey}`;

  try {
    // Perform the fetch operation
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    // Parse the response body as JSON
    const data = await response.json();
    const geolocation = {
      latitude: data.results[0].geometry.location.lat,
      longitude: data.results[0].geometry.location.lng,
    };

    // Return the parsed data
    return geolocation;
  } catch (error) {
    // Handle network errors and other exceptions
    console.error("Fetch failed:", error);
    // Optionally, rethrow the error to be handled further up the call stack
    throw error;
  }
}
