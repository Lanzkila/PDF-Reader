const toolbar = `
    <div class="reader-footer">
        <button class="btn-nav" onclick="changePage(-1)">PREV</button>
        <div id="pageCounter">Page 0 / 0</div>
        <button class="btn-nav" onclick="changePage(1)">NEXT</button>
        
        <button class="btn-mode" id="doubleBtn" onclick="toggleDouble()">2-PAGE: ON</button>
        
        <button class="btn-mode" id="webtoonBtn" onclick="toggleWebtoon()">WEBTOON: OFF</button>
        
        <input type="file" id="fileInput" hidden onchange="handleFile(this.files[0])">
        <label for="fileInput" class="btn-upload">OPEN</label>
    </div>
`;

document.body.insertAdjacentHTML('beforeend', toolbar);
