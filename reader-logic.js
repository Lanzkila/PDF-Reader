// 1. DEKLARASI GLOBAL (Nadi Utama)
window.pages = [];
window.currentPage = 0;
window.isDoubleMode = true;
window.isWebtoonMode = false;

// Setup Worker PDF (Wajib untuk PDF.js)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// 2. FUNGSI HANDLE FILE (ZIP/PDF)
window.handleFile = async function(file) {
    if (!file) return;
    const container = document.getElementById('viewerCanvas');
    container.innerHTML = `<div class="msg">Sedang memproses ${file.name}...</div>`;
    
    const ext = file.name.split('.').pop().toLowerCase();
    window.pages = []; 

    try {
        if (ext === 'pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            for (let i = 1; i <= pdf.numPages; i++) {
                window.pages.push({type: 'pdf', num: i, doc: pdf});
            }
        } else {
            const zip = await JSZip.loadAsync(file);
            const files = Object.keys(zip.files)
                .filter(n => /\.(jpg|jpeg|png|webp)$/i.test(n))
                .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
            
            for (let name of files) {
                const blob = await zip.files[name].async("blob");
                window.pages.push(URL.createObjectURL(blob));
            }
        }
        window.currentPage = 0;
        window.renderViewer();
    } catch (e) {
        container.innerHTML = `<div class="msg" style="color:red">Error: ${e.message}</div>`;
    }
};

// 3. LOGIK NAVIGASI & MOD
window.toggleDouble = function() {
    window.isWebtoonMode = false;
    window.isDoubleMode = !window.isDoubleMode;
    window.updateButtonLabels();
    window.renderViewer();
};

window.toggleWebtoon = function() {
    window.isWebtoonMode = !window.isWebtoonMode;
    if (window.isWebtoonMode) window.isDoubleMode = false;
    window.updateButtonLabels();
    window.renderViewer();
};

window.changePage = function(step) {
    if (window.isWebtoonMode) return; // Tak payah tukar page kalau skrol
    
    let move = (window.isDoubleMode && window.currentPage > 0) ? step * 2 : step;
    let next = window.currentPage + move;
    
    if (next >= 0 && next < window.pages.length) {
        window.currentPage = next;
        window.renderViewer();
        window.scrollTo(0, 0);
    }
};

window.updateButtonLabels = function() {
    const dBtn = document.getElementById('doubleBtn');
    const wBtn = document.getElementById('webtoonBtn');
    if(dBtn) dBtn.innerText = `2-PAGE: ${window.isDoubleMode ? 'ON' : 'OFF'}`;
    if(wBtn) wBtn.innerText = `WEBTOON: ${window.isWebtoonMode ? 'ON' : 'OFF'}`;
};

// 4. LOGIK RENDER (Paparan Utama)
window.renderViewer = async function() {
    const container = document.getElementById('viewerCanvas');
    if (!container) return;
    container.innerHTML = '';
    
    const navs = document.querySelectorAll('.btn-nav');
    navs.forEach(b => b.style.display = window.isWebtoonMode ? 'none' : 'inline-block');

if (window.isWebtoonMode) {
        // Render semua gambar (Mod Webtoon)
        for (let i = 0; i < window.pages.length; i++) {
            const pageNode = await window.createNode(i, "100%");
            pageNode.setAttribute('data-index', i + 1); // Simpan nombor page kat gambar
            container.appendChild(pageNode);
        }
        // Jalankan "mata" pemerhati (Observer)
        window.setupWebtoonObserver();
    } else {
        if (window.isDoubleMode && window.currentPage > 0 && window.currentPage < window.pages.length - 1) {
            const row = document.createElement('div');
            row.className = 'double-page-row';
            row.appendChild(await window.createNode(window.currentPage, "50%"));
            row.appendChild(await window.createNode(window.currentPage + 1, "50%"));
            container.appendChild(row);
            document.getElementById('pageCounter').innerText = `P. ${window.currentPage + 1}-${window.currentPage + 2} / ${window.pages.length}`;
        } else {
            container.appendChild(await window.createNode(window.currentPage, "auto"));
            document.getElementById('pageCounter').innerText = `P. ${window.currentPage + 1} / ${window.pages.length}`;
        }
    }
};

window.setupWebtoonObserver = function() {
    const options = {
        root: null,
        threshold: 0.3 // Gambar nampak 30% baru dia kira "page tu"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageIndex = entry.target.getAttribute('data-index');
                document.getElementById('pageCounter').innerText = `P. ${pageIndex} / ${window.pages.length}`;
                // Update currentPage supaya kalau user switch mode, dia tak melompat ke page lain
                window.currentPage = parseInt(pageIndex) - 1;
            }
        });
    }, options);

    // Suruh observer perhati semua gambar manga
    document.querySelectorAll('.manga-page').forEach(img => observer.observe(img));
};

// 5. PEMBINA ELEMENT (IMG/CANVAS)
window.createNode = async function(index, width) {
    const data = window.pages[index];
    let el;
    if (typeof data === 'string') {
        el = document.createElement('img');
        el.src = data;
    } else {
        el = document.createElement('canvas');
        const page = await data.doc.getPage(data.num);
        const viewport = page.getViewport({scale: 1.5});
        el.height = viewport.height;
        el.width = viewport.width;
        await page.render({canvasContext: el.getContext('2d'), viewport}).promise;
    }
    el.className = 'manga-page';
    el.style.width = width;
    el.style.display = 'block';
    el.style.margin = '0 auto';
    return el;
};
