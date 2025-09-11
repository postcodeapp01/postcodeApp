import axios from "axios";

const GOOGLE_API_KEY = "AIzaSyCOuiD-x5kViS8XHFnF1TB-qq39jwtYnkQ";

export const getAddressFromCoords = async (lat: number, lng: number) => {
  try {
    const url = "https://maps.googleapis.com/maps/api/geocode/json";

    console.log("🔎 Reverse geocoding...");
    console.log("➡️  Request URL:", url);
    console.log("➡️  Params:", { latlng: `${lat},${lng}`, key: "HIDDEN" });

    const response = await axios.get(url, {
      params: {
        latlng: `${lat},${lng}`,
        key: GOOGLE_API_KEY,
      },
      timeout: 10000, // just in case network is slow
    });

    console.log("✅ Response status:", response.status);
    console.log("✅ Response data:", response.data);

    if (response.data.error_message) {
      console.error("❌ Google API Error:", response.data.error_message);
    }

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const result = response.data.results[0];
      const addressComponents = result.address_components;

      const getComponent = (types: string[]) =>
        addressComponents.find((c: any) =>
          types.every((t) => c.types.includes(t))
        )?.long_name;

      return {
        formattedAddress: result.formatted_address,
        addressLine1: getComponent(["street_number"])
          ? `${getComponent(["street_number"])} ${getComponent(["route"])}`
          : getComponent(["route"]),
        addressLine2: getComponent(["sublocality", "sublocality_level_1"]) || "",
        city: getComponent(["locality"]) || "",
        state: getComponent(["administrative_area_level_1"]) || "",
        country: getComponent(["country"]) || "",
        pincode: getComponent(["postal_code"]) || "",
      };
    }

    console.warn("⚠️ No results found:", response.data.status);
    return null;
  } catch (error: any) {
    console.error("❌ Error in reverse geocoding:", error.message || error);
    if (error.response) {
      console.error("📦 Response Error Data:", error.response.data);
    } else if (error.request) {
      console.error("📡 Request made but no response:", error.request);
    }
    return null;
  }
};
