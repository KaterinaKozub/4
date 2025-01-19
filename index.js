import express from 'express';
import cors from 'cors'
import {registerValidation, loginValidation, postCreateValidation} from './validations.js'
import mongoose from "mongoose";
import multer from "multer";
import {checkAuth, handleValidationErrors} from './utils/index.js'
import { UserController , PostController} from './controllers/index.js'
import * as fs from "node:fs";



mongoose
    .connect('mongodb+srv://kozubkaterina3:wwwwww@cluster0.8yjoq.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Database Connected!'))
    .catch((err) => console.log('Database error:', err));


const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Унікальне ім'я файлу
    }
});

const upload = multer({ storage });



app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));


app.post('/auth/login',  loginValidation, handleValidationErrors , UserController.login )
app.post('/auth/register', registerValidation, handleValidationErrors , UserController.register );
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/tags', PostController.getLastTags)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.filename}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors , PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, handleValidationErrors , PostController.update);



app.listen(4444, (err) => {
    if (err) {
        return console.error(err);
    }

    console.log('Server OK');
});








































