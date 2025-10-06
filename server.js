import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve static files (css, js, images)
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "index.html"));
});

app.get("/products", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "products.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "contact.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "cart.html"));
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
