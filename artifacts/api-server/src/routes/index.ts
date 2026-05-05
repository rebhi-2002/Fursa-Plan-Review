import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import platformRouter from "./platform";
import publicJobsRouter from "./publicJobs";
import meRouter from "./me";
import seekerRouter from "./seeker";
import employerRouter from "./employer";
import adminRouter from "./admin";
import notificationsRouter from "./notifications";
import messagesRouter from "./messages";
import contactRouter from "./contact";
import alertsRouter from "./alerts";
import reviewsRouter from "./reviews";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(platformRouter);
router.use(publicJobsRouter);
router.use(meRouter);
router.use(notificationsRouter);
router.use(messagesRouter);
router.use(seekerRouter);
router.use(employerRouter);
router.use(adminRouter);
router.use(contactRouter);
router.use(alertsRouter);
router.use(reviewsRouter);

export default router;
