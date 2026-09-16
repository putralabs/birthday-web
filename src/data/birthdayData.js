// Single source of truth (PRD 4, 74). All personal content lives here.
export const birthdayData = {
  name: "Indah Nurul Qur'ani",
  shortName: 'Indah',
  birthday: '2026-12-21',
  birthdayLabel: '21 December 2026',
  projectStart: '2026-09-15T00:00:00+07:00',

  music: {
    src: '/audio/birthday.mp3',
    autoplay: false,
    volume: 0.7,
  },

  messages: {
    hero: 'Ini aku siapin buat kamu. Buka pelan pelan ya.',
    gift: 'Ini buat kamu. Bungkusnya biasa aja, tapi milihnya lama. Semoga kamu suka.',
    giftTitle: 'A little something for you.',
    letter:
      'Hei Indah. Kalau kamu baca ini berarti kamu udah keliling kamarnya sampai habis. Makasih ya udah mau mainin sampai sini. Aku bikin ini malem malem sambil mikirin kamu bakal ketawa di bagian mana. Intinya, selamat ulang tahun. Sehat terus, jangan sering begadang, makan yang bener. Kalau capek, istirahat aja dulu. Aku di sini kok.',
    letterSign: 'dari aku, buat kamu',
    heart: 'Ketemu ya. Ini aku taruh di sini biar cuma kamu yang nemu.',
    final:
      'Selamat ulang tahun ya, Indah. Makasih udah jadi kamu yang sekarang. Sehat sehat terus, yang baik baik nyusul ke kamu.',
    finalCredit: 'Dibikin pakai kode dikit dan niat yang banyak.',
  },

  flower: {
    enabled: true,
    bloomOn: 'celebration',
  },

  memories: [
    {
      image: '/images/indah-1.jpg',
      title: 'Waktu masih kecil',
      description: 'Nemu foto ini di galeri. Bandonya pink, bonekanya segede badan, senyumnya udah khas dari dulu.',
      date: 'Zaman bocah',
    },
    {
      image: '/images/indah-2.jpg',
      title: 'Selfie sebelum pergi',
      description: 'Abis siap-siap terus selfie bentar. Bilangnya iseng, tapi ya udah aku simpen soalnya bagus.',
      date: 'Di kamar',
    },
    {
      image: '/images/indah-3.jpg',
      title: 'Malam di tenda',
      description: 'Difoto diam-diam pas lagi nggak lihat kamera. Dingin-dingin begini masih sempat gaya.',
      date: 'Malam itu',
    },
    {
      image: '/images/indah-4.jpg',
      title: 'Sore di pantai',
      description: 'Sore-sore di pantai, ngadep laut mulu. Anteng banget, mataharinya juga pas banget. Diliatnya enak aja gitu.',
      date: 'Sore itu',
    },
    {
      image: '/images/indah-5.jpg',
      title: 'Angin laut',
      description: 'Di atas kapal, kacamatanya kepasang, rambutnya kebawa angin. Gayanya anteng banget padahal.',
      date: 'Di atas kapal',
    },
    {
      image: '/images/indah-6.jpg',
      title: 'Selfie santuy',
      description: 'Kaosan doang, rambutnya berantakan, senyumnya tipis. Tapi kok tetep bagus sih.',
      date: 'Di rumah',
    },
  ],

  wishes: [
    'Semoga yang kamu pengen tahun ini pelan pelan kejadian.',
    'Sehat terus ya. Jangan lupa makan sama tidur yang cukup.',
    'Kalau lagi mumet, cerita aja. Jangan dipendem sendiri.',
    'Tetap jadi Indah yang apa adanya. Itu yang bikin betah.',
    'Tahun ini semoga lebih sering ketawa daripada overthinking.',
  ],

  secrets: {
    flower: 'Nah ketemu. Bunga ini mekar karena kamu yang pegang. Simpan ya.',
    stars: [
      'Ini bintang pertama yang kamu temuin. Lumayan, matamu jeli juga.',
      'Bintang kedua. Hari ini senyumnya jangan dihemat ya.',
      'Ini yang terakhir. Doa yang bagus bagus buat kamu malam ini.',
    ],
    starsUnlocked: 'Udah ketemu semua. Nih ada kejutan kecil tambahan buat kamu.',
    balloon: 'Balonnya meletus. Kaget ya. Isinya cuma pesan ini kok.',
    photo: 'Foto ini kamu klik tiga kali. Kayaknya yang ini favoritmu ya.',
    lamp: 'Lampunya nyala. Hangat kan. Gini aja udah enak dilihat.',
  },

  // Nomor WhatsApp tujuan (format internasional tanpa +, tanpa spasi).
  reply: {
    label: 'Kirim peluk balik',
    url: 'https://wa.me/62895604134767?text=udah%20aku%20buka%20semuanya%2C%20makasih%20yaa',
  },

  // Kartu teaser harian sebelum hari H. daysOut = dibuka saat sisa hari <= angka ini.
  teasers: [
    { daysOut: 7, title: 'H-7', text: 'Seminggu lagi. Ada yang lagi siapin sesuatu diam diam.' },
    { daysOut: 5, title: 'H-5', text: 'Lilinnya udah kebeli. Tinggal kuenya.' },
    { daysOut: 3, title: 'H-3', text: 'Tiga hari lagi. Jaga kesehatan, jangan begadang terus.' },
    { daysOut: 2, title: 'H-2', text: 'Lusa ya. Siapin senyum yang banyak.' },
    { daysOut: 1, title: 'H-1', text: 'Besok. Tidur agak awal, buka web ini pas tengah malam.' },
  ],
}
