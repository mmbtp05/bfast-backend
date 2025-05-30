import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import authRouter from "./routes/v1/auth"
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", authRouter);

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});
   
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});