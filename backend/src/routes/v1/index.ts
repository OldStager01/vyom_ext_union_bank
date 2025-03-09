import { Router } from "express";
import userRouter from "./users.router";
const router = Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "Hello, From V1!" });
});
router.use("/users", userRouter);

export default router;
