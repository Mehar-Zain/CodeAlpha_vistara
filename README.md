# 📸 VISTARA — Professional Image Gallery

> **Explore • Discover • Inspire**

VISTARA is a modern, responsive, and professional image gallery built with **HTML, CSS, and JavaScript**, powered by the **Unsplash API**. It delivers a premium browsing experience with live image search, category filtering, infinite scrolling, favorites, lightbox viewing, and a clean user interface inspired by modern design principles.

Designed as part of my frontend development journey, VISTARA demonstrates advanced JavaScript concepts, REST API integration, asynchronous programming, responsive design, accessibility, and performance optimization.

---

## 🌐 Live Demo

**Live Website:** https://codealpha-vistara.netlify.app

**GitHub Repository:** https://github.com/Mehar-Zain/CodeAlpha_vistara


---

# 📖 Project Overview

VISTARA transforms static image galleries into a dynamic image discovery platform by integrating the **Unsplash API** through secure **Netlify Serverless Functions**.

Instead of storing images locally, the application retrieves high-quality photographs in real time while protecting the API key from public exposure.

The project focuses on:

* Modern UI/UX
* Clean architecture
* Responsive design
* Performance optimization
* Accessibility
* Secure API handling
* Real-world JavaScript practices

---

# ✨ Features

## 🎨 Modern Interface

* Premium dark theme
* Responsive layout
* Elegant typography
* Smooth animations
* Professional card design
* Beautiful hover effects
* Sticky navigation
* Mobile-first experience

---

## 🔍 Smart Image Search

* Real-time search
* Debounced API requests
* Instant results
* Live filtering
* Automatic result updates

---

## 🗂 Category Filtering

Browse images by category including:

* All
* Nature
* Travel
* Architecture
* Wildlife
* Favorites

Each category automatically fetches relevant images from the Unsplash API.

---

## ❤️ Favorites System

Users can:

* Save favorite images
* Remove favorites
* Persistent favorites using Local Storage
* View only favorite images
* Favorite counter

---

## 🖼 Interactive Lightbox

The gallery includes a professional fullscreen viewer featuring:

* Previous / Next navigation
* Keyboard controls
* Image details
* Photographer information
* Download
* Share
* Favorite toggle

---

## ♾ Infinite Scrolling

Images load automatically while scrolling without refreshing the page.

Features include:

* Lazy loading
* Pagination
* Duplicate prevention
* Request management
* Smooth user experience

---

## 📊 Live Statistics

Automatically updates:

* Total images
* Categories
* Search results
* Favorites

---

## 📱 Fully Responsive

Optimized for:

* Desktop
* Laptop
* Tablet
* Mobile

---

## ⚡ Performance Optimized

* Lazy loading
* Debounced search
* Modern JavaScript
* Efficient rendering
* Image loading animations
* Request cancellation handling

---

## ♿ Accessibility

* Keyboard navigation
* ARIA labels
* Semantic HTML
* Focus management
* Screen-reader friendly components

---

# 🛠 Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript (ES6+)

### API

* Unsplash API

### Backend

* Netlify Functions (Serverless)

### Deployment

* Netlify

### Version Control

* Git
* GitHub

---

# 📂 Project Structure

```text
VISTARA/
│
├── assets/
│
├── netlify/
│   └── functions/
│       └── unsplash.js
│
├── script.js
├── style.css
├── index.html
├── favicon.png
├── netlify.toml
└── README.md
```

---

# 🔒 Secure API Integration

To keep the Unsplash Access Key secure, this project **does not expose API credentials in the frontend**.

Instead:

```
Browser
      │
      ▼
Netlify Function
      │
      ▼
Unsplash API
```

Benefits:

* API key remains hidden
* Secure production deployment
* No client-side secrets
* Better architecture

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Mehar-Zain/CodeAlpha_vistara.git
```

---

## Navigate

```bash
cd CodeAlpha_vistara
```

---

## Install Netlify CLI

```bash
npm install -g netlify-cli
```

---

## Login

```bash
netlify login
```

---

## Run Development Server

```bash
netlify dev
```

Open:

```
http://localhost:8888
```

---

# 🌍 Deployment

Push changes to GitHub:

```bash
git add .
git commit -m "Update project"
git push origin main
```

Netlify automatically builds and deploys the latest version.

---

# 📷 Screenshots

Add screenshots here.

Example:

```
screenshots/
│
├── home.png
├── gallery.png
├── search.png
├── lightbox.png
└── mobile.png
```

---

# 🎯 Learning Outcomes

This project helped strengthen my understanding of:

* REST APIs
* Async/Await
* Fetch API
* Serverless Functions
* JavaScript Architecture
* Responsive Design
* Accessibility
* Local Storage
* DOM Manipulation
* Event Handling
* Lazy Loading
* Infinite Scroll
* Performance Optimization
* Git & GitHub
* Netlify Deployment

---

# 🔮 Future Improvements

* User authentication
* Collections
* Masonry layout
* AI-powered image recommendations
* Dark/Light themes
* Image upload support
* Multi-language support
* Offline caching (PWA)
* Advanced filters
* Image color search

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Mehar Zain**

Frontend Developer | BS Computer Science Student

* GitHub: https://github.com/Mehar-Zain
* LinkedIn: https://www.linkedin.com/in/mehar-zain-dev/
* Portfolio: https://mehar-zain-portfolio.netlify.app/

---

# 🙏 Acknowledgements

Special thanks to:

* Unsplash for providing a world-class photography API.
* Netlify for serverless functions and hosting.
* The open-source community for continuous inspiration.

---

# 📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and learn from this project.

---

⭐ **If you found this project useful, consider giving it a star on GitHub!**
