import express from "express";
import db from "./db";
import pg from "pg";

const { types } = pg;
types.setTypeParser(1082, (value) => value);
const app = express();
app.use(express.json());
db.initDB();

export default app;
