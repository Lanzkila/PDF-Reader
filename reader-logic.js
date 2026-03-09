let isDoubleMode = true;
let isWebtoonMode = false;

// Fungsi Asal Kau (Kekal)
function toggleDouble() {
    isWebtoonMode = false; // Tutup webtoon kalau buka double
    isDoubleMode = !isDoubleMode;
    updateButtonLabels();
    renderViewer();
}

// Fungsi Baru: Webtoon
function toggleWebtoon() {
    isWebtoonMode = !isWebtoonMode;
    if (isWebtoonMode) isDoubleMode = false; // Tutup double kalau buka webtoon
    updateButtonLabels();
    renderViewer();
}

function updateButtonLabels() {
    document.getElementById('doubleBtn').innerText = `2-PAGE: ${isDoubleMode ? 'ON' : 'OFF'}`;
    document.getElementById('webtoonBtn').innerText = `WEBTOON: ${isWebtoonMode ? 'ON' : 'OFF'}`;
}

async function renderViewer() {
    const container = document.getElementById('viewerCanvas');
    container.innerHTML = '';
    
    // Sembunyi butang Nav kalau Webtoon
    const navs = document.querySelectorAll('.btn-nav');
    navs.forEach(b => b.style.display = isWebtoonMode ? 'none' : 'inline-block');

    if (isWebtoonMode) {
        // Render semua gambar ke bawah
        for (let i = 0; i < pages.length; i++) {
            container.appendChild(await createNode(i, "100%"));
        }
        document.getElementById('pageCounter').innerText = `Webtoon (${pages.length} Pages)`;
    } else {
        // Logik Single/Double asal kau
        if (isDoubleMode && currentPage > 0 && currentPage < pages.length - 1) {
            const row = document.createElement('div');
            row.className = 'double-page-row';
            row.appendChild(await createNode(currentPage, "50%"));
            row.appendChild(await createNode(currentPage + 1, "50%"));
            container.appendChild(row);
            document.getElementById('pageCounter').innerText = `P. ${currentPage + 1}-${currentPage + 2} / ${pages.length}`;
        } else {
            container.appendChild(await createNode(currentPage, "auto"));
            document.getElementById('pageCounter').innerText = `P. ${currentPage + 1} / ${pages.length}`;
        }
    }
}

// Update fungsi createNode sikit untuk terima width
async function createNode(index, width) {
    const data = pages[index];
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
    return el;
}
