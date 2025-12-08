import express from "express";
import db from "./db";
const app = express();
app.use(express.json());
db.initDB();

export default app;
