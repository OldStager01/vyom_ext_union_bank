import env from "../config/env";
import redis from "../config/redis";
import { phoneNumberSchema } from "../schemas/phoneNumber.schema";
import { fromError } from "zod-validation-error";

const OTP_EXPIRY = 300; // 5 Minutes
const storeOTP = async (phoneNumber: string, otp: string) => {
    await redis.set(phoneNumber, otp, "EX", OTP_EXPIRY);
};

const getOTP = async (phoneNumber: string) => {
    return await redis.get(phoneNumber);
};

const generateRandomOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (phoneNumber: string) => {
    try {
        phoneNumberSchema.parse(phoneNumber);
        let otp;
        if (env.NODE_ENV === "development") {
            otp = "123456";
        } else {
            otp = generateRandomOTP();
            // Send OTP to user
        }
        await storeOTP(phoneNumber, otp);
    } catch (err) {
        const error = fromError(err);
        throw error;
    }
};

const verifyOtp = async (
    phoneNumber: string,
    otp: string
): Promise<Boolean> => {
    try {
        phoneNumberSchema.parse(phoneNumber);
        const storedOtp = await getOTP(phoneNumber);
        if (storedOtp !== otp) {
            return false;
        }
        return true;
    } catch (err) {
        const error = fromError(err);
        throw error;
    }
};

export { sendOtp, verifyOtp };
