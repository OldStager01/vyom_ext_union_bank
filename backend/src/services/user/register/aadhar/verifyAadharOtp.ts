import { getUsers, updateUser } from "../../../../db/models/users";
import { UserType } from "../../../../types/tables/user.type";
import { ForbiddenError, ValidationError } from "../../../../utils/errors";
import { verifyOtp } from "../../../otp.service";
import { getData } from "../../../redis/dataOperation";

export default async function verifyAadharOtp(
    id: string,
    aadhar_number: string,
    otp: string
) {
    try {
        if (!id || !aadhar_number || !otp) {
            throw new ValidationError("Invalid input");
        }
        const ref_id = await getData(aadhar_number);

        // TODO: Call Aadhar verification API: VERIFY OTP
        const response = await demoAadharServer(ref_id, otp);

        if (!response) {
            throw new ValidationError("Invalid OTP");
        }

        const user: Partial<UserType> = (await getUsers({
            where: [
                {
                    column: "id",
                    operator: "=",
                    value: id,
                },
            ],
        })) as Partial<UserType>;

        if (!user) {
            throw new ForbiddenError("User not found");
        }

        if (user.registration_status && user.registration_status !== "aadhar") {
            throw new ValidationError("Choose a valid step!");
        }

        // Mask the aadhar number
        aadhar_number = aadhar_number.slice(-4).padStart(12, "*");

        await updateUser<UserType>(
            {
                aadhar_number,
                registration_status: "other",
            },
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: id,
                    },
                ],
            }
        );
    } catch (error) {
        throw error;
    }
}

const demoAadharServer = async (ref_id: string, otp: string) => {
    try {
        await verifyOtp(ref_id, otp);
        return {
            ref_id: "70471",
            status: "VALID",
            message: "Aadhaar Card Exists",
            care_of: "S/O: Fakkirappa Dollin",
            address:
                "Shri Kanaka Nilaya,,Umashankar Nagar 1st Main 5th Cross,Ranebennur,Haveri-Karnataka,India",
            dob: "02-02-1995",
            email: "",
            gender: "M",
            name: "Mallesh Fakkirappa Dollin",
            split_address: {
                country: "India",
                dist: "Haveri",
                house: "Shri Kanaka Nilaya",
                landmark: "",
                pincode: 581115,
                po: "Ranebennur",
                state: "Karnataka",
                street: "Umashankar Nagar 1st Main 5th Cross",
                subdist: "Ranibennur",
                vtc: "Ranibennur",
                locality: "Pritam Pura",
            },
            year_of_birth: 1995,
            mobile_hash:
                "ed189eb73247cb90b769e7e8d7dfd2efa4cd6a5ec27602f5d2721c035266568c",
            photo_link: "<base64 encoded image>",
            share_code: "1234",
            xml_file: "<xml file link with 48hrs expiry>",
        };
    } catch (error) {
        throw error;
    }
};
