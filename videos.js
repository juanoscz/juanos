document.addEventListener('DOMContentLoaded', function () {
  document.body.tabIndex = 0;
  document.body.focus();

  const slider = document.querySelector('.slider');
  const sliderItems = document.querySelectorAll('.slider-item');
  const sliderContainer = document.querySelector('.slider-container');
  let currentIndex = 0;

  const activeDefaultScale = 1.2;
  const inactiveDefaultScale = 0.9;
  const activeHoldScale = 1.4;

  const years = ["2025", "2025", "2024", "2024", "2024", "2024", "2023", "2023", "2022"];
  const titles = [
    "CITY of BERLIN",
    "KEN KRASOŇ",
    "MATURITNI VLOG",
    "PReMATURITA",
    "PRA.SA.ZU",
    "VHS PLES FOOTAGE",
    "ŠUNKA BUDAPEST TRIP",
    "REPORTÁŽ ZÁVISLOST",
    "KLUB SRÁČŮ"
  ];
  const backgrounds = [
    "captures/BG/bg2024berlin.gif",
    "captures/BG/HOUBARENI.gif",
    "captures/BG/MATURITA.gif",
    "captures/BG/prematurita.gif",
    "captures/BG/bgprasazu.gif",
    "captures/BG/vhsplesfootage.gif",
    "captures/BG/budapest.gif",
    "captures/BG/CASINO.gif",
    "captures/BG/kevinperygolarge.gif"
  ];

  function updateZIndices() {
    const total = sliderItems.length;
    sliderItems.forEach((item, i) => {
      item.style.zIndex = total - i;
    });
    sliderItems[currentIndex].style.zIndex = total + 100;
  }

  function updateSlider(animate = true) {
    sliderItems.forEach((item, i) => {
      item.classList.remove('active');
      item.style.transform = (i === currentIndex)
        ? `scale(${activeDefaultScale})`
        : `scale(${inactiveDefaultScale})`;
    });
    sliderItems[currentIndex].classList.add('active');

    const containerWidth = sliderContainer.offsetWidth;
    const activeItem = sliderItems[currentIndex];
    const itemOffsetLeft = activeItem.offsetLeft;
    const itemWidth = activeItem.offsetWidth;
    const translateX = containerWidth / 2 - (itemOffsetLeft + itemWidth / 2);

    slider.style.transition = animate ? 'transform 1.1s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none';
    slider.style.transform = `translateX(${translateX}px)`;

    document.body.style.backgroundImage = `url(${backgrounds[currentIndex]})`;

    const yearDisplay = document.getElementById("year-display");
    if (yearDisplay) yearDisplay.textContent = years[currentIndex];

    const titleDisplay = document.getElementById("title-display");
    if (titleDisplay) titleDisplay.textContent = titles[currentIndex];

    updateZIndices();
  }

  updateSlider(false);

  const holdIndicator = document.createElement('div');
  holdIndicator.classList.add('hold-indicator');
  document.body.appendChild(holdIndicator);

  let holdTimeout = null;
  let currentTiltHandler = null;

  function openLink(link) {
    window.open(link, '_blank');
  }

  function cancelHold(item) {
    clearTimeout(holdTimeout);
    holdIndicator.classList.remove('fill');
    holdIndicator.style.transform = 'translate(-50%, -50%) scale(0)';
    if (currentTiltHandler) {
      item.removeEventListener('mousemove', currentTiltHandler);
      currentTiltHandler = null;
    }
    item.style.transition = 'transform 0.5s ease';
    item.style.transform = item.classList.contains('active')
      ? `scale(${activeDefaultScale})`
      : `scale(${inactiveDefaultScale})`;
  }

  function addTiltEffect(item) {
    const tiltHandler = function (e) {
      const rect = item.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (offsetX - centerX) / centerX;
      const deltaY = (offsetY - centerY) / centerY;
      const maxTilt = 5;
      const tiltX = maxTilt * deltaY;
      const tiltY = -maxTilt * deltaX;
      item.style.transform = `scale(${activeHoldScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };
    currentTiltHandler = tiltHandler;
    item.addEventListener('mousemove', tiltHandler);
  }

  let wheelLock = false;
  sliderContainer.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (wheelLock) return;
    wheelLock = true;
    if (e.deltaY > 0 && currentIndex < sliderItems.length - 1) currentIndex++;
    else if (e.deltaY < 0 && currentIndex > 0) currentIndex--;
    updateSlider();
    setTimeout(() => { wheelLock = false; }, 500);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === "ArrowRight" && currentIndex < sliderItems.length - 1) {
      currentIndex++;
      updateSlider();
    } else if (e.key === "ArrowLeft" && currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  sliderItems.forEach((item, index) => {
    const link = item.querySelector('a');
    link.addEventListener('click', e => e.preventDefault());

    item.addEventListener('mousedown', e => {
      if (e.button === 0 && index === currentIndex) {
        e.preventDefault();
        item.style.transition = 'transform 1s cubic-bezier(0.2, 1.0, 0.2, 1)';
        item.style.transform = `scale(${activeHoldScale})`;
        addTiltEffect(item);
        holdTimeout = setTimeout(() => openLink(link.href), 1000);
      }
    });

    item.addEventListener('mouseup', () => cancelHold(item));
    item.addEventListener('mouseleave', () => cancelHold(item));

    item.addEventListener('click', function (e) {
      if (index !== currentIndex) {
        e.preventDefault();
        currentIndex = index;
        updateSlider();
      }
    });
  });

  // --- Burger menu + Dark/Light toggle ---
  const burger = document.getElementById("burger");
  const navMenu = document.getElementById("nav-menu");

  if (burger && navMenu) {
    burger.addEventListener("click", () => {
      navMenu.classList.toggle("nav-active");
    });
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });
  }
});
