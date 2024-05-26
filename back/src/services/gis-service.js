const { BING_MAPS_APIKEY } = process.env;

class GisService {
  async geocodeAddress(address) {
    try {
      const url = `https://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(address)}&key=${BING_MAPS_APIKEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (
        data.resourceSets.length > 0 &&
        data.resourceSets[0].resources.length > 0
      ) {
        const result = data.resourceSets[0].resources[0];
        // Преобразование координат в строку формата WKT для POINT
        const locationString = `SRID=4326;POINT(${result.point.coordinates[1]} ${result.point.coordinates[0]})`;
        return {
          location: locationString,
          formattedAddress: result.address.formattedAddress,
        };
      } else {
        throw new Error("Не вдалось знайти координати для даного адреса");
      }
    } catch (error) {
      console.error("Помилка геокодування:", error);
      throw error;
    }
  }
}

module.exports = new GisService();
