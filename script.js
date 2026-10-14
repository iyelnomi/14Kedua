/* =========================================================
   1. ISI KENANGAN
   Ganti teks di sini dengan kenangan kalian.
   Kunci angka = nomor level (1-12).
   ========================================================= */
const MEMORIES = {
  1: [
    { tgl: "Tanggal kenangan", teks: "Tulis kenangan kalian untuk Level 1 di sini." },
    { tgl: "Tanggal lain", teks: "Tambah kenangan lain sebanyak yang kamu mau." }
  ]
  // 2: [{ tgl: "...", teks: "..." }],
  // 3: [...], dst.
};

/* =========================================================
   2. DAFTAR GAME TIAP LEVEL
   Level 1 = game ular. Level lain tinggal ditambahkan
   dengan pola yang sama: { nama, target, run: fungsiGame }
   ========================================================= */
const GAMES = {
  1: { nama: "Game Ular", target: 11, run: snake } // skor 11 = lebih dari 10
};

/* =========================================================
   3. STATUS LEVEL TERBUKA (disimpan di browser)
   ========================================================= */
let unlocked = {};
try { unlocked = JSON.parse(localStorage.getItem("memori-unlocked") || "{}"); } catch (e) {}

function save() {
  try { localStorage.setItem("memori-unlocked", JSON.stringify(unlocked)); } catch (e) {}
}

/* =========================================================
   4. TAMPILAN LEVEL 1-12
   ========================================================= */
const grid = document.getElementById("grid");
const ov = document.getElementById("ov");
const box = document.getElementById("box");
let stop = null; // fungsi untuk menghentikan game yang sedang jalan

function render() {
  grid.innerHTML = "";
  for (let n = 1; n <= 12; n++) {
    const b = document.createElement("button");
    b.className = "lv" + (unlocked[n] ? " open" : "");
    b.innerHTML = "<b>" + (unlocked[n] ? "💖" : "🔒") + "</b><small>Level " + n + "</small>";
    b.onclick = () => openLevel(n);
    grid.appendChild(b);
  }
}

function show() { ov.classList.add("on"); }
function hide() {
  ov.classList.remove("on");
  if (stop) { stop(); stop = null; }
}
ov.onclick = e => { if (e.target === ov) hide(); };

/* =========================================================
   5. BUKA LEVEL: tampilkan game atau kenangan
   ========================================================= */
function openLevel(n) {
  if (unlocked[n]) return showMemories(n);

  const g = GAMES[n];
  if (!g) {
    box.innerHTML = "<h2>🔒 Level " + n + "</h2><p>Game untuk level ini belum dibuat. Segera hadir!</p><button class='b' onclick='hide()'>Tutup</button>";
    return show();
  }

  box.innerHTML =
    "<h2>" + g.nama + " · Level " + n + "</h2>" +
    "<p>Capai skor <b>lebih dari 10</b> untuk membuka level ini.</p>" +
    "<canvas id='cv' width='300' height='300'></canvas>" +
    "<div>Skor: <span class='sc' id='sc'>0</span> / " + g.target + "</div>" +
    "<div class='pad' id='pad'></div>" +
    "<button class='b' onclick='hide()'>Tutup</button>";
  show();
  stop = g.run(document.getElementById("cv"), n, g.target);
}

function showMemories(n) {
  const list = (MEMORIES[n] || []).map(x =>
    "<div class='mem'><small>" + x.tgl + "</small><div>" + x.teks + "</div></div>"
  ).join("") || "<p>Belum ada kenangan yang ditulis.</p>";
  box.innerHTML = "<h2>💖 Level " + n + "</h2>" + list + "<button class='b' onclick='hide()'>Tutup</button>";
  show();
}

function win(n) {
  unlocked[n] = true;
  save();
  render();
  box.innerHTML = "<h2>🎉 Berhasil!</h2><p>Level " + n + " terbuka.</p><button class='b' onclick='showMemories(" + n + ")'>Lihat kenangan</button>";
}

/* =========================================================
   6. GAME ULAR (Level 1)
   ========================================================= */
function snake(cv, n, target) {
  const c = cv.getContext("2d");
  const N = 15, S = 20; // 15x15 kotak, tiap kotak 20px
  let sn = [{ x: 7, y: 7 }], dir = { x: 1, y: 0 }, nd = dir;
  let food, score = 0, t, alive = true;

  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#e8476e";

  // Taruh makanan di tempat kosong
  function place() {
    do {
      food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    } while (sn.some(s => s.x == food.x && s.y == food.y));
  }

  // Ganti arah (tidak boleh langsung berbalik)
  function setDir(x, y) {
    if (x == -dir.x && y == -dir.y) return;
    nd = { x, y };
  }

  // Kontrol keyboard
  function key(e) {
    const k = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
    if (k) { e.preventDefault(); setDir(...k); }
  }
  document.addEventListener("keydown", key);

  // Kontrol tombol di layar
  const pad = document.getElementById("pad");
  [["", 0, 0], ["▲", 0, -1], ["", 0, 0], ["◀", -1, 0], ["▼", 0, 1], ["▶", 1, 0]].forEach(a => {
    const b = document.createElement("button");
    b.textContent = a[0];
    if (a[0]) b.onclick = () => setDir(a[1], a[2]);
    else b.style.visibility = "hidden";
    pad.appendChild(b);
  });

  // Kontrol geser (swipe) di HP
  let sx, sy;
  cv.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  cv.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    Math.abs(dx) > Math.abs(dy) ? setDir(dx > 0 ? 1 : -1, 0) : setDir(0, dy > 0 ? 1 : -1);
  });

  // Gambar makanan dan ular
  function draw() {
    c.clearRect(0, 0, 300, 300);
    c.fillStyle = "#ffb347";
    c.beginPath(); c.arc(food.x * S + 10, food.y * S + 10, 8, 0, 7); c.fill();
    c.fillStyle = css("--pink");
    sn.forEach((s, i) => {
      c.globalAlpha = i ? 0.85 : 1;
      c.fillRect(s.x * S + 1, s.y * S + 1, S - 2, S - 2);
    });
    c.globalAlpha = 1;
  }

  // Satu langkah game
  function tick() {
    dir = nd;
    const h = { x: sn[0].x + dir.x, y: sn[0].y + dir.y };

    // Kena dinding atau badan sendiri = game over
    if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || sn.some(s => s.x == h.x && s.y == h.y)) {
      clearInterval(t); alive = false;
      c.fillStyle = "rgba(0,0,0,.6)"; c.fillRect(0, 0, 300, 300);
      c.fillStyle = "#fff"; c.font = "20px Georgia"; c.textAlign = "center";
      c.fillText("Game over! Skor " + score, 150, 145);
      c.font = "14px Georgia";
      c.fillText("Ketuk di sini untuk coba lagi", 150, 172);
      return;
    }

    sn.unshift(h);
    if (h.x == food.x && h.y == food.y) {
      // Makan: skor naik, ular memanjang
      score++;
      document.getElementById("sc").textContent = score;
      place();
      if (score >= target) { // menang, buka level
        clearInterval(t); cleanup(); draw();
        setTimeout(() => win(n), 300);
        return;
      }
    } else {
      sn.pop();
    }
    draw();
  }

  function cleanup() { document.removeEventListener("keydown", key); }

  function start() {
    sn = [{ x: 7, y: 7 }]; dir = nd = { x: 1, y: 0 }; score = 0; alive = true;
    document.getElementById("sc").textContent = 0;
    place(); clearInterval(t);
    t = setInterval(tick, 130); // kecepatan: makin kecil makin cepat
    draw();
  }

  cv.addEventListener("click", () => { if (!alive) start(); }); // ketuk untuk main ulang
  start();

  // Dipanggil saat popup ditutup
  return () => { clearInterval(t); cleanup(); };
}

/* =========================================================
   7. JALANKAN
   ========================================================= */
render();
