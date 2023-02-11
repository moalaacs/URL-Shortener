const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./Models/shortUrl");
const app = express();

app.listen(process.env.PORT || 5000);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb://127.0.0.1/urlShortener",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB Connected Successfully");
  }
);

app.get("/", async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render("index", { shortUrls: shortUrls });
  console.log(shortUrls);
});

app.post("/shortUrls", async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl });
  console.log(req.body.fullUrl);
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const dbShortUrl = await shortUrl.findOne({ short: req.params.shortUrl });
  if (dbShortUrl == null) {
    return res.sendStatus(404);
  }
  dbShortUrl.clicks++;
  dbShortUrl.save();
  res.redirect(dbShortUrl.full);
});