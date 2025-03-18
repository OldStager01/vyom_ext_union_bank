import { ValidationError } from "./errors";

export const getLatLongByPincode = async (
    pincode: string,
    countryCode: string = "IN"
) => {
    try {
        const url = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&countrycodes=${countryCode}&format=json`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
            };
        } else {
            throw new ValidationError("Invalid Pincode");
        }
    } catch (error) {
        throw error;
    }
};
