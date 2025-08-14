const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const port = 3000;

// Multer storage som sparar filen med timestamp + original filändelse
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

app.use(express.static("public"));

app.post("/api/predict", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Ingen fil mottagen." });
  }

  const filePath = path.resolve(req.file.path);

  console.log("📁 Fil mottagen:", req.file.originalname);
  console.log("📂 Absolut filväg:", filePath);

  if (!fs.existsSync(filePath)) {
    console.error("⛔ Filen finns inte på disk:", filePath);
    return res.status(400).json({ error: "Filen kunde inte hittas." });
  }

  try {
    console.log("🚀 Startar Python-klient...");

    const command = `/home/infinitgamerking/video-converter/XenoBelino.github.io/venv/bin/python3 run_client.py "${filePath}"`;

  exec(command, { timeout:1200000 }, (error, stdout, stderr) => {   // 20 minuter
      if (error) {
        console.error("❌ Python-process fel:");
        console.error("Error.message:", error.message);
        console.error("stderr:", stderr);
        console.error("stdout:", stdout);

        fs.unlink(filePath, (err) => {
          if (err) console.warn("⚠️ Kunde inte radera temporär fil:", filePath);
          else console.log("🗑️ Fil borttagen:", filePath);
        });

        return res.status(500).json({ error: "Fel i AI-processen", details: stderr || error.message });
      }

      console.log("✅ Svar från Python:", stdout.trim());

      fs.unlink(filePath, (err) => {
        if (err) console.warn("⚠️ Kunde inte radera temporär fil:", filePath);
        else console.log("🗑️ Fil borttagen:", filePath);
      });

      res.json({ result: stdout.trim() });
    });
  } catch (error) {
    console.error("❌ Ovntat fel:", error.message);
    res.status(500).json({ error: "Oväntat serverfel" });
  }
});

app.listen(port, () => {
  console.log(`🌐 Servern körs på http://localhost:${port}`);
});
