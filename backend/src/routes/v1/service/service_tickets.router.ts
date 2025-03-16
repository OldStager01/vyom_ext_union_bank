import { Router } from "express";
import { queryUploadController } from "../../../controllers/users/serviceTickets/query.controller";
import { uploadDynamicFiles } from "../../../middlewares/upload.middleware";
import { createServiceTicketController } from "../../../controllers/users/serviceTickets/create_service_ticket.controller";
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
router.post("/create", createServiceTicketController);

export default router;
