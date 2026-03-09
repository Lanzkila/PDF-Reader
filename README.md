# 📚 Manga Reader Pro v2
A high-performance, browser-based Manga/Comic reader designed to handle large **CBZ, ZIP, and PDF** files (up to 600MB+) with a modern Bento-style UI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)

## 🚀 Key Features
* **Large File Support**: Optimized memory management to process files over 600MB without crashing the browser.
* **Multi-Format**: Seamlessly read `.cbz`, `.zip`, and `.pdf` files.
* **Double Page Mode**: Smart rendering that shows two pages side-by-side on desktop, just like a real book.
* **Auto-Sorting**: Intelligent file sorting (1, 2, 10...) so pages are always in the correct order.
* **Privacy Focused**: Everything is processed locally in your browser. No files are uploaded to any server.

## 🛠️ Project Structure
The project is built using a modular architecture for better maintainability:
* `index.html` - The main entry point and app skeleton.
* `style.css` - Custom Bento/Cyberpunk dark theme.
* `ui-elements.js` - Dynamic UI components and toolbar injection.
* `reader-logic.js` - The core "engine" for file extraction and rendering.

## 📖 How to Use
1. **Open** the live website (GitHub Pages).
2. Click the **UPLOAD** or **OPEN** button.
3. Select your `.cbz` or `.pdf` manga file.
4. Use the **PREV/NEXT** buttons (or Arrow Keys) to navigate.
5. Toggle **2-PAGE** mode for a better desktop reading experience.

## ⚙️ Local Development
To run this project locally, simply clone the repository and open `index.html` in any modern web browser.
```bash
git clone [https://github.com/lanzkila/PDF-Reader.git](https://github.com/lanzkila/PDF-Reader.git)
