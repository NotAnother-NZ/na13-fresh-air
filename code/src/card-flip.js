const flipCards = document.querySelectorAll(
  "[data-slider-flip].vocabulary-card"
);
if (flipCards.length === 0) {
  console.warn("No vocabulary-card elements with data-slider-flip found.");
} else {
  console.log("vocabulary-card elements found.");
}

flipCards.forEach((card, index) => {
  const frontContent = card.querySelector('[data-slider-flip-slide="1"]');
  const backContent = card.querySelector('[data-slider-flip-slide="2"]');
  const tagElement = card.querySelector(".vocabulary-tag");

  if (!frontContent || !backContent || !tagElement) {
    console.warn(
      `Vocabulary card at index ${index} is missing required elements.`
    );
    return;
  }

  const swiperContainer = document.createElement("div");
  swiperContainer.classList.add("swiper-container");
  swiperContainer.style.width = "100%";
  swiperContainer.style.height = "100%";

  const swiperWrapper = document.createElement("div");
  swiperWrapper.classList.add("swiper-wrapper");

  const createSlide = (contentHTML) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide", "vocabulary-card");
    slide.style.width = "100%";
    slide.style.height = "100%";
    slide.style.display = "flex";
    slide.style.flexDirection = "column";
    slide.style.alignItems = "center";
    slide.style.justifyContent = "center";
    slide.innerHTML = contentHTML;
    return slide;
  };

  const tagHTML = tagElement.outerHTML;

  const frontSlide = createSlide(frontContent.outerHTML + tagHTML);
  frontSlide.style.backgroundColor = "var(--swatches--beige)";

  const backSlide = createSlide(backContent.outerHTML + tagHTML);

  let usedColors = [];
  const allColors = [
    "var(--swatches--brown)",
    "var(--swatches--green)",
    "var(--swatches--orange)",
    "var(--swatches--purple)",
    "var(--swatches--yellow)",
    "var(--swatches--blue)",
  ];

  // Define color categories
  const offWhiteColors = [
    "var(--swatches--brown)",
    "var(--swatches--green)",
    "var(--swatches--orange)",
    "var(--swatches--blue)",
  ];
  const blackColors = ["var(--swatches--purple)", "var(--swatches--yellow)"];

  // Function to update text color based on background color
  const updateTextColor = (slide, bgColor) => {
    const textElements = slide.querySelectorAll(".body1-1, .title5-1");
    if (offWhiteColors.includes(bgColor)) {
      textElements.forEach(
        (el) => (el.style.color = "var(--swatches--off-white)")
      );
    } else if (blackColors.includes(bgColor)) {
      textElements.forEach((el) => (el.style.color = "var(--swatches--black)"));
    } else {
      // Default text color if needed
      textElements.forEach((el) => (el.style.color = "inherit"));
    }
  };

  // Initialize backSlide background color and text color
  backSlide.style.backgroundColor = "var(--swatches--yellow)";
  updateTextColor(backSlide, "var(--swatches--yellow)");

  swiperWrapper.appendChild(frontSlide);
  swiperWrapper.appendChild(backSlide);

  swiperContainer.appendChild(swiperWrapper);

  card.innerHTML = "";
  card.appendChild(swiperContainer);
  card.classList.add("no-padding");

  const flipSwiper = new Swiper(swiperContainer, {
    effect: "flip",
    loop: true,
    grabCursor: false,
    allowTouchMove: false,
    speed: 600,
    slidesPerView: 1,
    centeredSlides: true,
    flipEffect: {
      slideShadows: false,
      limitRotation: true,
    },
    on: {
      init: function () {
        console.log(`Swiper initialized for card index ${index}`);
      },
      slideChange: function () {
        console.log(`Slide changed for card index ${index}`);
      },
    },
  });

  swiperContainer.addEventListener("click", () => {
    if (flipSwiper.realIndex === 0) {
      const availableColors = allColors.filter(
        (color) => !usedColors.includes(color)
      );
      const randomColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      backSlide.style.backgroundColor = randomColor;

      // Update text color based on new background color
      updateTextColor(backSlide, randomColor);

      // Update the used colors list
      usedColors.push(randomColor);
      if (usedColors.length >= allColors.length) {
        usedColors = []; // Reset once all colors are used
      }
    }
    flipSwiper.slideNext();
  });

  swiperContainer.style.cursor = "pointer";
});
