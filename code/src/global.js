(function ($) {
  "use strict";

  /**
   * Initializes Lenis smooth scrolling and sets up global scroll control functions.
   */
  function initializeLenis() {
    if (typeof Lenis === "undefined") {
      setTimeout(initializeLenis, 50); // Retry initialization after 50ms if Lenis isn't loaded
      return;
    }

    $(document).ready(function () {
      // Initialize Lenis instance
      const lenis = new Lenis({
        duration: 1.15,
        lerp: 1,
        orientation: "vertical",
        gestureOrientation: "vertical",
        normalizeWheel: true,
        ease: "easeInOutQuad",
        wheelMultiplier: 0.85,
        smoothTouch: true,
        syncTouch: true,
        syncTouchLerp: 0,
        touchInertiaMultiplier: 10,
        touchMultiplier: 0,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Global scroll control functions
      window.disableScroll = function () {
        lenis.stop();
        $("body").addClass("no-scroll");
      };

      window.enableScroll = function () {
        lenis.start();
        $("body").removeClass("no-scroll");
      };

      // Attach Lenis to the global scope for external use
      window.lenis = lenis;

      // Function to safely call lenis.resize
      function triggerLenisResize() {
        if (typeof lenis !== "undefined") {
          lenis.resize();
        }
      }

      // ResizeObserver for size changes on the body
      const resizeObserver = new ResizeObserver(() => {
        triggerLenisResize();
      });
      resizeObserver.observe(document.body); // Observe size changes on the body

      // MutationObserver for DOM changes
      const mutationObserver = new MutationObserver(() => {
        triggerLenisResize();
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      }); // Observe DOM changes

      // Window resize event listener
      window.addEventListener("resize", () => {
        triggerLenisResize();
      });

      // Cleanup function (optional, in case you need to stop observing dynamically)
      function cleanupObservers() {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
        window.removeEventListener("resize", triggerLenisResize);
      }

      // Uncomment below if you ever need to stop the observers dynamically
      // cleanupObservers();

      // Add dark overlay to the page on load
      const overlay = $(
        '<div id="dark-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:400;opacity:0;pointer-events:none;transition:opacity 0.3s ease;"></div>'
      );
      $("body").append(overlay);

      // Toggle scroll control on #nav-menu-button click
      let isScrollDisabled = false;

      $("#nav-menu-button").on("click", function () {
        if (isScrollDisabled) {
          window.enableScroll();
          $("#nav").removeClass("nav-active");
          $("#dark-overlay").css({ opacity: 0, pointerEvents: "none" });
        } else {
          window.disableScroll();
          $("#nav").addClass("nav-active");
          $("#dark-overlay").css({ opacity: 0.5, pointerEvents: "auto" });
        }
        isScrollDisabled = !isScrollDisabled;
      });

      // Close mobile menu when a link inside .mobile-nav-link-group is clicked
      $(".mobile-nav-link-group a").on("click", function () {
        $("#nav-menu-button")[0].click();
      });

      // Close menu if user clicks on the overlay
      $("#dark-overlay").on("click", function () {
        if (isScrollDisabled) {
          $("#nav-menu-button")[0].click();
        }
      });
    });
  }

  // Initialize Lenis
  initializeLenis();
})(jQuery);
