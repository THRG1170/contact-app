const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/thrg", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("Connected!"));

// const Siswa = mongoose.model("Siswa", {
//   nama: {
//     type: String,
//     required: true,
//   },
//   kelas: {
//     type: String,
//     required: true,
//   },
//   jurusan: {
//     type: String,
//     required: true,
//   },
// });

// const triputra = new Siswa({
//   nama: "Triputra",
//   kelas: "10",
//   jurusan: "Mipa",
// });
// const ariel = new Siswa({
//   nama: "Ariel Hutomo",
//   kelas: "10",
//   jurusan: "Ipa",
// });

// ariel.save().then((siswa) => console.log(siswa));
// triputra.save().then((siswa) => console.log(siswa));
