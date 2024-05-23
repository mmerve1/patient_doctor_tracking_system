const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "merve123",
    database: "hasta_takip"
});

class Doctor {
    constructor() {}

    async ekle(doktor) {
        try {
            const result = await pool.query(
                'INSERT INTO doktorlar (doktorid,Ad, Soyad, UzmanlikAlani, CalistigiHastane) VALUES ($1, $2, $3, $4,$5) RETURNING *',
                [doktor.doktorid,doktor.ad, doktor.soyad, doktor.uzmanlikalani, doktor.calistigihastane]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Doktor ekleme hatası:', error);
            throw error; 
        }
    }

    async sil(doktorId) {
        try {
            const result = await pool.query(
                'DELETE FROM doktorlar WHERE doktorid = $1 RETURNING *',
                [doktorId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Doktor silme hatası:', error);
            throw error;
        }
    }

    async getir() {
        try {
            const result = await pool.query('SELECT * FROM doktorlar');
            return result.rows;
        } catch (error) {
            console.error('Doktorları getirme hatası:', error);
            throw error; 
        }
    }

    async ekleEndpoint(req, res) {
        try {
            const doktor = req.body;
            const eklenenDoktor = await this.ekle(doktor);
            res.json(eklenenDoktor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async silEndpoint(req, res) {
        try {
            const doktorId = req.params.id;
            await this.sil(doktorId);
            res.json({ message: 'Doktor başarıyla silindi' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getirEndpoint(req, res) {
        try {
            const doktorlar = await this.getir();
            res.json(doktorlar);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getirById(doktorid) {
        try {
            const result = await pool.query('SELECT * FROM doktorlar WHERE doktorid = $1', [doktorid]);
            return result.rows[0];
        } catch (error) {
            console.error('doktor getirme hatası:', error);
            throw error;
        }
    }
    
    async guncelle(doktorid, yeniBilgiler) {
        try {
            const { ad, soyad, calistigihastane, uzmanlikalani } = yeniBilgiler;
            const result = await pool.query(
                'UPDATE doktorlar SET ad = $1, soyad = $2, calistigihastane = $3, uzmanlikalani= $4 WHERE doktorid = $5 RETURNING *',
                [ad, soyad, calistigihastane, uzmanlikalani, doktorid]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Doktor güncelleme hatası:', error);
            throw error;
        }
    }
    
}

module.exports = Doctor;
