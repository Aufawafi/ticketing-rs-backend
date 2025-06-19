require("dotenv").config();
const mongoose = require("mongoose");
const Dokter = require("../models/Dokter");

const dataDokter = [
  {
    _id: "dokter02111",
    nama: "dr. Max Aleksander Sp.B",
    spesialisasi: "Bedah Umum",
    sub: "Sub. Bedah Ortopedi",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
    jadwal: {
      "2025-05-31": ["13:00", "14:00", "15:00", "16:00"],
      "2025-06-01": ["13:30", "14:30", "16:00", "17:00"],
      "2025-06-02": ["15:00", "16:00", "17:00", "18:00"],
      "2025-06-03": ["16:30", "17:30", "18:30", "19:30"],
    },
  },
  {
    _id: "dokter02112",
    nama: "dr. Sarah Wijaya Sp.BO",
    spesialisasi: "Bedah Ortopedi",
    sub: "Sub. Trauma Ortopedi",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/32.jpg",
    jadwal: {
      "2025-06-18": ["09:10", "10:20", "11:30", "12:40"],
      "2025-06-19": ["10:45", "11:55", "13:05", "14:15"],
      "2025-06-20": ["13:20", "14:30", "15:40", "16:50"],
      "2025-06-21": ["15:35", "16:45", "17:55", "19:05"],
    },
  },
  {
    _id: "dokter02113",
    nama: "dr. Budi Hermawan Sp.B(K) Onk",
    spesialisasi: "Bedah Onkologi",
    sub: "Sub.  Hermatologi",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/33.jpg",
    jadwal: {
      "2025-06-18": ["08:15", "09:25", "10:35", "11:45"],
      "2025-06-19": ["10:50", "12:00", "13:10", "14:20"],
      "2025-06-20": ["13:25", "15:35", "17:45", "18:55"],
      "2025-06-21": ["15:40", "16:50", "18:00", "19:10"],
    },
  },
  {
    _id: "dokter02114",
    nama: "dr. Citra Kurniawati Sp.BA",
    spesialisasi: "Bedah Anak",
    sub: "Sub. Anak",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/33.jpg",
    jadwal: {
      "2025-06-18": ["07:05", "09:35", "11:15", "12:25"],
      "2025-06-19": ["10:40", "11:50", "13:00", "14:10"],
      "2025-06-20": ["13:15", "14:25", "15:35", "16:45"],
      "2025-06-21": ["15:50", "17:00", "18:10", "19:20"],
    },
  },
  {
    _id: "dokter02115",
    nama: "dr. Dimas Prabowo Sp.An",
    spesialisasi: "Anesthesi",
    sub: "Sub.  Anesthesiologi",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/34.jpg",
    jadwal: {
      "2025-06-18": ["08:45", "09:55", "11:05", "12:15"],
      "2025-06-19": ["10:55", "12:05", "13:15", "14:25"],
      "2025-06-20": ["13:30", "14:40", "15:50", "17:00"],
      "2025-06-21": ["15:55", "17:05", "18:15", "19:25"],
    },
  },
  {
    _id: "dokter02116",
    nama: "dr. Eko Prasetyo Sp.A",
    spesialisasi: "Anak",
    sub: "Sub. Kedokteran Umum",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/35.jpg",
    jadwal: {
      "2025-06-18": ["08:10", "09:20", "10:30", "11:40"],
      "2025-06-19": ["10:35", "11:45", "12:55", "14:05"],
      "2025-06-20": ["13:35", "14:45", "15:55", "17:05"],
      "2025-06-21": ["14:40", "15:50", "17:00", "18:10"],
    },
  },
  {
    _id: "dokter02117",
    nama: "dr. Fani Kusuma Sp.PD",
    spesialisasi: "Penyakit Dalam",
    sub: "Sub. Endoktrin-Tiroid, Metabolik & Diabetes",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/36.jpg",
    jadwal: {
      "2025-06-18": ["08:20", "09:30", "10:40", "11:50"],
      "2025-06-19": ["10:25", "11:35", "12:45", "13:55"],
      "2025-06-20": ["13:10", "14:20", "15:30", "16:40"],
      "2025-06-21": ["15:45", "16:55", "18:05", "19:15"],
    },
  },
  {
    _id: "dokter02118",
    nama: "dr. Gita Sp.PD-KGH",
    spesialisasi: "Hermodialisa",
    sub: "Sub.  Kardiologi",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/37.jpg",
    jadwal: {
      "2025-06-18": ["08:25", "09:35", "10:45", "11:55"],
      "2025-06-19": ["10:15", "11:25", "12:35", "13:45"],
      "2025-06-20": ["13:05", "14:15", "15:25", "16:35"],
      "2025-06-21": ["15:50", "17:00", "18:10", "19:20"],
    },
  },
  {
    _id: "dokter02119",
    nama: "dr. Hendra Wijayanto Sp.JP",
    spesialisasi: "Kardiologi",
    sub: "Sub. Hermodialisa",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/38.jpg",
    jadwal: {
      "2025-06-18": ["08:30", "09:40", "10:50"],
      "2025-06-19": ["10:20", "11:30", "12:40"],
      "2025-06-20": ["13:15", "14:25", "15:35"],
      "2025-06-21": ["15:55", "17:05", "18:15"],
    },
  },
  {
    _id: "dokter02120",
    nama: "dr. Indah Sari Sp.N",
    spesialisasi: "Neurologi",
    sub: "Sub. Neurofisiologi Klinis",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/39.jpg",
    jadwal: {
      "2025-06-18": ["08:35", "09:45", "10:55"],
      "2025-06-19": ["10:25", "11:35", "12:45"],
      "2025-06-20": ["13:20", "14:30", "15:40"],
      "2025-06-21": ["15:50", "17:00", "18:10"],
    },
  },
  {
    _id: "dokter02121",
    nama: "dr. Joko Santoso Sp.BP",
    spesialisasi: "Bedah Plastik",
    sub: "Sub. Bedah Rekonstruksi-Estetika",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/40.jpg",
    jadwal: {
      "2025-06-18": ["08:40", "09:50", "11:00"],
      "2025-06-19": ["10:30", "11:40", "12:50"],
      "2025-06-20": ["13:25", "14:35", "15:45"],
      "2025-06-21": ["15:55", "17:05", "18:15"],
    },
  },
  {
    _id: "dokter02122",
    nama: "dr. Kiki Lestari Sp.THT-BKL",
    spesialisasi: "THT",
    sub: "Sub. Bedah Kepala Leher",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/41.jpg",
    jadwal: {
      "2025-06-18": ["08:45", "09:55", "11:05"],
      "2025-06-19": ["10:35", "11:45", "12:55"],
      "2025-06-20": ["13:30", "14:40", "15:50"],
      "2025-06-21": ["16:00", "17:10", "18:20"],
    },
  },
  {
    _id: "dokter02123",
    nama: "dr. Lala Sp.OG",
    spesialisasi: "Ginekologi",
    sub: "Sub. Kebidanan & Kandungan",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/42.jpg",
    jadwal: {
      "2025-06-18": ["08:50", "10:00", "11:10"],
      "2025-06-19": ["10:40", "11:50", "13:00"],
      "2025-06-20": ["13:35", "14:45", "15:55"],
      "2025-06-21": ["16:05", "17:15", "18:25"],
    },
  },
  {
    _id: "dokter02124",
    nama: "Dr. Hendri Prasetyo Sp.And",
    spesialisasi: "Andrologi",
    sub: "Sub. Hermodialisa",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/43.jpg",
    jadwal: {
      "2025-06-18": ["08:55", "10:05", "11:15"],
      "2025-06-19": ["10:45", "11:55", "13:05"],
      "2025-06-20": ["13:40", "14:50", "16:00"],
      "2025-06-21": ["16:10", "17:20", "18:30"],
    },
  },
  {
    _id: "dokter02125",
    nama: "Dr. Nia Ramadhani Sp.KG",
    spesialisasi: "Gigi dan Mulut",
    sub: "Sub. Kedokteran Gigi Umum",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    jadwal: {
      "2025-06-18": ["09:00", "10:10", "11:20"],
      "2025-06-19": ["10:50", "12:00", "13:10"],
      "2025-06-20": ["13:45", "14:55", "16:05"],
      "2025-06-21": ["16:15", "17:25", "18:35"],
    },
  },
  {
    _id: "dokter02126",
    nama: "Dr. Oki Lestari Sp.KJ",
    spesialisasi: "Jiwa",
    sub: "Sub. Psikiatri Anak & Remaja",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/45.jpg",
    jadwal: {
      "2025-06-18": ["09:05", "10:15", "11:25"],
      "2025-06-19": ["10:55", "12:05", "13:15"],
      "2025-06-20": ["13:50", "15:00", "16:10"],
      "2025-06-21": ["16:20", "17:30", "18:40"],
    },
  },
  {
    _id: "dokter02127",
    nama: "Dr. Puti Pujiastuti Sp.KFR",
    spesialisasi: "Fisik & Rehabilitasi",
    sub: "Sub. Rehabilitasi Medik",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/46.jpg",
    jadwal: {
      "2025-06-18": ["09:10", "10:20", "11:30"],
      "2025-06-19": ["11:00", "12:10", "13:20"],
      "2025-06-20": ["13:55", "15:05", "16:15"],
      "2025-06-21": ["16:25", "17:35", "18:45"],
    },
  },
  {
    _id: "dokter02128",
    nama: "Dr. Qori Sanjaya Sp.KK",
    spesialisasi: "Kulit dan Kelamin",
    sub: "Sub. Dermatologi-Venerologi",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/47.jpg",
    jadwal: {
      "2025-06-18": ["09:15", "10:25", "11:35"],
      "2025-06-19": ["11:05", "12:15", "13:25"],
      "2025-06-20": ["14:00", "15:10", "16:20"],
      "2025-06-21": ["16:30", "17:40", "18:50"],
    },
  },
  {
    _id: "dokter02129",
    nama: "Dr. Rudi Santoso Sp.Ked",
    spesialisasi: "Kedokteran Umum",
    sub: "Sub.  Bedah Umum",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/men/48.jpg",
    jadwal: {
      "2025-06-18": ["09:20", "10:30", "11:40"],
      "2025-06-19": ["11:10", "12:20", "13:30"],
      "2025-06-20": ["14:05", "15:15", "16:25"],
      "2025-06-21": ["16:35", "17:45", "18:55"],
    },
  },
  {
    _id: "dokter02130",
    nama: "Dr. Sintawati Sp.M",
    spesialisasi: "Mata",
    sub: "Sub. Oftalmologi",
    rumahSakit: "RS Mandaya Royal Puri",
    foto: "https://randomuser.me/api/portraits/women/49.jpg",
    jadwal: {
      "2025-06-18": ["09:25", "10:35", "11:45"],
      "2025-06-19": ["11:15", "12:25", "13:35"],
      "2025-06-20": ["14:10", "15:20", "16:30"],
      "2025-06-21": ["16:40", "17:50", "19:00"],
    },
  },
];
async function seed() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://ticketing_admin:I7XWhmPnO9dpGekf@ticketingcluster.0ymhggh.mongodb.net/ticketing?retryWrites=true&w=majority&appName=TicketingCluster"
    );
    await Dokter.deleteMany();
    await Dokter.insertMany(dataDokter);
    console.log("Seeding dokter selesai!");
    process.exit();
  } catch (err) {
    console.error("Error seeding dokter:", err);
    process.exit(1);
  }
}

seed();
