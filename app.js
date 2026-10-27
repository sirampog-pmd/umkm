// ==================== DATA MASTER ====================
const SUBSEKTOR = [
  { id: 1, nama: 'Arsitektur', emoji: '🏛️' },
  { id: 2, nama: 'Desain Interior', emoji: '🛋️' },
  { id: 3, nama: 'Desain Komunikasi Visual', emoji: '🎨' },
  { id: 4, nama: 'Desain Produk', emoji: '📦' },
  { id: 5, nama: 'Film, Animasi & Video', emoji: '🎬' },
  { id: 6, nama: 'Fotografi', emoji: '📷' },
  { id: 7, nama: 'Kriya', emoji: '🏺' },
  { id: 8, nama: 'Kuliner', emoji: '🍜' },
  { id: 9, nama: 'Musik', emoji: '🎵' },
  { id: 10, nama: 'Penerbitan', emoji: '📚' },
  { id: 11, nama: 'Periklanan', emoji: '📢' },
  { id: 12, nama: 'Seni Pertunjukan', emoji: '🎭' },
  { id: 13, nama: 'Seni Rupa', emoji: '🖼️' },
  { id: 14, nama: 'Aplikasi & Game', emoji: '🎮' },
  { id: 15, nama: 'Televisi & Radio', emoji: '📺' },
  { id: 16, nama: 'Fashion', emoji: '👗' },
  { id: 17, nama: 'Desain UI/UX', emoji: '📱' },
  { id: 18, nama: 'Konten Kreator', emoji: '📹' },
  { id: 19, nama: 'E-Sport', emoji: '🕹️' },
  { id: 20, nama: 'Virtual Reality', emoji: '🥽' },
  { id: 21, nama: 'Kecerdasan Artifisial', emoji: '🤖' }
];

// Ganti WILAYAH dengan 17 Kecamatan di Brebes
const WILAYAH = [
  'Brebes', 'Bumiayu', 'Bantarkawung', 'Bulakamba', 'Bandungsari', 
  'Jatibarang', 'Kersana', 'Ketanggungan', 'Larangan', 'Losari', 
  'Paguyangan', 'Salem', 'Sirampog', 'Songgom', 'Tanjung', 
  'Tonjong', 'Wanasari'
];

// Koordinat pusat kecamatan di Kabupaten Brebes
const KOORDINAT_WILAYAH = {
  'Brebes': [-6.8727, 109.0431],
  'Bumiayu': [-7.2519, 109.0103],
  'Bantarkawung': [-7.1944, 108.9075],
  'Bulakamba': [-6.8706, 108.9567],
  'Bandungsari': [-7.0456, 108.9833],
  'Jatibarang': [-6.9333, 109.0500],
  'Kersana': [-6.9167, 108.8667],
  'Ketanggungan': [-6.9333, 108.8833],
  'Larangan': [-7.0167, 108.9167],
  'Losari': [-6.8333, 108.8000],
  'Paguyangan': [-7.2167, 109.0333],
  'Salem': [-7.1833, 108.8000],
  'Sirampog': [-7.2167, 109.0833],
  'Songgom': [-6.9833, 108.9333],
  'Tanjung': [-6.8500, 108.8833],
  'Tonjong': [-7.1500, 109.0167],
  'Wanasari': [-6.8833, 109.0000]
};

const FASILITASI = ['Pembiayaan','Pelatihan','Pemasaran','Digitalisasi','Infrastruktur'];

// ==================== DATA PELAKU (SIMULASI) ====================
let dataPelaku = [];
let activeDashboardFilter = "";

function generateSampleData() {
  const namaDepan = ['CV','PT','UD','Studio','Rumah','Karya','Sanggar','Galeri','Komunitas','Perusahaan'];
  const namaBelakang = ['Kreatif','Nusantara','Mandiri','Jaya','Cipta','Bersama','Digital','Seni','Inovasi','Global'];
  const arr = [];
  for (let i = 1; i <= 120; i++) {
    const sub = SUBSEKTOR[Math.floor(Math.random() * SUBSEKTOR.length)];
    const wil = WILAYAH[Math.floor(Math.random() * WILAYAH.length)];
    arr.push({
      id: i,
      nama: `${namaDepan[Math.floor(Math.random()*namaDepan.length)]} ${namaBelakang[Math.floor(Math.random()*namaBelakang.length)]} ${i}`,
      subsektor: sub.nama,
      wilayah: wil,
      potensi: Math.floor(Math.random() * 60) + 40,
      pasar: Math.floor(Math.random() * 60) + 40,
      fasilitasi: FASILITASI[Math.floor(Math.random() * FASILITASI.length)]
    });
  }
  return arr;
}
dataPelaku = generateSampleData();

// ==================== STATE ====================
let currentPage = 1;
const rowsPerPage = 10;
let filteredData = [...dataPelaku];
const charts = {};

// ==================== NAVIGATION ====================
const pageConfig = {
  dashboard: { title: 'Dashboard Profiling', sub: 'Ringkasan data pelaku ekonomi kreatif nasional' },
  pelaku: { title: 'Data Pelaku', sub: 'Basis data pelaku ekonomi kreatif terpilah' },
  subsektor: { title: '21 Subsektor Ekraf', sub: 'Pemetaan pelaku menurut subsektor' },
  peta: { title: 'Sebaran Wilayah', sub: 'Peta potensi dan sebaran pelaku per wilayah' },
  analisis: { title: 'Analisis & Rekomendasi', sub: 'Rekomendasi program kebijakan dan tindak lanjut pengawasan' }
};

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.getElementById('pageTitle').textContent = pageConfig[page].title;
    document.getElementById('pageSub').textContent = pageConfig[page].sub;

    if (page === 'dashboard') renderDashboardCharts();
    if (page === 'subsektor') renderSubsektor();
    if (page === 'peta') {
	  renderPetaCharts();
	  setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 300);
	}
    if (page === 'analisis') {
	  renderAnalisis();
	  renderChartKuadran(); // 🔥 Tambahkan ini
	}
    if (page === 'pelaku') renderTable();
  });
});

// ==================== ANIMATED COUNTER ====================
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    let cur = 0;
    const step = target / 60;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = Math.floor(cur).toLocaleString('id-ID');
    }, 20);
  });
}

// ==================== KALKULASI STATISTIK REAL ====================
function updateStatistics() {
  // 🔥 Filter data berdasarkan dropdown
  const filteredData = activeDashboardFilter 
    ? dataPelaku.filter(p => p.wilayah === activeDashboardFilter)
    : dataPelaku;

  const totalPelaku = filteredData.length;
  
  const subsektorUnik = new Set(filteredData.map(p => p.subsektor));
  const totalSubsektor = subsektorUnik.size;
  
  // Jika difilter, "Wilayah" diganti jadi "Fasilitasi Terbanyak" atau tetap 1
  const totalWilayah = activeDashboardFilter ? 1 : new Set(filteredData.map(p => p.wilayah)).size;
  
  let rataRataPasar = 0;
  if (totalPelaku > 0) {
    const totalPasar = filteredData.reduce((sum, p) => sum + Number(p.pasar), 0);
    rataRataPasar = Math.round(totalPasar / totalPelaku);
  }

  const cards = document.querySelectorAll('.stat-card h3');
  if (cards.length >= 4) {
    cards[0].setAttribute('data-count', totalPelaku);
    cards[1].setAttribute('data-count', totalSubsektor);
    cards[2].setAttribute('data-count', totalWilayah);
    cards[3].setAttribute('data-count', rataRataPasar);
    animateCounters(); 
  }

  const trendTexts = document.querySelectorAll('.stat-card .trend');
  if (trendTexts.length >= 3) {
    trendTexts[1].textContent = `Dari 21 Subsektor`; 
    trendTexts[2].textContent = activeDashboardFilter ? `Kec. ${activeDashboardFilter}` : `Dari 17 Kecamatan Brebes`;
    trendTexts[3].textContent = `Skor rata-rata`;
  }
}

// ==================== CHART HELPERS ====================
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,   // tetap false, tapi container sekarang fixed height
  animation: { duration: 800 },
  plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
  scales: {
    x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(148,163,184,0.08)' } },
    y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(148,163,184,0.08)' } }
  }
};

function destroyChart(id) {
  if (charts[id]) { charts[id].destroy(); delete charts[id]; }
}

// ==================== DASHBOARD CHARTS ====================
function renderDashboardCharts() {
  // 🔥 Filter data
  const filteredData = activeDashboardFilter 
    ? dataPelaku.filter(p => p.wilayah === activeDashboardFilter)
    : dataPelaku;

  // Jika data kosong setelah difilter, kosongkan chart
  if (filteredData.length === 0) {
    Object.values(charts).forEach(c => c.destroy());
    return;
  }

  // 1. Chart Subsektor Top 10
  const subCount = {};
  filteredData.forEach(p => { subCount[p.subsektor] = (subCount[p.subsektor]||0)+1; });
  const topSub = Object.entries(subCount).sort((a,b)=>b[1]-a[1]).slice(0,10);

  destroyChart('subsektor');
  charts.subsektor = new Chart(document.getElementById('chartSubsektor'), {
    type: 'bar',
    data: {
      labels: topSub.map(x => x[0]),
      datasets: [{
        label: 'Jumlah Pelaku',
        data: topSub.map(x => x[1]),
        backgroundColor: 'rgba(99,102,241,0.7)',
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(34,211,238,0.9)'
      }]
    },
    options: { ...chartDefaults, indexAxis: 'y', responsive: true, maintainAspectRatio: false }
  });

  // 2. Chart Provinsi (Kecamatan) Top 8
  const provCount = {};
  filteredData.forEach(p => { provCount[p.wilayah] = (provCount[p.wilayah]||0)+1; });
  const topProv = Object.entries(provCount).sort((a,b)=>b[1]-a[1]).slice(0,8);

  destroyChart('provinsi');
  charts.provinsi = new Chart(document.getElementById('chartProvinsi'), {
    type: 'doughnut',
    data: {
      labels: topProv.map(x => x[0]),
      datasets: [{
        data: topProv.map(x => x[1]),
        backgroundColor: ['#6366f1','#22d3ee','#a855f7','#f59e0b','#10b981','#ef4444','#818cf8','#67e8f9'],
        borderWidth: 0
      }]
    },
    options: { ...chartDefaults, responsive: true, maintainAspectRatio: false, cutout: '65%' }
  });

  // 3. Chart Tren (Dummy — karena data kita tidak punya tanggal bervariasi di tiap bulan)
  // Kita buat simulasi tren berdasarkan data yang difilter agar tetap terlihat dinamis
  destroyChart('tren');
  const baseTren = filteredData.length > 0 ? filteredData.length : 1;
  charts.tren = new Chart(document.getElementById('chartTren'), {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','Mei','Jun'],
      datasets: [{
        label: 'Pelaku Baru',
        // Simulasi tren naik
        data: [Math.round(baseTren*0.3), Math.round(baseTren*0.5), Math.round(baseTren*0.6), Math.round(baseTren*0.7), Math.round(baseTren*0.9), baseTren],
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34,211,238,0.15)',
        fill: true, tension: 0.4, pointRadius: 5,
        pointBackgroundColor: '#22d3ee'
      }]
    },
    options: { ...chartDefaults, responsive: true, maintainAspectRatio: false }
  });

  // 4. Chart Fasilitasi
  const fasCount = {};
  filteredData.forEach(p => { fasCount[p.fasilitasi] = (fasCount[p.fasilitasi]||0)+1; });
  destroyChart('fasilitasi');
  charts.fasilitasi = new Chart(document.getElementById('chartFasilitasi'), {
    type: 'polarArea',
    data: {
      labels: Object.keys(fasCount),
      datasets: [{
        data: Object.values(fasCount),
        backgroundColor: ['rgba(99,102,241,0.7)','rgba(34,211,238,0.7)','rgba(168,85,247,0.7)','rgba(245,158,11,0.7)','rgba(16,185,129,0.7)']
      }]
    },
    options: { ...chartDefaults, responsive: true, maintainAspectRatio: false }
  });
}

// ==================== TABLE ====================
function potensiChip(v) {
  if (v >= 75) return `<span class="chip chip-high">Tinggi (${v})</span>`;
  if (v >= 55) return `<span class="chip chip-mid">Sedang (${v})</span>`;
  return `<span class="chip chip-low">Rendah (${v})</span>`;
}

function renderTable() {
  const search = document.getElementById('globalSearch').value.toLowerCase();
  const fSub = document.getElementById('filterSubsektor').value;
  const fWil = document.getElementById('filterWilayah').value;

  filteredData = dataPelaku.filter(p =>
    (!search || p.nama.toLowerCase().includes(search) || p.subsektor.toLowerCase().includes(search) || p.wilayah.toLowerCase().includes(search)) &&
    (!fSub || p.subsektor === fSub) &&
    (!fWil || p.wilayah === fWil)
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * rowsPerPage;
  const pageData = filteredData.slice(start, start + rowsPerPage);

  const tbody = document.querySelector('#tabelPelaku tbody');
  tbody.innerHTML = pageData.map((p, i) => `
    <tr>
      <td>${start + i + 1}</td>
      <td><strong>${p.nama}</strong></td>
      <td><span class="chip chip-sub">${p.subsektor}</span></td>
      <td>${p.wilayah}</td>
      <td>${potensiChip(p.potensi)}</td>
      <td>${potensiChip(p.pasar)}</td>
      <td>${p.fasilitasi}</td>
      <td>
        <button class="action-btn" onclick="editPelaku(${p.id})" title="Edit">✏️</button>
        <button class="action-btn" onclick="hapusPelaku(${p.id})" title="Hapus">🗑️</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="8" style="text-align:center;padding:30px;color:#94a3b8;">Tidak ada data ditemukan</td></tr>';

  document.getElementById('infoTabel').textContent =
    `Menampilkan ${filteredData.length ? start+1 : 0}–${Math.min(start+rowsPerPage, filteredData.length)} dari ${filteredData.length} pelaku`;

  // Pagination
  const pag = document.getElementById('pagination');
  let pHtml = `<button ${currentPage===1?'disabled':''} onclick="gotoPage(${currentPage-1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage-1 && i <= currentPage+1)) {
      pHtml += `<button class="${i===currentPage?'active':''}" onclick="gotoPage(${i})">${i}</button>`;
    } else if (i === currentPage-2 || i === currentPage+2) {
      pHtml += `<button disabled>…</button>`;
    }
  }
  pHtml += `<button ${currentPage===totalPages?'disabled':''} onclick="gotoPage(${currentPage+1})">›</button>`;
  pag.innerHTML = pHtml;
}

window.gotoPage = (n) => { currentPage = n; renderTable(); };

window.hapusPelaku = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus Data?',
    text: "Data ini akan dihapus permanen dari Google Sheets!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
    reverseButtons: true
  });

  if (!result.isConfirmed) return; 

  try {
    Swal.fire({
      title: 'Menghapus...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id: id })
    });
    const res = await response.json();
    
    if (res.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Data berhasil dihapus dari database.',
        timer: 2000,
        showConfirmButton: false
      });
      dataPelaku = dataPelaku.filter(p => String(p.id) !== String(id));
      updateStatistics();
      renderTable();
      renderDashboardCharts();
    } else {
      Swal.fire('Gagal!', res.message, 'error');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error!', 'Terjadi kesalahan jaringan saat menghapus.', 'error');
  }
};

window.editPelaku = (id) => {
  const pelaku = dataPelaku.find(p => String(p.id) === String(id));
  if (!pelaku) return;
  
  document.getElementById('modalTitle').textContent = 'Edit Pelaku Ekonomi Kreatif';
  
  const form = document.getElementById('formPelaku');
  form.querySelector('#editId').value = pelaku.id;
  form.querySelector('[name="nama"]').value = pelaku.nama;
  form.querySelector('[name="subsektor"]').value = pelaku.subsektor;
  form.querySelector('[name="wilayah"]').value = pelaku.wilayah;
  form.querySelector('[name="potensi"]').value = pelaku.potensi;
  form.querySelector('[name="pasar"]').value = pelaku.pasar;
  form.querySelector('[name="fasilitasi"]').value = pelaku.fasilitasi;
  
  document.getElementById('modal').classList.add('active');
};


// ==================== SUBSEKTOR ====================
function renderSubsektor() {
  const grid = document.getElementById('subsektorGrid');
  const counts = {};
  dataPelaku.forEach(p => { counts[p.subsektor] = (counts[p.subsektor]||0)+1; });

  grid.innerHTML = SUBSEKTOR.map(s => `
    <div class="sub-card" onclick="showSubsektorDetail('${s.nama}', '${s.emoji}')" style="cursor: pointer;">
      <span class="sub-emoji">${s.emoji}</span>
      <h5>${s.nama}</h5>
      <p>Pelaku terdata dalam basis data nasional</p>
      <span class="count">${counts[s.nama] || 0} pelaku</span>
      <div style="margin-top: 10px; font-size: 11px; color: var(--primary-light); font-weight: 600; opacity: 0.7;">
        Klik untuk detail →
      </div>
    </div>
  `).join('');
}

// ==================== POPUP DETAIL SUBSEKTOR ====================
window.showSubsektorDetail = (namaSubsektor, emoji) => {
  // 1. Filter data pelaku berdasarkan subsektor yang diklik
  const pelakuDiSubsektor = dataPelaku.filter(p => p.subsektor === namaSubsektor);
  
  // 2. Jika kosong, tampilkan notifikasi
  if (pelakuDiSubsektor.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Belum Ada Data',
      text: `Belum ada pelaku terdata untuk subsektor ${namaSubsektor}.`,
      background: 'var(--bg-2)',
      color: 'var(--text)'
    });
    return;
  }

  // 3. Hitung statistik kecil untuk header popup
  const avgPotensi = Math.round(pelakuDiSubsektor.reduce((s, p) => s + Number(p.potensi), 0) / pelakuDiSubsektor.length);
  const avgPasar = Math.round(pelakuDiSubsektor.reduce((s, p) => s + Number(p.pasar), 0) / pelakuDiSubsektor.length);
  
  // 4. Buat baris tabel HTML
  const rowsHtml = pelakuDiSubsektor.map((p, i) => `
    <tr style="border-bottom: 1px solid rgba(148,163,184,0.1);">
      <td style="padding: 10px 8px; font-size: 12px; color: #94a3b8;">${i + 1}</td>
      <td style="padding: 10px 8px; font-size: 12px; text-align: left; color: #e2e8f0; font-weight: 600;">${p.nama}</td>
      <td style="padding: 10px 8px; font-size: 12px; text-align: left; color: #94a3b8;">${p.wilayah}</td>
      <td style="padding: 10px 8px; font-size: 12px;">
        <span style="background: ${p.potensi >= 75 ? 'rgba(16,185,129,0.2)' : p.potensi >= 55 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}; 
                     color: ${p.potensi >= 75 ? '#34d399' : p.potensi >= 55 ? '#fbbf24' : '#f87171'}; 
                     padding: 2px 8px; border-radius: 10px; font-weight: 600;">
          ${p.potensi}
        </span>
      </td>
      <td style="padding: 10px 8px; font-size: 12px;">
        <span style="background: ${p.pasar >= 75 ? 'rgba(16,185,129,0.2)' : p.pasar >= 55 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}; 
                     color: ${p.pasar >= 75 ? '#34d399' : p.pasar >= 55 ? '#fbbf24' : '#f87171'}; 
                     padding: 2px 8px; border-radius: 10px; font-weight: 600;">
          ${p.pasar}
        </span>
      </td>
      <td style="padding: 10px 8px; font-size: 12px; color: #94a3b8;">${p.fasilitasi}</td>
    </tr>
  `).join('');

  // 5. Tampilkan SweetAlert berukuran besar
  Swal.fire({
    title: `<span style="font-size: 24px;">${emoji} ${namaSubsektor}</span>`,
    width: '850px',
    html: `
      <!-- Ringkasan Singkat -->
      <div style="display: flex; gap: 10px; margin-bottom: 20px; text-align: left;">
        <div style="flex: 1; background: rgba(99,102,241,0.1); padding: 12px; border-radius: 10px; border: 1px solid rgba(99,102,241,0.2);">
          <div style="font-size: 11px; color: #94a3b8;">Total Pelaku</div>
          <div style="font-size: 20px; font-weight: 800; color: #818cf8;">${pelakuDiSubsektor.length}</div>
        </div>
        <div style="flex: 1; background: rgba(34,211,238,0.1); padding: 12px; border-radius: 10px; border: 1px solid rgba(34,211,238,0.2);">
          <div style="font-size: 11px; color: #94a3b8;">Rata-rata Potensi</div>
          <div style="font-size: 20px; font-weight: 800; color: #22d3ee;">${avgPotensi}</div>
        </div>
        <div style="flex: 1; background: rgba(245,158,11,0.1); padding: 12px; border-radius: 10px; border: 1px solid rgba(245,158,11,0.2);">
          <div style="font-size: 11px; color: #94a3b8;">Rata-rata Pasar</div>
          <div style="font-size: 20px; font-weight: 800; color: #f59e0b;">${avgPasar}</div>
        </div>
      </div>

      <!-- Tabel Detail -->
      <div style="max-height: 350px; overflow-y: auto; border-radius: 10px; border: 1px solid rgba(148,163,184,0.15);">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="position: sticky; top: 0; background: #1e293b; z-index: 1;">
            <tr>
              <th style="padding: 10px 8px; font-size: 11px; color: #94a3b8; text-align: left; text-transform: uppercase;">#</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #94a3b8; text-align: left; text-transform: uppercase;">Nama Pelaku</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #94a3b8; text-align: left; text-transform: uppercase;">Wilayah</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #94a3b8; text-align: left; text-transform: uppercase;">Potensi</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #94a3b8; text-align: left; text-transform: uppercase;">Pasar</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #94a3b8; text-align: left; text-transform: uppercase;">Fasilitasi</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `,
    background: 'var(--bg-2)',
    color: 'var(--text)',
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: 'swal-wide-popup'
    }
  });
};

// ==================== PETA LEAFLET ====================
let mapInstance = null;
let markerLayer = null;

function renderPetaCharts() {
  // 1. Render Chart Batang & Radar (Sama seperti sebelumnya)
  const provCount = {};
  dataPelaku.forEach(p => { provCount[p.wilayah] = (provCount[p.wilayah]||0)+1; });
  const top = Object.entries(provCount).sort((a,b)=>b[1]-a[1]).slice(0,10);

  destroyChart('wilayahTop');
  charts.wilayahTop = new Chart(document.getElementById('chartWilayahTop'), {
    type: 'bar',
    data: {
      labels: top.map(x => x[0]),
      datasets: [{
        label: 'Jumlah Pelaku',
        data: top.map(x => x[1]),
        backgroundColor: 'rgba(245,158,11,0.7)',
        borderRadius: 8,
      }]
    },
    options: { ...chartDefaults, responsive: true, maintainAspectRatio: false }
  });

  const agg = {};
  dataPelaku.forEach(p => {
    if (!agg[p.wilayah]) agg[p.wilayah] = { pot: 0, pas: 0, n: 0 };
    agg[p.wilayah].pot += p.potensi; agg[p.wilayah].pas += p.pasar; agg[p.wilayah].n++;
  });
  const topAgg = top.slice(0,6).map(([w]) => ({
    w, pot: Math.round(agg[w].pot / agg[w].n), pas: Math.round(agg[w].pas / agg[w].n)
  }));

  destroyChart('potensiKapasitas');
  charts.potensiKapasitas = new Chart(document.getElementById('chartPotensiKapasitas'), {
    type: 'radar',
    data: {
      labels: topAgg.map(x => x.w),
      datasets: [
        { label: 'Potensi', data: topAgg.map(x => x.pot), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.2)' },
        { label: 'Kapasitas Pasar', data: topAgg.map(x => x.pas), borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.2)' }
      ]
    },
    options: { ...chartDefaults, responsive: true, maintainAspectRatio: false }
  });

  // 2. Render Peta Leaflet
  if (!mapInstance) {
    // Inisialisasi peta pertama kali
    mapInstance = L.map('map', {
      center: [-7.0000, 108.9500],  
      zoom: 10,                     
      zoomControl: false
    });
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // Gunakan tile layer gelap (CartoDB Dark Matter) agar sesuai tema
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	  maxZoom: 19
	}).addTo(mapInstance);

    markerLayer = L.layerGroup().addTo(mapInstance);
  } else {
    // Jika peta sudah ada, pastikan ukurannya sinkron (mencegah bug abu-abu)
    setTimeout(() => mapInstance.invalidateSize(), 200);
  }

  // Bersihkan marker lama
  markerLayer.clearLayers();

  // Loop data agregat per provinsi untuk dipetakan
  const provData = {};
  dataPelaku.forEach(p => {
    if (!provData[p.wilayah]) provData[p.wilayah] = { count: 0, totalPot: 0 };
    provData[p.wilayah].count++;
    provData[p.wilayah].totalPot += p.potensi;
  });

  Object.keys(provData).forEach(wilayah => {
    const coords = KOORDINAT_WILAYAH[wilayah];
    if (!coords) return; // Skip jika koordinat tidak ditemukan

    const count = provData[wilayah].count;
    
    // Tentukan warna & radius berdasarkan jumlah pelaku (Semakin banyak, semakin besar & terang)
    let color = '#818cf8'; // Rendah (Ungu)
    let radius = 8;
    if (count > 5) { color = '#22d3ee'; radius = 12; } // Sedang (Cyan)
    if (count > 10) { color = '#f59e0b'; radius = 16; } // Tinggi (Orange)

    // Buat lingkaran (CircleMarker)
    const circle = L.circleMarker(coords, {
      radius: radius,
      fillColor: color,
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7
    }).addTo(markerLayer);

    // Tooltip interaktif saat di-hover
    circle.bindTooltip(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif; font-size:12px;">
        <b>${wilayah}</b><br>
        Pelaku: <b style="color:${color}">${count}</b> terdata
      </div>
    `, { direction: 'top', className: 'custom-tooltip' });
  });
}

// ==================== ANALISIS ====================
function renderAnalisis() {
  // --- 1. HITUNG AGREGASI DATA ---
  let totalPotensi = 0, totalPasar = 0;
  const subCount = {};
  const fasCount = {};
  
  dataPelaku.forEach(p => {
    totalPotensi += Number(p.potensi);
    totalPasar += Number(p.pasar);
    subCount[p.subsektor] = (subCount[p.subsektor] || 0) + 1;
    fasCount[p.fasilitasi] = (fasCount[p.fasilitasi] || 0) + 1;
  });

  const avgPotensi = Math.round(totalPotensi / dataPelaku.length) || 0;
  const avgPasar = Math.round(totalPasar / dataPelaku.length) || 0;
  
  // Subsektor Teratas
  const topSub = Object.entries(subCount).sort((a, b) => b[1] - a[1])[0];
  
  // Fasilitasi Paling Dibutuhkan
  const topFas = Object.entries(fasCount).sort((a, b) => b[1] - a[1])[0];

  // --- 2. LOGIKA GAP ANALYSIS (Kesenjangan) ---
  // Gap = Potensi - Kapasitas Pasar
  const gap = avgPotensi - avgPasar; 
  let rekomendasiUtama = "";
  let tindakLanjut = "";

  if (gap > 10) {
    rekomendasiUtama = "Pelaku memiliki kualitas produk (potensi) yang sangat baik, namun <b>kapasitas pasar masih tertinggal</b>. Program prioritas adalah <b>Fasilitasi Pemasaran & Digitalisasi</b> (pameran, e-commerce, ekspor).";
    tindakLanjut = "Lakukan audit pada saluran distribusi dan berikan pelatihan digital marketing kepada pelaku dengan gap terbesar.";
  } else if (gap < -10) {
    rekomendasiUtama = "Kapasitas pasar sudah tinggi, namun <b>kualitas produk (potensi) perlu ditingkatkan</b>. Program prioritas adalah <b>Pelatihan SDM & Standarisasi Produk</b>.";
    tindakLanjut = "Lakukan pendampingan mutu produk dan sertifikasi halal/SNI untuk pelaku di sektor ini.";
  } else {
    rekomendasiUtama = "Potensi dan Kapasitas Pasar pelaku relatif <b>seimbang</b>. Fokus program adalah <b>Pembiayaan & Akses Permodalan</b> untuk ekspansi usaha.";
    tindakLanjut = "Fasilitasi kemitraan dengan lembaga keuangan dan program KUR.";
  }

  // --- 3. RENDER KE HTML ---
  const recoList = document.getElementById('recoList');
  recoList.innerHTML = [
    `<li><strong>Metode Gap Analysis:</strong> Rata-rata Potensi (${avgPotensi}) vs Kapasitas Pasar (${avgPasar}) menghasilkan Gap sebesar <b>${gap}</b>. ${rekomendasiUtama}</li>`,
    `<li><strong>Fokus Subsektor:</strong> Subsektor <b>${topSub[0]}</b> mendominasi dengan ${topSub[1]} pelaku. Prioritaskan program penguatan kapasitas pada subsektor ini.</li>`,
    `<li><strong>Fasilitasi Terbanyak:</strong> Sebanyak <b>${topFas[1]} pelaku</b> membutuhkan fasilitasi <b>${topFas[0]}</b>. Alokasikan anggaran intervensi pada skema ini.</li>`
  ].join('');

  const followupList = document.getElementById('followupList');
  followupList.innerHTML = [
    `<li><strong>Tindak Lanjut Gap Analysis:</strong> ${tindakLanjut}</li>`,
    `<li><strong>Audit Data:</strong> Terdapat ${dataPelaku.filter(p => Number(p.potensi) < 55).length} pelaku dengan skor potensi rendah (<55) yang perlu diverifikasi lapangan.</li>`,
    `<li><strong>Monitoring:</strong> Lakukan pemutakhiran data kuartalan untuk melihat pergerakan skor potensi dan pasar.</li>`
  ].join('');

  // Insight Boks
  document.getElementById('insightBox').innerHTML = `
    Berdasarkan analisis terhadap <b>${dataPelaku.length} pelaku</b> ekonomi kreatif di Kabupaten Brebes, 
    subsektor <b>${topSub[0]}</b> menjadi yang terbesar. 
    Secara agregat, rata-rata skor Potensi adalah <b>${avgPotensi}</b> dan Kapasitas Pasar <b>${avgPasar}</b>. 
    ${gap > 10 ? 'Terdapat kesenjangan positif di mana produk lebih baik dari pasar, sehingga strategi promosi mutlak diperlukan.' : 
      gap < -10 ? 'Pasar sudah menerima produk dengan baik, namun kualitas SDM dan produk perlu dibenahi.' : 
      'Kondisi potensi dan pasar sudah seimbang, fokus pada penguatan modal usaha.'}
    <br><br>
    <b>Kesimpulan Kebijakan:</b> Pemerintah Kabupaten Brebes disarankan memfokuskan program pada <b>${topFas[0]}</b> 
    serta mendorong subsektor <b>${topSub[0]}</b> sebagai motor penggerak utama ekraf daerah.
  `;
}

// ==================== FILTER & SEARCH ====================
function populateFilters() {
  const fSub = document.getElementById('filterSubsektor');
  const fWil = document.getElementById('filterWilayah');
  const formSub = document.getElementById('formSubsektor');
  const formWil = document.getElementById('formWilayah');
  const dashFilter = document.getElementById('dashboardFilterWilayah'); // 🔥 Baru

  SUBSEKTOR.forEach(s => {
    fSub.insertAdjacentHTML('beforeend', `<option value="${s.nama}">${s.nama}</option>`);
    formSub.insertAdjacentHTML('beforeend', `<option value="${s.nama}">${s.nama}</option>`);
  });
  
  WILAYAH.forEach(w => {
    fWil.insertAdjacentHTML('beforeend', `<option value="${w}">${w}</option>`);
    formWil.insertAdjacentHTML('beforeend', `<option value="${w}">${w}</option>`);
    dashFilter.insertAdjacentHTML('beforeend', `<option value="${w}">${w}</option>`); // 🔥 Baru
  });

  // Event listener untuk filter dashboard
  dashFilter.addEventListener('change', (e) => {
    activeDashboardFilter = e.target.value;
    updateStatistics();
    renderDashboardCharts();
  });

  fSub.addEventListener('change', () => { currentPage = 1; renderTable(); });
  fWil.addEventListener('change', () => { currentPage = 1; renderTable(); });
  document.getElementById('globalSearch').addEventListener('input', () => { currentPage = 1; renderTable(); });
}

// ==================== MODAL ====================
document.getElementById('btnTambah').addEventListener('click', () => {
  const form = document.getElementById('formPelaku');
  form.reset();
  document.getElementById('editId').value = '';
  document.getElementById('modalTitle').textContent = 'Tambah Pelaku Ekonomi Kreatif';
  document.getElementById('modal').classList.add('active');
});
document.getElementById('closeModal').addEventListener('click', () => document.getElementById('modal').classList.remove('active'));
document.getElementById('cancelModal').addEventListener('click', () => document.getElementById('modal').classList.remove('active'));

const API_URL = 'https://script.google.com/macros/s/AKfycbyPNZLpktQtu1cBgrCtFIvDLBKTv2ng-IjiUiZYF5ox5Db4e4-EsIgsrFsxHX3KYgkK/exec';

document.getElementById('formPelaku').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const editId = formData.get('id');
  const isEdit = editId !== "";

  const data = {
    id: isEdit ? editId : Date.now(),
    action: isEdit ? 'update' : 'create',
    nama: formData.get('nama'),
    subsektor: formData.get('subsektor'),
    wilayah: formData.get('wilayah'),
    potensi: formData.get('potensi'),
    pasar: formData.get('pasar'),
    fasilitasi: formData.get('fasilitasi')
  };
  Swal.fire({
    title: 'Menyimpan...',
    text: 'Sedang mengirim ke Google Sheets',
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading(); }
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    
    if (result.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Data pelaku berhasil ${isEdit ? 'diupdate' : 'disimpan'}.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      e.target.reset();
      document.getElementById('editId').value = '';
      document.getElementById('modalTitle').textContent = 'Tambah Pelaku Ekonomi Kreatif';
      document.getElementById('modal').classList.remove('active');
      
      await loadDataFromSheet();
      
    } else {
      Swal.fire('Gagal!', result.message, 'error');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error!', 'Terjadi kesalahan jaringan saat menyimpan.', 'error');
  }
});

// ==================== EXPORT CSV ====================
document.getElementById('btnExport').addEventListener('click', () => {
  const rows = [['ID','Nama','Subsektor','Wilayah','Potensi','Kapasitas Pasar','Fasilitasi']];
  filteredData.forEach(p => rows.push([p.id, p.nama, p.subsektor, p.wilayah, p.potensi, p.pasar, p.fasilitasi]));
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'data-pelaku-ekraf.csv';
  a.click();
  Swal.fire({
    icon: 'success',
    title: 'Export Berhasil',
    text: 'File CSV telah diunduh.',
    timer: 2000,
    showConfirmButton: false
  });
});

// ==================== GUARD: cegah resize loop ====================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    Object.values(charts).forEach(c => {
      try { c.resize(); } catch(e) {}
    });
  }, 200);
});

async function loadDataFromSheet() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    
    if (result.status === 'success') {
      // Timpa data lokal dengan data dari Sheets
      dataPelaku = result.data.map(item => ({
        id: item.id,
        nama: item.nama,
        subsektor: item.subsektor,
        wilayah: item.wilayah,
        potensi: Number(item.potensi),
        pasar: Number(item.pasar),
        fasilitasi: item.fasilitasi
      }));
      
      // 🔥 PERBAIKAN: Update semua tampilan setelah data masuk
      updateStatistics();      // Update Statistik Cards
      renderTable();           // Update Tabel
      renderSubsektor();       // Update Card 21 Subsektor
      
      // Jika sedang di halaman dashboard, render ulang chartnya
      if (document.getElementById('page-dashboard').classList.contains('active')) {
        renderDashboardCharts(); 
      }
      // Jika sedang di halaman peta, render ulang petanya
      if (document.getElementById('page-peta').classList.contains('active')) {
        renderPetaCharts();
      }
	  if (document.getElementById('page-analisis').classList.contains('active')) {
        renderAnalisis();
        renderChartKuadran();
      }
    }
  } catch (error) {
    console.error('Gagal memuat data dari Sheets:', error);
  }
}

// ==================== FITUR CETAK PDF ====================
document.getElementById('btnCetakPdf').addEventListener('click', () => {
  // 1. Isi tanggal cetak saat ini
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  document.getElementById('tglCetak').textContent = today;

  // 2. Tampilkan Loading SweetAlert
  Swal.fire({
    title: 'Menyiapkan PDF...',
    text: 'Mohon tunggu, laporan sedang dibuat.',
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading(); }
  });

  // 3. Ambil elemen yang akan dicetak
  const element = document.getElementById('areaLaporan');

  // 4. Tambahkan class 'pdf-mode' sementara
  element.classList.add('pdf-mode');

  // 5. Konfigurasi PDF
  const opt = {
    margin:       [10, 10, 10, 10], // Margin atas, kiri, bawah, kanan (mm)
    filename:     `Laporan_Ekraf_Brebes_${today.replace(/\s/g, '_')}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // 6. Proses konversi ke PDF
  html2pdf().set(opt).from(element).save().then(() => {
    // 7. Hapus class 'pdf-mode' agar tampilan web kembali gelap
    element.classList.remove('pdf-mode');
    
    // 8. Notifikasi Sukses
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Laporan PDF telah berhasil diunduh.',
      timer: 2500,
      showConfirmButton: false
    });
  }).catch((error) => {
    // Jika gagal, kembalikan tema gelap dan tampilkan error
    element.classList.remove('pdf-mode');
    console.error(error);
    Swal.fire('Gagal!', 'Terjadi kesalahan saat membuat PDF.', 'error');
  });
});

// ==================== RENDER CHART KUADRAN (BCG MATRIX) ====================
function renderChartKuadran() {
  destroyChart('kuadran');
  
  const ctx = document.getElementById('chartKuadran');
  if (!ctx) return;

  // Threshold pembagi kuadran (bisa diubah ke 60 atau rata-rata)
  const THRESHOLD = 60;

  // Kelompokkan data berdasarkan kuadran
  const kuadranData = {
    bintang: [], // Potensi > 60, Pasar > 60
    tanya: [],   // Potensi > 60, Pasar <= 60
    sapi: [],    // Potensi <= 60, Pasar > 60
    anjing: []   // Potensi <= 60, Pasar <= 60
  };

  dataPelaku.forEach(p => {
    const point = { x: Number(p.pasar), y: Number(p.potensi), nama: p.nama };
    if (p.potensi > THRESHOLD && p.pasar > THRESHOLD) kuadranData.bintang.push(point);
    else if (p.potensi > THRESHOLD && p.pasar <= THRESHOLD) kuadranData.tanya.push(point);
    else if (p.potensi <= THRESHOLD && p.pasar > THRESHOLD) kuadranData.sapi.push(point);
    else kuadranData.anjing.push(point);
  });

  // Warna: Bintang (Hijau), Tanya (Biru), Sapi (Kuning), Anjing (Merah)
  const colors = {
    bintang: { bg: 'rgba(16, 185, 129, 0.6)', border: '#10b981' },
    tanya:   { bg: 'rgba(99, 102, 241, 0.6)', border: '#6366f1' },
    sapi:    { bg: 'rgba(245, 158, 11, 0.6)', border: '#f59e0b' },
    anjing:  { bg: 'rgba(239, 68, 68, 0.6)',  border: '#ef4444' }
  };

  // Plugin kustom untuk menggambar garis kuadran di tengah
  const quadrantLinesPlugin = {
    id: 'quadrantLines',
    beforeDraw: (chart) => {
      const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;

      // Garis Vertikal (Sumbu X = 60)
      const xPos = x.getPixelForValue(THRESHOLD);
      ctx.beginPath(); ctx.moveTo(xPos, top); ctx.lineTo(xPos, bottom); ctx.stroke();

      // Garis Horizontal (Sumbu Y = 60)
      const yPos = y.getPixelForValue(THRESHOLD);
      ctx.beginPath(); ctx.moveTo(left, yPos); ctx.lineTo(right, yPos); ctx.stroke();

      // Label Kuadran
      ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.font = 'bold 14px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      
      ctx.fillText('TANYA (Potensi Tinggi, Pasar Rendah)', (left + xPos) / 2, top + 20);
      ctx.fillText('BINTANG (Potensi & Pasar Tinggi)', (xPos + right) / 2, top + 20);
      ctx.fillText('ANJING (Potensi & Pasar Rendah)', (left + xPos) / 2, bottom - 10);
      ctx.fillText('SAPI PERAH (Potensi Rendah, Pasar Tinggi)', (xPos + right) / 2, bottom - 10);

      ctx.restore();
    }
  };

  charts.kuadran = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Bintang ⭐',
          data: kuadranData.bintang,
          backgroundColor: colors.bintang.bg,
          borderColor: colors.bintang.border,
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Tanda Tanya ❓',
          data: kuadranData.tanya,
          backgroundColor: colors.tanya.bg,
          borderColor: colors.tanya.border,
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Sapi Perah 🐄',
          data: kuadranData.sapi,
          backgroundColor: colors.sapi.bg,
          borderColor: colors.sapi.border,
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Anjing 🐕',
          data: kuadranData.anjing,
          backgroundColor: colors.anjing.bg,
          borderColor: colors.anjing.border,
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: (context) => {
              const p = context.raw;
              return `${p.nama} (Pasar: ${p.x}, Potensi: ${p.y})`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Kapasitas Pasar', color: '#94a3b8', font: { weight: 'bold' } },
          min: 0, max: 100,
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148,163,184,0.08)' }
        },
        y: {
          title: { display: true, text: 'Potensi', color: '#94a3b8', font: { weight: 'bold' } },
          min: 0, max: 100,
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148,163,184,0.08)' }
        }
      }
    },
    plugins: [quadrantLinesPlugin]
  });
}

// ==================== SISTEM AUTENTIKASI ====================

function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('ekraf_logged_in');
  const loginScreen = document.getElementById('loginScreen');
  
  if (isLoggedIn === 'true') {
    loginScreen.classList.add('hidden');
  } else {
    loginScreen.classList.remove('hidden');
  }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userInput = document.getElementById('username').value.trim();
  const passInput = document.getElementById('password').value;
  const errorMsg = document.getElementById('loginError');
  const btnLogin = document.querySelector('.btn-login');
  
  btnLogin.innerHTML = 'Memverifikasi...';
  btnLogin.disabled = true;
  errorMsg.style.display = 'none';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ 
        action: 'login', 
        username: userInput, 
        password: passInput 
      })
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      const user = result.user;
      
      sessionStorage.setItem('ekraf_logged_in', 'true');
      sessionStorage.setItem('ekraf_user', user.username);
      sessionStorage.setItem('ekraf_nama', user.nama_lengkap);
      sessionStorage.setItem('ekraf_role', user.role);
      
      document.getElementById('loginScreen').classList.add('hidden');
      
      const userNameEl = document.querySelector('.sidebar-footer strong');
      const userRoleEl = document.querySelector('.sidebar-footer small');
      if (userNameEl) userNameEl.textContent = user.nama_lengkap;
      if (userRoleEl) userRoleEl.textContent = user.role;
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: `Selamat datang, ${user.nama_lengkap}.`,
        timer: 2000,
        showConfirmButton: false
      });
      initAppData();
    } else {
      errorMsg.textContent = result.message;
      errorMsg.style.display = 'block';
      document.getElementById('password').value = '';
      document.getElementById('password').focus();
    }
  } catch (error) {
    console.error(error);
    errorMsg.textContent = 'Gagal terhubung ke server. Cek koneksi internet.';
    errorMsg.style.display = 'block';
  } finally {
    btnLogin.innerHTML = `Masuk ke Sistem`;
    btnLogin.disabled = false;
  }
});

function initAppData() {
  loadDataFromSheet();
}

function logout() {
  Swal.fire({
    title: 'Logout?',
    text: "Anda akan keluar dari sistem.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.removeItem('ekraf_logged_in');
      sessionStorage.removeItem('ekraf_user');
      sessionStorage.removeItem('ekraf_nama'); 
      sessionStorage.removeItem('ekraf_role'); 
      location.reload();
    }
  });
}

// ==================== INIT ====================
function init() {
  checkAuth();
  
  populateFilters();
  //animateCounters();
  //renderDashboardCharts();
  //renderSubsektor();
  //renderTable();
  
  if (sessionStorage.getItem('ekraf_logged_in') === 'true') {
    const savedNama = sessionStorage.getItem('ekraf_nama');
    const savedRole = sessionStorage.getItem('ekraf_role');
    const userNameEl = document.querySelector('.sidebar-footer strong');
    const userRoleEl = document.querySelector('.sidebar-footer small');
    if (savedNama) userNameEl.textContent = savedNama;
    if (savedRole) userRoleEl.textContent = savedRole;
    loadDataFromSheet();
  }
  
}
init();