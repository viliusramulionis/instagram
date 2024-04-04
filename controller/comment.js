import { Router } from 'express';
import Comment from '../model/comment.js';
import auth from '../middleware/auth.js';

const router = Router();

// Komentarų kurie priklauso postui susigrąžinimas
router.get('/:post_id', auth, async (req, res) => {
    try {
        const data = await Comment.find({ post: req.params.post_id })
                                  .populate('author', ['user_name', 'photo']);
        console.log(data);
        res.json(data);
    } catch {
        res.status(500).json('Įvyko klaida');
    }
});

// Naujo įrašo sukūrimas
router.post('/', auth, async (req, res) => {
    try {
        await Comment.create(req.body);
        res.json('Įrašas sėkmingai išssaugotas');
    } catch(e) {
        console.log(e);
        // Įvykus klaidai grąžiname klaidos kodą ir žinutę
        res.status(500).json('Įvyko klaida');
    }
});

// Komentaro ištrynimas
router.delete('/:id', auth, async (req, res) => {
    try {
        await Comment.deleteOne({ _id: req.params.id });
        res.json('Komentaras sėkmingai pašalintas');
    } catch {
        res.status(500).json('Įvyko klaida');
    }
});

export default router;