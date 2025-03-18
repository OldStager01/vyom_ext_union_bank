import { Router } from "express";
import { queryUploadController } from "../../../controllers/users/serviceTickets/query.controller";
import { uploadDynamicFiles } from "../../../middlewares/upload.middleware";
import { createServiceTicketController } from "../../../controllers/users/serviceTickets/create_service_ticket.controller";
import { getServiceTicketsController } from "../../../controllers/users/serviceTickets/get_service_tickets.controller";
import authMiddleware from "../../../middlewares/auth.middleware";
import { userTypeMiddleware } from "../../../middlewares/userType.middleware";

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

router.post(
    "/query",
    authMiddleware,
    userTypeMiddleware("user"),
    upload(),
    queryUploadController
);

router.post("/create", createServiceTicketController);

router.post(
    "/",
    // authMiddleware,
    // userTypeMiddleware("user"),
    getServiceTicketsController
);

export default router;
