import { uniqBy } from "lodash";
import * as cafeData from "../data/cafe-restaurants-2019.json";

// Obtains a unique list for the suburb dropdown box
export const getSuburbs = () => [
  ...new Set(cafeData.features.map((cafe) => cafe["CLUE small area"])),
];

// Obtains a unique list for establishments
export const getEstablishments = () => [
  ...new Set(
    cafeData.features.map((cafe) => cafe["Industry (ANZSIC4) description"])
  ),
];


/*  
  Function to check if a given location has outdoor seating
  First checks if the trading name is the same, then if it has outdoor seating, 
  and then if outdoor seating is not 0 
*/
const checkOutdoorSeating = (cafe) => {
  const hasOutdoorSeating = cafeData.features.some(singleCafe => singleCafe["Trading name"] === cafe["Trading name"] 
    && singleCafe["Seating type"] === "Seats - Outdoor"
    && singleCafe["Number of seats"] > 0
  )

  return hasOutdoorSeating;
}

export const initialisePlacesData = () => {
  const uniquePoints = uniqBy(cafeData.features, 'Trading name');
  const sanitisedData = uniquePoints.map((cafe) => ({
    type: "Cafe",
    properties: {
      cluster: false,
      ID: cafe.ID,
      name: cafe["Trading name"],
      seatingType: cafe["Seating type"],
      address: cafe["Street address"],
      establishmentType: cafe["Industry (ANZSIC4) description"],
      suburb: cafe["CLUE small area"],
      hasOutdoorSeating: checkOutdoorSeating(cafe),
    },
    geometry: {
      type: "Point",
      coordinates: [cafe.longitude, cafe.latitude],
    },
  }));
  
  return sanitisedData;
}