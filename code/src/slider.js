// Ensure that jQuery is loaded before this script
$(document).ready(function () {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  // Helper function to convert CSS units to pixels
  function toPixels(valueString) {
    const val = valueString.trim();

    if (val.endsWith("rem") || val.endsWith("em")) {
      return parseFloat(val) * rootFontSize;
    } else if (val.endsWith("px")) {
      return parseFloat(val);
    } else {
      // If just a number or no suffix, parse as float
      return parseFloat(val) || 0;
    }
  }

  // Function to adjust the heights of .resources-card-content elements
  function adjustContentHeights() {
    // **Excluding .resources-card elements with the .type2 class**
    document.querySelectorAll(".resources-card:not(.type2)").forEach((card) => {
      // Select the image within the current card
      const image = card.querySelector(".resources-card-image");

      // Select the content element within the current card
      const content = card.querySelector(".resources-card-content");

      if (image && content) {
        // Get the outer height of the card (includes padding and border)
        const cardHeight = card.offsetHeight;

        // Get the outer height of the image (includes padding and border)
        const imageHeight = image.offsetHeight;

        // Calculate the new height for the content
        const newContentHeight = cardHeight - imageHeight;

        // Set the new height in pixels
        content.style.height = `${newContentHeight}px`;

        // Optional: Log the heights for debugging
        console.log(`Adjusted Content Height: ${newContentHeight}px for`, card);
      } else {
        console.warn(
          "Missing .resources-card-image or .resources-card-content in a .resources-card."
        );
      }
    });
  }

  // Store all Swiper instances and original HTML for each slider
  const sliders = [];

  $("[data-convert-slider]").each(function (index) {
    const $this = $(this);

    // Read attributes from the HTML
    const targetSelector =
      $this.attr("data-convert-slider") || ".resources-card";
    const slidesPerView =
      parseFloat($this.attr("data-convert-slider-items-per-view")) || 3.3;

    const prevButtonSelector = $this.attr("data-convert-slider-prev");
    const nextButtonSelector = $this.attr("data-convert-slider-next");

    const gapValue = $this.attr("data-convert-slider-gap") || "0.75rem";
    const marginValue = $this.attr("data-convert-slider-margin") || "4rem";

    const spaceBetweenPx = toPixels(gapValue);
    const paddingPx = toPixels(marginValue);

    // Collect cards (the “items”)
    const $cards = $this.find(targetSelector);

    // Optional: If not enough cards, hide navigation and skip
    if ($cards.length <= slidesPerView) {
      if (prevButtonSelector) $(prevButtonSelector).hide();
      if (nextButtonSelector) $(nextButtonSelector).hide();
      console.log("Not enough cards to form a slider. Bailing out.");
      return;
    }

    // Preserve the original HTML structure
    const originalHTML = $this.html();

    // Initialize Swiper instance variable
    let swiperInstance = null;

    // Function to initialize Swiper
    function initSwiper() {
      if (swiperInstance !== null) return; // already initialized

      // Modify the DOM: add 'swiper-slide' and wrap in 'swiper-wrapper'
      $this.find(targetSelector).each(function () {
        $(this).addClass("swiper-slide");
      });
      $this.wrapInner('<div class="swiper-wrapper"></div>');

      // Add 'swiper-container' class
      $this.addClass(`swiper-container swiper-container-${index}`);

      // Initialize Swiper
      swiperInstance = new Swiper(`.swiper-container-${index}`, {
        slidesPerView: slidesPerView,
        spaceBetween: spaceBetweenPx,
        slidesOffsetBefore: paddingPx,
        slidesOffsetAfter: paddingPx,
        navigation: {
          nextEl: nextButtonSelector,
          prevEl: prevButtonSelector,
        },
        loop: false,
        breakpoints: {
          1024: {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetweenPx,
          },
        },
        on: {
          slideChange: function () {
            if (swiperInstance.isBeginning) {
              $(prevButtonSelector).css({
                opacity: 0.5,
                "pointer-events": "none",
              });
            } else {
              $(prevButtonSelector).css({
                opacity: 1,
                "pointer-events": "auto",
              });
            }

            if (swiperInstance.isEnd) {
              $(nextButtonSelector).css({
                opacity: 0.5,
                "pointer-events": "none",
              });
            } else {
              $(nextButtonSelector).css({
                opacity: 1,
                "pointer-events": "auto",
              });
            }
          },
          reachEnd: function () {
            $(nextButtonSelector).css({
              opacity: 0.5,
              "pointer-events": "none",
            });
          },
          reachBeginning: function () {
            $(prevButtonSelector).css({
              opacity: 0.5,
              "pointer-events": "none",
            });
          },
        },
      });

      // Set initial button states
      if (swiperInstance.isBeginning && prevButtonSelector) {
        $(prevButtonSelector).css({ opacity: 0.5, "pointer-events": "none" });
      }
      if (swiperInstance.isEnd && nextButtonSelector) {
        $(nextButtonSelector).css({ opacity: 0.5, "pointer-events": "none" });
      }

      // Optional “grab” cursor
      $this.css("cursor", "grab");
      $this.on("mousedown touchstart", function () {
        $(this).css("cursor", "grabbing");
      });
      $this.on("mouseup mouseleave touchend", function () {
        $(this).css("cursor", "grab");
      });

      // Show navigation buttons
      if (prevButtonSelector) $(prevButtonSelector).show();
      if (nextButtonSelector) $(nextButtonSelector).show();

      // **Adjust content heights after initializing Swiper**
      adjustContentHeights();
    }

    // Function to destroy Swiper and restore original HTML
    function destroySwiper() {
      if (swiperInstance !== null) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;

        // Remove 'swiper-container' classes
        $this.removeClass(`swiper-container swiper-container-${index}`);

        // Restore the original HTML structure
        $this.html(originalHTML);

        // Remove cursor styles
        $this.css("cursor", "");
        $this.off("mousedown touchstart mouseup mouseleave touchend");
      }

      // **Hide navigation buttons regardless of Swiper state**
      if (prevButtonSelector) $(prevButtonSelector).hide();
      if (nextButtonSelector) $(nextButtonSelector).hide();

      // **Adjust content heights after destroying Swiper**
      adjustContentHeights();
    }

    // Function to handle visibility and initialize/destroy Swiper
    function handleVisibility() {
      if (window.innerWidth >= 1024) {
        // Initialize Swiper if not already
        initSwiper();
      } else {
        // Destroy Swiper if initialized
        destroySwiper();
      }

      // **Adjust content heights after handling visibility**
      // (This ensures that even if Swiper wasn't initialized or destroyed, heights are adjusted)
      adjustContentHeights();
    }

    // Initial check
    handleVisibility();

    // Attach to window resize event with debounce for performance
    let resizeTimeout;
    $(window).on("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleVisibility, 250);
    });

    // Store slider info for potential future use
    sliders.push({
      $container: $this,
      swiperInstance: swiperInstance,
      initSwiper: initSwiper,
      destroySwiper: destroySwiper,
      originalHTML: originalHTML,
    });
  });

  // **Initial height adjustment in case there are no sliders to initialize**
  adjustContentHeights();
});
