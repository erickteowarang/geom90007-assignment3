/* eslint-disable no-undef */
export const getPlaceDetails = async (placeName) => {
  const request = {
    query: placeName,
    fields: ['place_id']
  };

  const service = new google.maps.places.PlacesService(document.createElement('div'));

  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      const placeDetailsRequest = {
        placeId: results[0].place_id,
        fields: ['name', 'rating', 'formatted_phone_number', 'opening_hours']
      };

      service.getDetails(placeDetailsRequest, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          return place;
        }
      })
    }
  })
}