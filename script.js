// --- Navigace (burger menu) ---
const burger = document.getElementById("burger");
const navMenu = document.getElementById("nav-menu");

burger.addEventListener("click", () => {
  navMenu.classList.toggle("nav-active");
});

// --- Dark/Light mód ---
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

// --- Modal ---
const modal = document.getElementById("preview-modal");
const modalImg = document.getElementById("img01");
const closeBtn = document.querySelector(".close");
const shareBtn = document.querySelector(".share-link");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentGallery = [];
let currentIndex = 0;

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', function () {
    modal.style.display = "flex";
    const galleryContainer = this.closest('.gallery-grid');
    currentGallery = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
    currentIndex = currentGallery.indexOf(this);
    updateModalImage();
    shareBtn.setAttribute("data-url", this.getAttribute("data-url"));
    if (!modal.classList.contains('opened')) {
      modalImg.classList.add('open-animation');
      modal.classList.add('opened');
    }
  });
});

function updateModalImage() {
  if (currentGallery.length > 0 && currentIndex >= 0 && currentIndex < currentGallery.length) {
    const newImgSrc = currentGallery[currentIndex].querySelector('img').src;
    modalImg.src = newImgSrc;
    shareBtn.setAttribute("data-url", currentGallery[currentIndex].getAttribute("data-url"));
  }
}

function changeImage(newIndex) {
  modalImg.classList.remove('open-animation');
  modalImg.classList.add('slide-out');

  modalImg.addEventListener('animationend', function handler() {
    currentIndex = newIndex;
    updateModalImage();
    modalImg.classList.remove('slide-out');
    modalImg.classList.add('slide-in');
    modalImg.addEventListener('animationend', function handler2() {
      modalImg.classList.remove('slide-in');
    }, { once: true });
    modalImg.removeEventListener('animationend', handler);
  }, { once: true });
}

nextBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  let newIndex = (currentIndex + 1) % currentGallery.length;
  changeImage(newIndex);
});

prevBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  let newIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  changeImage(newIndex);
});

document.addEventListener('keydown', function (e) {
  if (modal.style.display === "flex") {
    if (e.key === "ArrowRight") {
      let newIndex = (currentIndex + 1) % currentGallery.length;
      changeImage(newIndex);
    } else if (e.key === "ArrowLeft") {
      let newIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      changeImage(newIndex);
    } else if (e.key === "Escape") {
      modal.style.display = "none";
      modalImg.classList.remove('open-animation');
      modal.classList.remove('opened');
    }
  }
});

closeBtn.onclick = () => {
  modal.style.display = "none";
  modalImg.classList.remove('open-animation');
  modal.classList.remove('opened');
};

modal.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    modalImg.classList.remove('open-animation');
    modal.classList.remove('opened');
  }
};

shareBtn.onclick = function () {
  const link = this.getAttribute("data-url");
  navigator.clipboard.writeText(link);
  alert("Link copied: " + link);
};

// Zoom funkce
let isZoomed = false;
modalImg.addEventListener('click', function (e) {
  isZoomed = !isZoomed;
  modalImg.style.transition = 'transform 0.3s ease';
  modalImg.style.transform = isZoomed ? 'scale(2)' : 'scale(1)';
});

modalImg.addEventListener('mousemove', function (e) {
  if (!isZoomed) return;
  const rect = modalImg.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const xPercent = (x / rect.width) * 100;
  const yPercent = (y / rect.height) * 100;
  modalImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
});

modalImg.addEventListener('mouseleave', function () {
  if (isZoomed) {
    isZoomed = false;
    modalImg.style.transform = 'scale(1)';
  }
});
