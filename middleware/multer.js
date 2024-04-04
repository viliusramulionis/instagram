import multer from 'multer';
import { access, mkdir } from 'node:fs/promises';

// Multer disktorage iniciavimas
const storage = multer.diskStorage({
    // Nurodymas kur failai bus saugomi
    destination: async (req, file, next) => {
        // Direktorijos pavadinimas
        const fileDir = './uploads';
        
        try {
            // Tikriname ar direktorija egzistuoja, jeigu ne iššaukiama klaida ir pereiname prie catch bloko
            await access(fileDir);
            // console.log('Klaida neivyko');
            
        } catch(error) {
            // Vykdome veiksmus įvykus klaidai
            // console.log('Ivyko klaida', error);

            // Direktorijos sukurimas jei ši neegzistuoja
            await mkdir(fileDir);
        }

        // Nurodomas direktorijos pavadinimas kur bus saugomi failai
        next(null, fileDir);
    },
    filename: (req, file, next) => {
        // Išskaidom originalaus failo pavadinimą į masyvą pagal taško simbolį
        const fileSplit = file.originalname.split('.');
        // Pasiimame paskutinį elementą iš masyvo
        const format = fileSplit[fileSplit.length - 1];
        // Generuojamas unikalus failo pavadinimas siekiant išvengti failų perrašymo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Failo pavadinimo perdavimas
        next(null, uniqueSuffix + '.' + format);
    }
});

// Multer modulio iniciavimas
const upload = multer({
    // Direktorijos nustatymas kur bus talpinami failai
    storage: storage,
    fileFilter: (req, file, next) => {
        const formats = [
            'image/jpeg',
            'image/png',
            'image/svg+xml'
        ];

        if(formats.includes(file.mimetype)) {
            next(null, true);
        } else {
            next(null, false);
        }
    },
    limits: {
        fileSize: 2000000
    }
});

export default upload;