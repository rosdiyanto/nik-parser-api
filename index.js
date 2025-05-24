const express = require('express');
const { nikParser } = require('nik-parser');

const app = express();
const port = process.env.PORT || 3000;

function formatDateOnly(isoString) {
    if (typeof isoString !== 'string' || !isoString) return null;
    try {
        return isoString.split('T')[0];
    } catch {
        throw new Error("Data tanggal lahir tidak valid atau kosong");
    }
}

// Middleware untuk validasi API key dari header x-api-key
function apiKeyMiddleware(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            status: false,
            error: 'Unauthorized: API key missing or invalid',
        });
    }
    next();
}

app.use(express.json());

app.post('/parser-nik', apiKeyMiddleware, (req, res) => {
    const { nik } = req.body;

    if (!nik || typeof nik !== 'string' || !/^\d{16}$/.test(nik)) {
        return res.status(400).json({
            status: false,
            error: "NIK harus berupa string 16 digit angka"
        });
    }

    try {
        const result = nikParser(nik);

        let birthDateISO = null;
        const birth = result.lahir();

        if (birth instanceof Date && !isNaN(birth.getTime())) {
            birthDateISO = birth.toISOString();
        } else if (typeof birth === "string") {
            const d = new Date(birth);
            if (!isNaN(d.getTime())) {
                birthDateISO = d.toISOString();
            }
        }

        const plainResult = {
            isValid: result.isValid(),
            provinceId: result.provinceId(),
            province: result.province(),
            kabupatenKotaId: result.kabupatenKotaId(),
            kabupatenKota: result.kabupatenKota(),
            kecamatanId: result.kecamatanId(),
            kecamatan: result.kecamatan(),
            kodepos: result.kodepos(),
            kelamin: result.kelamin(),
            birthDate: birthDateISO ? formatDateOnly(birthDateISO) : null,
            uniqueCode: result.uniqcode(),
        };

        return res.json({
            status: true,
            data: plainResult
        });
    } catch (error) {
        let errorMessage = error.message;
        if (errorMessage.includes("split")) {
            errorMessage = "NIK tidak valid";
        }

        return res.status(500).json({
            status: false,
            error: errorMessage
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
