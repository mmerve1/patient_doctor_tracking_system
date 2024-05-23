const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "merve123",
    database: "hasta_takip"
});

class TibbiRaporlar {
    constructor() {}

    async ekle(rapor) {
        try {
            const result = await pool.query(
                'INSERT INTO tibbiraporlar (raportarihi, raporicerigi, raporurl, raporjson, hastaid, doktorid, yoneticiid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [rapor.raportarihi, rapor.raporicerigi, rapor.raporurl, rapor.raporjson, rapor.hastaid, rapor.doktorid, rapor.yoneticiid]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Rapor ekleme hatası:', error);
            throw error;
        }
    }

    async sil(raporid) {
        try {
            const result = await pool.query(
                'DELETE FROM tibbiraporlar WHERE raporid = $1 RETURNING *',
                [raporid]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Rapor silme hatası:', error);
            throw error;
        }
    }

    async getir() {
        try {
            const result = await pool.query('SELECT * FROM tibbiraporlar');
            return result.rows;
        } catch (error) {
            console.error('Raporları getirme hatası:', error);
            throw error;
        }
    }

    async getirById(raporid) {
        try {
            const result = await pool.query('SELECT * FROM tibbiraporlar WHERE raporid = $1', [raporid]);
            return result.rows[0];
        } catch (error) {
            console.error('Rapor getirme hatası:', error);
            throw error;
        }
    }

    async guncelle(raporid, yeniBilgiler) {
        try {
            const { raportarihi, raporicerigi, raporurl, raporjson, hastaid, doktorid, yoneticiid } = yeniBilgiler;
            const result = await pool.query(
                'UPDATE tibbiraporlar SET raportarihi = $1, raporicerigi = $2, raporurl = $3, raporjson = $4, hastaid = $5, doktorid = $6, yoneticiid = $7 WHERE raporid = $8 RETURNING *',
                [raportarihi, raporicerigi, raporurl, raporjson, hastaid, doktorid, yoneticiid, raporid]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Rapor güncelleme hatası:', error);
            throw error;
        }
    }
}

module.exports = TibbiRaporlar;
