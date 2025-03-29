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
    "https://cdn.discordapp.com/attachments/795569982079238174/1355531897534550127/bg2024berlin_1.gif?ex=67e944f4&is=67e7f374&hm=dafa3ba0f9952f0b5643ebfa47e871315fdbfcab10cf7fb5e53f2f73d409554b&",
    "https://cdn.discordapp.com/attachments/795569982079238174/1355533744601038939/HOUBARENI_1.gif?ex=67e946ad&is=67e7f52d&hm=7084f2b2112b3dab2e0b9110141f321220854c18107b89e10477b9a0f499d670&",
    "https://cdn.discordapp.com/attachments/795569982079238174/1355531954950246540/MATURITA_2.gif?ex=67e94502&is=67e7f382&hm=104bef935ba9a929cc92956da1d376c14884f191fbfc93fa9849a1f076b243c0&",
    "https://cdn.discordapp.com/attachments/795569982079238174/1355525340025585664/prematurita_1.gif?ex=67e93ed9&is=67e7ed59&hm=98e74bfff4f273fc3d527ec7c7add6499f9f72918a115c0c170d6dd546d28e5a&",
    "https://cdn.discordapp.com/attachments/795569982079238174/1355526208170885191/bgprasazu-ezgif.com-resize.gif?ex=67e93fa8&is=67e7ee28&hm=9bd0b53c94e84f3e6593207861b8618dbdd2e35cb4a6e9097a996ab8933cbb2e&",
    "https://cdn.discordapp.com/attachments/795569982079238174/1355525099910074510/vhsplesfootage.gif?ex=67e93ea0&is=67e7ed20&hm=1b36a7b0887a9cee4ec10487c65da194b8c730aeb87ba1615029cbe69dc25bb3&",
    "https://cdn.discordapp.com/attachments/795569982079238174/1355530572205789332/budapest1.gif?ex=67e943b8&is=67e7f238&hm=aaede06f88dafbd4e06e3c0c41aad1dc86eb16be621c6e97de504eb8fd009d5f&",
    "https://cdn.discordapp.com/attachments/795569982079238174/1355525438784405554/CASINO.gif?ex=67e93ef1&is=67e7ed71&hm=298bb7bdf44dfb01332920860ddb08d8d3bf3ad47f790c201925a66f59ad031b&",
    "https://cdn.discordapp.com/attachments/795569982079238174/1355528141476466778/kevinperygolarge.gif?ex=67e94175&is=67e7eff5&hm=696a2be82b12a40a5d0097716d850acab4b4ce33f1cfc61fafd9453148e07407&"
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
