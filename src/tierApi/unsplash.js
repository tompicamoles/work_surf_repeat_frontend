export const generateImage = async (name, country) => {
  // Generate image URL based on name and country
  const query = `surf`;
  const url = `https://api.unsplash.com/photos/random?query=${query}`;
  const token = process.env.REACT_APP_UNSPLASH_TOKEN;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();
    const imgUrl = data.urls.regular;
    return imgUrl;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // You can handle or propagate the error as needed
  }
};