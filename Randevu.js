const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "merve123",
    database: "hasta_takip"
});

class Randevu {
    constructor() {}

    async ekle(randevu) {
        try {
            const result = await pool.query(
                'INSERT INTO randevular (randevuid, doktorid, hastaid, randevutarihi,randevusaati) VALUES ($1, $2, $3, $4,$5) RETURNING *',
                [randevu.randevuid,randevu.doktorid, randevu.hastaid, randevu.randevutarihi, randevu.randevusaati]
            );
            return result.rows[0];
        } catch (error) {
            console.error('randevu ekleme hatası:', error);
            throw error; 
        }
    }

    async getir() {
        try {
            const result = await pool.query('SELECT * FROM randevular');
            return result.rows;
        } catch (error) {
            console.error('Randevu getirme hatası:', error);
            throw error; 
        }
    }

    async ekleEndpoint(req, res) {
        try {
            const randevu = req.body;
            const eklenenrandevu = await this.ekle(randevu);
            res.json(eklenenrandevu);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getirEndpoint(req, res) {
        try {
            const randevular = await this.getir();
            res.json(randevular);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = Randevu;
