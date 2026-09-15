// Kompatibilitas: sumber utama ada di birthdayData.js (PRD 4, 74).
// File ini hanya wrapper agar import lama tetap jalan.
import { birthdayData as canonical } from './birthdayData.js'

export const birthdayData = {
  ...canonical,
  heroEyebrow: canonical.messages.hero,
  heroTitle: 'Happy Birthday',
  finalTitle: 'Happy Birthday, Indah',
  finalSubtitle: 'Have a beautiful year ahead',
  birthdayMessage: {
    title: 'Birthday Message',
    paragraphs: [
      'Indah, selamat ulang tahun. Makasih udah jadi tempat banyak tawa, termasuk tawaku.',
      'Semoga yang baik baik nyusul ke kamu tahun ini. Sehat terus, yang pengen pelan pelan kejadian.',
      'Kalau capek, istirahat aja dulu. Aku di sini kok, hari ini dan hari hari setelahnya.',
    ],
    sign: canonical.messages.letterSign,
  },
  specialMessage: {
    content: canonical.messages.final,
  },
  secrets: canonical.secrets.stars.map((message) => ({ message })),
  secretsUnlocked: canonical.secrets.starsUnlocked,
  wishTitle: 'Make a wish',
  wishTapCue: 'Tap the cake, tutup matamu sebentar',
  wishDone: 'Done?',
  music: canonical.music.src,
  memories: canonical.memories.map((m) => ({
    image: m.image,
    caption: m.description,
    alt: m.title,
    title: m.title,
    description: m.description,
    date: m.date,
  })),
  timeline: [
    { date: 'Dulu', title: 'Awal yang sederhana', description: 'Sapa singkat yang malah jadi obrolan panjang.', image: '' },
    { date: 'Suatu sore', title: 'Tawa pertama', description: 'Candaan garing yang malah bikin ngakak terus.', image: '' },
    { date: 'Hari yang berat', title: 'Melewati lelah', description: 'Hari itu berat, untung ada kamu buat saling nguatin.', image: '' },
    { date: 'Hari ini', title: 'Malam ini', description: 'Rayain kamu dan semua yang udah kamu lewatin sampai sini.', image: '' },
  ],
}
