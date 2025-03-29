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
    "URL1", "URL2", "URL3", // zkráceno pro přehlednost
    "URL4", "URL5", "URL6", "URL7", "URL8", "URL9"
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

  // Touch swipe support (posun prstem)
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;

  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  slider.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const moveX = e.touches[0].clientX;
    const diff = moveX - startX;
    currentTranslate = prevTranslate + diff;
    slider.style.transition = "none";
    slider.style.transform = `translateX(${currentTranslate}px)`;
  });

  slider.addEventListener("touchend", () => {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50 && currentIndex < sliderItems.length - 1) {
      currentIndex++;
    } else if (movedBy > 50 && currentIndex > 0) {
      currentIndex--;
    }

    updateSlider();
    const activeItem = sliderItems[currentIndex];
    const containerWidth = sliderContainer.offsetWidth;
    const itemOffsetLeft = activeItem.offsetLeft;
    const itemWidth = activeItem.offsetWidth;
    prevTranslate = containerWidth / 2 - (itemOffsetLeft + itemWidth / 2);
  });

  // Keyboard + wheel ovládání
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

  // Kliknutí na jednotlivé bannery
  sliderItems.forEach((item, index) => {
    const link = item.querySelector('a');
    link.addEventListener('click', e => e.preventDefault());

    item.addEventListener('click', function (e) {
      if (index !== currentIndex) {
        e.preventDefault();
        currentIndex = index;
        updateSlider();
      }
    });
  });
});
