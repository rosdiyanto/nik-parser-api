
# NIK Parsing API

API sederhana untuk parsing dan validasi Nomor Induk Kependudukan (NIK) Indonesia menggunakan library `nik-parser`.

---

## Persyaratan

- [Docker](https://www.docker.com/get-started) dan [Docker Compose](https://docs.docker.com/compose/install/) sudah terpasang di komputer Anda.

---

## Instalasi dan Menjalankan dengan Docker Compose

1. Clone repository ini:

```bash
git clone https://github.com/rosdiyanto/nik-parser-api.git
cd nik-parser-api
```

2. Pastikan ada file `docker-compose.yml` di folder project dengan isi:

```yaml
services:
  nik-parser-api:
    container_name: nik-parser-container
    build: .
    ports:
      - "3000:3000"  # Memetakan port 3000 di host ke port 3000 di container
    environment:
      - API_KEY=your_super_secret_api_key  # API key untuk otentikasi akses aplikasi
      - PORT=3000                          # Port yang digunakan oleh aplikasi di container
    restart: unless-stopped

```

3. Jalankan container dengan Docker Compose:

```bash
docker-compose up -d --build
```

4. Akses API di: `http://localhost:3000`

---

## Testing API dengan curl

Untuk menguji endpoint `/parser-nik` gunakan perintah berikut:

```bash
curl -X POST http://localhost:3000/parser-nik \
-H "Content-Type: application/json" \
-H "x-api-key: your_super_secret_api_key" \
-d '{"nik":"3213031506990026"}'

```

Ganti `3213031506990026` dengan NIK yang ingin Anda parsing.

---

## Menghentikan dan Menghapus Container

- Hentikan container:

```bash
docker-compose down
```

---

## Endpoint API

### POST `/parser-nik`

- Kirim data JSON dengan field:

```json
{
    "nik": "3213031506990026"
}
```

- Response JSON:

```json
{
    "status": true,
    "data": {
        "isValid": true,
        "provinceId": "32",
        "province": "JAWA BARAT",
        "kabupatenKotaId": "3213",
        "kabupatenKota": "KAB. SUBANG",
        "kecamatanId": "321303",
        "kecamatan": "SUBANG",
        "kodepos": "45586",
        "kelamin": "pria",
        "birthDate": "1999-06-15",
        "uniqueCode": "0026"
    }
}
```

atau jika error:

```json
{
    "status": false,
    "error": "NIK harus berupa string 16 digit angka"
}
```

---

## Lisensi

MIT License
