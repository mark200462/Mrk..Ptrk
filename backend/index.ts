import express, { Express, Router } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors'

dotenv.config();

const port = process.env.PORT || 6969;
const app: Express = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://127.0.0.1:3000'}))
app.use('/api/v1/', require('./routes/router'));


const server = app.listen(port, () => {
    console.log(`The backend has started on port ${port}`);
})


app.set('server', server);