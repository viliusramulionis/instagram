import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';
import users from './controller/user.js';
import posts from './controller/post.js';
import comments from './controller/comment.js';
import likes from './controller/like.js';
import path from 'node:path';
import 'dotenv/config';

await mongoose.connect(process.env.MONGO_URL);

const app = express();

app.set('trust proxy', true);

// CORS apsaugos nuėmimas
app.use(cors({
    credentials: true
}));

// Sesijos sukūrimas
app.use(session({
    // Slaptos frazės nustatymas
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// Nustatymas gauti duomenis x-www-form-urlenced formatu
app.use(express.urlencoded({
    extended: true
}));

// Nustatymas gauti duomenis JSON formatu
app.use(express.json());

// Kontrolerių registracija
app.use('/users', users);
app.use('/posts', posts);
app.use('/comments', comments);
app.use('/likes', likes);

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./view/index.html'));
});

// Failų atvaizdavimui kreipiantis į route'ą uploads
app.use('/uploads', express.static('./uploads'));
app.use('/assets', express.static('./view/assets'));

app.listen(process.env.PORT);