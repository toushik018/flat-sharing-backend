import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import globalError from './app/middleware/globalError';
import router from './app/routes';


const app: Application = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "This Flat sharing server, assignment 9"
    })
})


app.use('/api', router);

app.use(globalError)


app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req);
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