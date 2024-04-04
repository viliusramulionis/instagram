import { Router } from 'express';
import Post from '../model/post.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const router = Router();

// Grąžinamas visų post'ų sąrašas
router.get('/', auth, async (req, res) => {
    try {
        // const data = await Post.find();
        // const dataWithUser = [];
        // for(const value of data) {
        //     value.author = await User.findOne(value.author);
        //     dataWithUser.push(value);
        // }
        // res.json(dataWithUser);
        
        // Populate metodas užildo schemoje pažymėtą raktažodį modelio informacija
        res.json(       
            await Post
            .find()
            .populate('author', ['user_name', 'photo'])
            .populate('likes')
        );
    } catch(e) {
        console.log(e);
        res.status(500).json('Įvyko klaida');
    }
});

// Naujo įrašo sukūrimas
router.post('/', auth, upload.single('photo'), async (req, res) => {
    if(req.file)
        req.body.photo = req.file.filename;

    try {
        await Post.create(req.body);
        res.json('Įrašas sėkmingai išssaugotas');
    } catch(e) {
        // Įvykus klaidai grąžiname klaidos kodą ir žinutę
        console.log(e)
        res.status(500).json('Įvyko klaida');
    }
});

export default router;