let pages = []; 
let currentPage = 0;
let isDoubleMode = true;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

async function handleFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    pages = []; 
    document.getElementById('viewerCanvas').innerHTML = "Sila tunggu, sedang memproses...";

    if (ext === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
            pages.push({type: 'pdf', num: i, doc: pdf});
        }
    } else {
        const zip = await JSZip.loadAsync(file);
        const files = Object.keys(zip.files)
            .filter(n => /\.(jpg|jpeg|png|webp)$/i.test(n))
            .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
        
        for (let name of files) {
            const blob = await zip.files[name].async("blob");
            pages.push(URL.createObjectURL(blob));
        }
    }
    currentPage = 0;
    renderViewer();
}

async function renderViewer() {
    const container = document.getElementById('viewerCanvas');
    container.innerHTML = '';
    
    if (isDoubleMode && currentPage > 0 && currentPage < pages.length - 1) {
        const row = document.createElement('div');
        row.className = 'double-page-row';
        row.appendChild(await createNode(currentPage));
        row.appendChild(await createNode(currentPage + 1));
        container.appendChild(row);
        document.getElementById('pageCounter').innerText = `P. ${currentPage + 1}-${currentPage + 2} / ${pages.length}`;
    } else {
        container.appendChild(await createNode(currentPage));
        document.getElementById('pageCounter').innerText = `P. ${currentPage + 1} / ${pages.length}`;
    }
}

async function createNode(index) {
    const data = pages[index];
    if (typeof data === 'string') {
        const img = document.createElement('img');
        img.src = data;
        img.className = 'manga-page';
        return img;
    } else {
        const canvas = document.createElement('canvas');
        const page = await data.doc.getPage(data.num);
        const viewport = page.getViewport({scale: 1.5});
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
        canvas.className = 'manga-page';
        return canvas;
    }
}

function changePage(step) {
    let move = (isDoubleMode && currentPage > 0) ? step * 2 : step;
    if (currentPage + move >= 0 && currentPage + move < pages.length) {
        currentPage += move;
        renderViewer();
        window.scrollTo(0,0);
    }
}

function toggleDouble() {
    isDoubleMode = !isDoubleMode;
    document.getElementById('modeBtn').innerText = isDoubleMode ? "2-PAGE" : "1-PAGE";
    renderViewer();
}
