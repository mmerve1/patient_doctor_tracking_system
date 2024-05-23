const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "merve123",
    database: "hasta_takip"
});

class Hasta {
    constructor() {}

    async ekle(hasta) {
        try {
            const result = await pool.query(
                'INSERT INTO hastalar (hastaid, ad, soyad, dogumtarih, cinsiyet, telefonnumarasi, adres) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [hasta.hastaid, hasta.ad, hasta.soyad, hasta.dogumtarih, hasta.cinsiyet, hasta.telefonnumarasi, hasta.adres]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Hasta ekleme hatası:', error);
            throw error;
        }
    }

    async sil(hastaId) {
        try {
            const result = await pool.query(
                'DELETE FROM hastalar WHERE hastaid = $1 RETURNING *',
                [hastaId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Hasta silme hatası:', error);
            throw error;
        }
    }

    async getir() {
        try {
            const result = await pool.query('SELECT * FROM hastalar');
            return result.rows;
        } catch (error) {
            console.error('Hastalar getirme hatası:', error);
            throw error;
        }
    }

    async getirById(hastaid) {
        try {
            const result = await pool.query('SELECT * FROM hastalar WHERE hastaid = $1', [hastaid]);
            return result.rows[0];
        } catch (error) {
            console.error('Hasta getirme hatası:', error);
            throw error;
        }
    }

    async guncelle(hastaid, yeniBilgiler) {
        try {
            const { ad, soyad, dogumtarih, cinsiyet, telefonnumarasi, adres } = yeniBilgiler;
            const result = await pool.query(
                'UPDATE hastalar SET ad = $1, soyad = $2, dogumtarih = $3, cinsiyet = $4, telefonnumarasi = $5, adres = $6 WHERE hastaid = $7 RETURNING *',
                [ad, soyad, dogumtarih, cinsiyet, telefonnumarasi, adres, hastaid]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Hasta güncelleme hatası:', error);
            throw error;
        }
    }
}

module.exports = Hasta;
