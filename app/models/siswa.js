const mongoose = require("mongoose");

const Siswa = mongoose.model("Siswa", {
  nama: {
    type: String,
    required: true,
  },
  kelas: {
    type: String,
    required: true,
  },
  jurusan: {
    type: String,
    required: true,
  },
});

module.exports = Siswa;
