🚀 Dokumentasi Demo CarbonFi (Langkah demi Langkah)

Dokumentasi ini menjelaskan alur demo lengkap menggunakan 3 aktor di Remix VM.

Aktor

* Verificator: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 (Admin sistem)
* NGO A: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 (Penjual / Pemilik Proyek)
* Perusahaan B: 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db (Pembeli / Polutif)


Tahap 0: Deploy & Setup (Oleh Verificator)

1. Ganti Aktor: Di Remix, pastikan ACCOUNT adalah Verificator (0x5B3...).
2. Deploy Kontrak Token:
    * Deploy CarbonToken.sol. Salin alamatnya.
    * Deploy ProjectCertificate.sol. Salin alamatnya.
    * Deploy RetiredProof.sol. Salin alamatnya.
3. Deploy Kontrak Inti:
    * Pilih CarbonFiCore.sol (versi yang sudah di-fix).
    * Masukkan 3 alamat kontrak token dari langkah #2 ke constructor.
    * Klik transact.
    * Salin alamat CarbonFiCore yang BARU (misal 0xBAdD...).
4. Setup Hak Akses (Wajib!):
    * Buka CarbonToken (yang di-deploy). Panggil setupCoreRoles() -> masukkan alamat CarbonFiCore BARU.
    * Buka ProjectCertificate. Panggil setupCoreMinter() -> masukkan alamat CarbonFiCore BARU.
    * Buka RetiredProof. Panggil setupCoreMinter() -> masukkan alamat CarbonFiCore BARU.


Tahap 1: Registrasi Proyek (Oleh Verificator)

1. Aktor: Verificator (0x5B3...).
2. Kontrak: Buka CarbonFiCore (yang di-deploy).
3. Fungsi: registerProject
4. Input:
    * ngoWallet: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 (NGO A)
    * amount: 1000
    * metadataUri: "Proyek Mangrove Kalimantan"
5. Klik transact.


Tahap 2: Penetapan Harga (Oleh Verificator)

1. Aktor: Verificator (0x5B3...).
2. Kontrak: CarbonFiCore.
3. Fungsi: setTokenPrice
4. Input:
    * projectId: 1
    * priceInWei: 1000000000000000 (Ini 0.001 ETH)
5. Klik transact.


Tahap 3: Pembelian Token (Oleh Perusahaan B)

1. GANTI AKTOR (PENTING!): Ganti ACCOUNT di Remix ke Perusahaan B (0x4B2...).
2. SET VALUE (PENTING!):
    * Di field VALUE, masukkan: 500000000000000000
    * Pastikan unitnya Wei. (Ini 0.5 ETH untuk membeli 500 token).
3. Kontrak: CarbonFiCore.
4. Fungsi: buyTokens (tombol merah)
5. Input:
    * projectId: 1
    * amount: 500
6. Klik transact.


Tahap 4: Pensiun Token (Oleh Perusahaan B)

1. Aktor: Perusahaan B (0x4B2...).
2. SET VALUE (PENTING!): Ganti field VALUE kembali ke 0.
3. Kontrak: CarbonFiCore.
4. Fungsi: retireTokens
5. Input:
    * projectId: 1
    * amount: 400
    * retirementUri: "Bukti Offset 400 ton PT. Polutif"
6. Klik transact.
Demo Selesai.



✅ Dokumentasi Validasi (Membuktikan Demo Berhasil)

Untuk membuktikan demo berjalan lancar, lakukan pengecekan (panggil fungsi call tombol biru) setelah Tahap 4:

1. Cek Aktor: NGO A (0xAb...)

* Cek Saldo ETH:
    * Aksi: Ganti ACCOUNT ke NGO A. Lihat saldo di dropdown.
    * Hasil: Saldo harus 100.5 ETH (bertambah 0.5 ETH).
* Cek Sertifikat Proyek:
    * Aksi: Buka ProjectCertificate. Panggil balanceOf dengan alamat NGO A.
    * Hasil: uint256: 1 (NGO A memiliki 1 NFT Sertifikat Asal).

2. Cek Aktor: Perusahaan B (0x4B...)

* Cek Sisa Token Karbon:
    * Aksi: Buka CarbonToken. Panggil balanceOf dengan account: Perusahaan B dan id: 1.
    * Hasil: uint256: 100 (Beli 500, bakar 400, sisa 100).
* Cek Bukti Pensiun:
    * Aksi: Buka RetiredProof. Panggil balanceOf dengan alamat Perusahaan B.
    * Hasil: uint256: 1 (Memiliki 1 NFT Bukti Pensiun).

3. Cek Kontrak: CarbonFiCore (Alamat 0xBAdD...)

* Cek Sisa Token di Escrow:
    * Aksi: Buka CarbonToken. Panggil balanceOf dengan account: [Alamat CarbonFiCore] dan id: 1.
    * Hasil: uint256: 500 (Awal 1000, terjual 500, sisa 500).
