import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import globalError from './app/middleware/globalError';
import router from './app/routes';


const app: Application = express();
app.use(cors({
    origin: 'https://flat-sharing-client-henna.vercel.app',
    credentials: true
}));
app.use(cookieParser());

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "This Flat sharing server, assignment 9 running"
    })
})


app.use('/api', router);

app.use(globalError)


app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API Not Found",
        error: {
            path: req.originalUrl,
            message: "Your API is not available"
        }
    })
})

export default app;