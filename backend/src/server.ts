import express from "express";
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cors from 'cors';;
import path from 'path';

const app = express();


const corsOptions = {

    origin: 'http://localhost:4200', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

export default app;