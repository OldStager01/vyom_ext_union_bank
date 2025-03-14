import { Router } from "express";
import { queryUploadController } from "../../../controllers/users/serviceTickets/query.controller";
import { uploadDynamicFiles } from "../../../middlewares/upload.middleware";

const router = Router();

const upload = () => {
    return uploadDynamicFiles({
        fields: [
            {
                maxCount: 1,
                name: "video",
            },
        ],
        acceptedTypes: ["video/mp4"],
    });
};

router.post("/query", upload(), queryUploadController);

export default router;
