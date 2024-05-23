const express = require('express');
const app = express();
const Hasta = require('./Hasta');
const Doctor = require('./Doctor');
const Randevu = require('./Randevu');
const TibbiRaporlar = require('./TibbiRaporlar');


const hastaService = new Hasta();
const doctorService = new Doctor();
const randevuService = new Randevu();
const tibbiRaporlarService = new TibbiRaporlar();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/hastalar', async (req, res) => {
    try {
        const hastalar = await hastaService.getir();
        res.render('hastalar', { hastalar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/hastalar/ekle', async (req, res) => {
    try {
        const { hastaid, ad, soyad, dogumtarih, cinsiyet, telefonnumarasi, adres } = req.body;
        await hastaService.ekle({
            hastaid,
            ad,
            soyad,
            dogumtarih,
            cinsiyet,
            telefonnumarasi,
            adres
        });
        res.redirect('/hastalar');
    } catch (error) {
        console.error('Hasta eklemede sorun var:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/hastalar/sil', async (req, res) => {
    try {
        const { hastaid } = req.body;
        await hastaService.sil(hastaid);
        res.redirect('/hastalar');
    } catch (error) {
        console.error('Hasta silme hatası:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/hastalar/guncelle/:id', async (req, res) => {
    try {
        const hastaid = req.params.id;
        const hasta = await hastaService.getirById(hastaid);
        res.render('hasta-guncelle', { hasta });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/hastalar/guncelle/:id', async (req, res) => {
    try {
        const hastaid = req.params.id;
        const { ad, soyad, dogumtarih, cinsiyet, telefonnumarasi, adres } = req.body;
        await hastaService.guncelle(hastaid, { ad, soyad, dogumtarih, cinsiyet, telefonnumarasi, adres });
        res.redirect('/hastalar');
    } catch (error) {
        console.error('Hasta güncelleme hatası:', error);
        res.status(500).json({ error: error.message });
    }
});

const doktor = new Doctor(); 

app.post('/doktorlar/ekle', async (req, res) => {
    try {
        
        const { doktorid, ad, soyad, uzmanlikalani, calistigihastane } = req.body;
        await doctorService.ekle({
            doktorid,
            ad,
            soyad,
            uzmanlikalani,
            calistigihastane
        });

        res.redirect('/doktorlar');
    } 
    catch (error) {
        console.error('doktor eklemede hata:');
    }
});


app.get('/doktorlar', async (req, res) => {
    try {
        
        const doktorlar = await doctorService.getir();
        
        res.render('doktorlar', { doktorlar });
    } catch (error) {
        console.error('doktor eklemede hata:');
    }
});

app.post('/doktorlar/sil', async (req, res) => {
    try {
        const { doktorid } = req.body;
        await doctorService.sil(doktorid);
        res.redirect('/doktorlar');
    } 
    catch (error) {
        console.error('Doktor silme hatası:');
    }
});


app.get('/doktorlar/guncelle/:id', async (req, res) => {
    try {
        const doktorid = req.params.id;
        const doktor = await doctorService.getirById(doktorid);
        res.render('doktor-guncelle', { doktor }); 
    } catch {
        console.error('doktor güncellemede hata:');
    }
});


app.post('/doktorlar/guncelle/:id', async (req, res) => {
    try {
        const doktorid2 = req.params.id;
        const { doktorid,ad, soyad, uzmanlikalani,calistigihastane } = req.body;
        await doctorService.guncelle(doktorid2, { doktorid,ad, soyad, uzmanlikalani,calistigihastane});
        res.redirect('/doktorlar'); 
    } catch (error) {
        console.error('Hasta güncelleme hatası:');
    }
});


app.get('/randevular', async (req, res) => {
    try {
        const randevular = await randevuService.getir();
        res.render('randevular', { randevular });
    } catch (error) {
       console.error('Randevu oluşturmada hata');
    }
});

app.post('/randevular/ekle', async (req, res) => {
    try {
        const { randevuid, hastaid, doktorid, randevutarihi, randevusaati } = req.body;
        await randevuService.ekle({
            randevuid,
            hastaid,
            doktorid,
            randevutarihi,
            randevusaati
        });
        res.redirect('/randevular');
    } catch (error) {
        console.error('Randevu eklemede hata');
    }
});

app.post('/randevular/sil', async (req, res) => {
    try {
        const { randevuid } = req.body;
        await randevuService.sil(randevuid);
        res.redirect('/randevular');
    } catch (error) {
        console.error('Randevu silmede hata');
    }
});

app.get('/tibbiraporlar', async (req, res) => {
    try {
        const tibbiraporlar = await tibbiRaporlarService.getir();
        res.render('tibbiraporlar', { tibbiraporlar });
    } catch (error) {
        console.error('Tıbbi raporları oluşturmada hata');
    }
});

app.post('/tibbiraporlar/ekle', async (req, res) => {
    try {
        const { raportarihi, raporicerigi, raporurl, raporjson, hastaid, doktorid, yoneticiid } = req.body;
        await tibbiRaporlarService.ekle({
            raportarihi,
            raporicerigi,
            raporurl,
            raporjson,
            hastaid,
            doktorid,
            yoneticiid
        });
        res.redirect('/tibbiraporlar');
    } catch (error) {
        console.error('Tıbbi raporları oluşturmada hata');
    }
});

app.post('/tibbiraporlar/sil', async (req, res) => {
    try {
        const { raporid } = req.body;
        await tibbiRaporlarService.sil(raporid);
        res.redirect('/tibbiraporlar');
    } catch (error) {
        console.error('Tıbbi raporları oluşturmada hata');
    }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
