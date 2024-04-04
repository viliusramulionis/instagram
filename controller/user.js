import { Router } from 'express';
import User from '../model/user.js';
import upload from '../middleware/multer.js';
import bcrypt from 'bcrypt';
import auth from '../middleware/auth.js';


const router = Router();

router.get('/check-auth', auth, (req, res) => {
    res.status(200).json(req.session.user);
});

router.get('/logout', auth, (req, res) => {
    req.session.destroy();
    res.json('Sveikiname sėkmingai atsijungus');
});

// Vartotojo informacijos paėmimas
router.get('/:id', auth, async (req, res) => {
    try {
        res.json(
            await User.findById(req.params.id)
                      .select(['user_name', 'photo', 'bio', 'email'])
                      .populate('posts')
                      .populate('postCount')
        ); 
    } catch {
        res.status(500).json('Įvyko klaida');
    }
});

router.post('/login', async (req, res) => {
    console.log(req.body);
    // Prisijungimui tikimės:
    // Emailo ir slaptažodžio
    try {
        // findOne metodas grąžina tik vieno įrašo informaciją
        const data = await User.findOne({ email: req.body.email });
        
        // Jei vartotojas nerastas nuotraukiame funkciją ir grąžiname žinutę
        if(!data)
            return res.status(401).json('Neteisingas el. pašto adresas');
        
        // Jei vartotojo slaptažodis nesutampa su įvestu grąžiname klaidos kodą ir žinutę
        if(!await bcrypt.compare(req.body.password, data.password)) 
            return res.status(401).json('Neteisingas slaptažodis');

        // Priskiriame vartotojo informaciją prie sesijos
        req.session.user = {
            _id: data._id,
            user_name: data.user_name,
            photo: data.photo,
            bio: data.bio,
            email: data.email
        }

        // Išsiunčiame vartotojo duomenis
        res.json(req.session.user);
    } catch {
        // Grąžinamas atsakymas įvykus klaidai
        res.status(500).json('Įvyko klaida prisijungiant');
    }      
});

router.post('/register', upload.single('photo'), async (req, res) => {
    try {
        // Jeigu turime persiunčiamą nuotrauką
        if(req.file) 
            req.body.photo = req.file.filename; //Priskiriame failo pavadinimą prie į mongodb įrašomų duomenų

        // Slaptažodžio šifravimas
        // hash - yra šifruotas stringas
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // Sukuriame vartotoją
        await User.create(req.body);
        // Grąžiname žinutę
        res.json('Vartotojas sėkmingai sukurtas');
    } catch(e) {
        console.log(e);
        // Įvykus klaidai grąžiname klaidos kodą ir žinutę
        res.status(500).json('Registruojant vartotoją įvyko klaida');
    }
});

export default router;