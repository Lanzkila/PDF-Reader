// ui-elements.js
const footerHTML = `
<div class="reader-footer">
    <button class="btn-nav" onclick="changePage(-1)">PREV</button>
    <span id="pageCounter">P. 0 / 0</span>
    <button class="btn-nav" onclick="changePage(1)">NEXT</button>
    
    <button id="doubleBtn" class="btn-mode" onclick="toggleDouble()">2-PAGE: ON</button>
    <button id="webtoonBtn" class="btn-mode" onclick="toggleWebtoon()">WEBTOON: OFF</button>
    
    <input type="file" id="filePicker" onchange="handleFile(this.files[0])" hidden>
    <button class="btn-upload" onclick="document.getElementById('filePicker').click()">OPEN</button>
</div>
`;

// Masukkan menu ni kat bawah sekali dalam body
document.body.insertAdjacentHTML('beforeend', footerHTML);
