
const generateImage = async (name) => {
  // Generate image URL based on name and country
  const query = ` ${name}  surfing `;
  const url = `https://api.unsplash.com/photos/random?query=${query}`;
  const token = "Client-ID NqJL9YuQCoBadK9v4WV5LPmiitfKvc2CHPLYbUI6e-Y";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: token,
        Params: {
          query: "surf",
        },
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();
    const imgUrl = data.urls.regular;
    console.log("image url", imgUrl)
    return imgUrl;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // You can handle or propagate the error as needed
  }
};



const getSpots = async () => {
  try {
      const response = await fetch("https://api.airtable.com/v0/appEifpsElq8TYpAy/spots?maxRecords=70", {
          "headers": {
            "accept": "*/*",
            "accept-language": "fr-FR,fr;q=0.9,es-MX;q=0.8,es;q=0.7,en-US;q=0.6,en;q=0.5",
            "authorization": "Bearer patfJs1HcAc8lcLYu.fae0cd9a263d3b89f2828953c2c05c508e71307ca2ba309207feca8f4c8c76ff",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "http://localhost:3000/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          "body": null,
          "method": "GET"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch DB");
        }

        const json = await response.json(); 
        

        const cardsData = json.records.reduce((spots, record) => {
            
            spots[record.id] = {
              id: record.id,
              name: record.fields.name,
              country: record.fields.country,
            };
            
            return spots;
          }, {});

        return cardsData;

  } catch (error) {
      console.error("Error fetching data:", error);
      throw error; 
  }
}

const updateSpotImage = async (id, imgUrl) => {

  const urlWithSpotId = `https://api.airtable.com/v0/appEifpsElq8TYpAy/spots/${id}`;

  const data = {
    fields: {
      image: imgUrl,
    },
  };

  const response = await fetch(urlWithSpotId, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer patfJs1HcAc8lcLYu.fae0cd9a263d3b89f2828953c2c05c508e71307ca2ba309207feca8f4c8c76ff",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  console.log(json);

  ;
};


  

// const updateSpots = async () => {
//   try {
//       const spots = await getSpots();
//       Object.entries(spots).forEach(async([id, spot]) =>  {
//         console.log("getting image for " , spot.name)
//           const imageUrl = await generateImage(spot.name)
//           updateSpotImage(id, imageUrl)
          
//       });
//   } catch (error) {
//       console.error("Error displaying spots:", error);
//   }
// }



const updateSpots = async () => {
  try {
      const spots = await getSpots();
      const spotsArray = Object.entries(spots)
      const firstThirtySpots = spotsArray.slice(50)

      firstThirtySpots.forEach(async([id, spot]) =>  {
        console.log("getting image for " , spot.name)
          const imageUrl = await generateImage(spot.name)
          updateSpotImage(id, imageUrl)
          
      });
  } catch (error) {
      console.error("Error displaying spots:", error);
  }
}
generateImage("Ordu")

//updateSpots();
