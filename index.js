import express from "express";
import dotenv from "dotenv";
import  morgan from "morgan"
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import uploadsRouter from "./helpers/uploads.js"
import uploadsVideos from "./helpers/uploadsVideos.js";
import coachRouter from "./routes/coach.route.js";
import clientRouter from "./routes/client.route.js";
import adminRouter from "./routes/admin.route.js";
import followRouter from "./routes/follow.route.js";
import exerciceRoute from "./routes/exercice.route.js";
import programmeRoute from "./routes/programme.route.js";

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use(express.json({limit: '50mb'}));


//routes
app.use("/api",uploadsRouter);
app.use("/api",uploadsVideos);
app.use("/api/auth", authRouter);
app.use("/api/user/client",clientRouter);
app.use("/api/user/coach",coachRouter);
app.use("/api/admin/",adminRouter);
app.use("/api/follow",followRouter);
app.use("/api/exercice",exerciceRoute)
app.use("/api/programme",programmeRoute)
app.use('/uploads', express.static('uploads'));


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});