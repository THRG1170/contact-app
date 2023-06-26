const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");

const flash = require("connect-flash");
const session = require("express-session");
const cookie = require("cookie-parser");
const cookieParser = require("cookie-parser");
const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

const app = express();

const port = 3000;

//?database
require("./app/utils/db");
const Siswa = require("./app/models/siswa");

app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(expressLayouts);
app.use(morgan("dev"));
app.use(express.static("public"));
//?flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "<h1>Express JS</h1>",
    layout: "layouts/main",
  });
});

app.get("/siswa", async (req, res) => {
  const siswas = await Siswa.find();

  res.render("siswa", {
    title: "Contact",
    layout: "layouts/main",
    msg: req.flash("msg"),
    siswas,
  });
});

app.get("/siswa/add", async (req, res) => {
  res.render("siswa/add", {
    title: "Add Siswa",
    layout: "layouts/main",
  });
});

app.post(
  "/siswa",
  [
    body("nama").custom(async (value) => {
      const duplicate = await Siswa.findOne({ nama: value });
      if (duplicate) {
        throw new Error("Nama sudah ada");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const siswa = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("siswa/add", {
        title: "Contact",
        layout: "layouts/main",
        errors: errors.array(),
        siswa,
      });
    } else {
      Siswa.insertMany(req.body).then((err, result) => {
        req.flash("msg", "Data siswa telah ditambahkan");
        res.redirect("/siswa");
      });
    }
  }
);

app.delete("/siswa/:id", async (req, res) => {
  const siswa = await Siswa.findOne({ _id: req.params.id });
  if (!siswa) {
    res.status(404);
    res.send("404");
  } else {
    Siswa.deleteOne({ _id: req.params.id }).then((result) => {
      req.flash("msg", "Data siswa telah dihapus");
      res.redirect("/siswa");
    });
  }
});

app.get("/siswa/edit/:id", async (req, res) => {
  const siswa = await Siswa.findOne({ _id: req.params.id });

  res.render("siswa/edit", {
    title: "Edit siswa",
    layout: "layouts/main",
    siswa,
  });
});

app.put(
  "/siswa/:id",
  [
    body("nama").custom(async (value, { req }) => {
      const duplicate = await Siswa.findOne({ nama: value });
      console.log(duplicate);
      if (value !== req.body.oldNama && duplicate) {
        throw new Error("Nama sudah ada");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("siswa/edit", {
        title: "Edit siswa",
        layout: "layouts/main",
        siswa: req.body,
        errors: errors.array(),
      });
    } else {
      Siswa.updateOne(
        { _id: req.params.id },
        {
          $set: {
            nama: req.body.nama,
            kelas: req.body.kelas,
            jurusan: req.body.jurusan,
          },
        }
      ).then((err, result) => {
        req.flash("msg", "Data siswa telah diedit");
        res.redirect("/siswa");
      });
    }
  }
);

app.get("/siswa/:id", async (req, res) => {
  const siswa = await Siswa.findOne({ _id: req.params.id });

  res.render("siswa/details", {
    layout: "layouts/main",
    siswa,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    layout: "layouts/main",
  });
});

app.use("/", (req, res) => {
  res.send("Not Found");
});

app.listen(port, () => {
  console.log(`Web server listening on port http://localhost:${port}`);
});
