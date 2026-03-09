const toolbar = `
<div class="pdf-container">
    <div class="pdf-toolbar">
        <button class="pdf-btn" id="prev-page">PREV</button>
        <div class="page-info">
            PAGE <span id="page-num">1</span> / <span id="page-count">0</span>
        </div>
        <button class="pdf-btn" id="next-page">NEXT</button>
        <button class="btn-mode" id="doubleBtn" onclick="toggleDouble()">2-PAGE: ON</button>
        <button class="btn-mode" id="webtoonBtn" onclick="toggleWebtoon()">WEBTOON: OFF</button>
        <input type="file" id="fileInput" hidden onchange="handleFile(this.files[0])">
        <label for="fileInput" class="btn-upload">OPEN</label>
        
</div>
`;

document.body.insertAdjacentHTML('beforeend', toolbar);
