import { Router } from "express";
import authRouter from "./auth/user_auth.router";
import registerRouter from "./user/register.router";
import employeeAuthRouter from "./auth/employee_auth.router";
import branchRouter from "./branch/branch.router";
import employeeRouter from "./employee/operations.router";
import accountProductsRouter from "./common/account_products.router";
import authMiddleware from "../../middlewares/auth.middleware";
import { userTypeMiddleware } from "../../middlewares/userType.middleware";
const router = Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "Hello, From V1!" });
});

router.use("/auth", authRouter);
router.use("/employee/auth", employeeAuthRouter);

router.use(
    "/users/register",
    authMiddleware,
    userTypeMiddleware("user"),
    registerRouter
);

router.use(
    "/employee",
    authMiddleware,
    userTypeMiddleware("employee"),
    employeeRouter
);

router.use(
    "/branch",
    // authMiddleware,
    // userTypeMiddleware("employee"),
    branchRouter
);

router.use("/account-products", accountProductsRouter);

export default router;
