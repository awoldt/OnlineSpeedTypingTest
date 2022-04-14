require("dotenv").config();

const express = require("express");
const mobile = require("is-mobile");
const app = express();
const generatedWords = require("random-word"); //word generator

app.set("view engine", "ejs");
app.use(express.static("public"));

app.listen(process.env.PORT, () => {
  console.log("== server is running on port " + process.env.PORT + " ==");
});

//home page
app.get("/", (req, res) => {
  //generates 100 words
  var words = [];
  for (i = 0; i < 100; ++i) {
    words.push(generatedWords());
  }

  //mobile device
  if (mobile({ ua: req })) {
    res.render("index-m", {
      title: "Free Online Speed Typing Test",
      description:
        "Sharpen your typing skills. Compete with friends to see who can get the highest WPM score. Optimised for both desktop and mobile devices, practice typing wherever.",
      style: "styles-m.css",
      txt: words,
      shareBtnInNav: false,
      mobile: true,
    });
  }
  //desktop device
  else {
    res.render("index", {
      title: "Free Online Speed Typing Test",
      description:
        "Sharpen your typing skills. Compete with friends to see who can get the highest WPM score. Optimised for both desktop and mobile devices, practice typing wherever.",
      style: "styles.css",
      txt: words,
      shareBtnInNav: true,
    });
  }
});

//privacy
app.get("/privacy", (req, res) => {
  res.status(200);
  res.sendFile(__dirname + '/privacy.html')
});

//sitemap.xml
app.get("/sitemap.xml", (req, res) => {
  res.sendFile(__dirname + "/sitemap.xml", (err) => {
    if (err) {
      res.send(err);
    }
  });
});

//404
app.use((req, res) => {
  res.status(404);
  res.send('error. page not found.<br><br><a href="/">return</a>');
});
