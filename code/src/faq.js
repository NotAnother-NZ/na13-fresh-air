$(document).ready(function () {
  // Define the breakpoint for desktop vs. mobile
  const DESKTOP_BREAKPOINT = 768; // in pixels
  let isDesktop = $(window).width() >= DESKTOP_BREAKPOINT;

  /**
   * Initialize all FAQ groups.
   * - Close all FAQs by default.
   * - Open FAQs with data-faq-open-default="true".
   */
  function initializeAllFAQGroups() {
    $(".faq-slot").each(function () {
      initializeFAQGroup($(this));
    });
  }

  /**
   * Initialize a single FAQ group.
   * @param {jQuery} $faqSlot - The .faq-slot element containing the FAQ sets.
   */
  function initializeFAQGroup($faqSlot) {
    $faqSlot.find(".faq-set").each(function () {
      const $faqSet = $(this);
      const $faqAnswer = $faqSet.find(".faq-answer");
      const $faqQuestion = $faqSet.find(".faq-question");
      const $dropdownIcon = $faqSet.find(".faq-dropdown-icon");
      const shouldOpen =
        $faqSet.data("faq-open-default") === true ||
        $faqSet.data("faq-open-default") === "true";

      if (shouldOpen) {
        // Open this FAQ
        $faqSet.addClass("active");
        $faqAnswer.show(); // Show without animation on load
        $dropdownIcon.addClass("opened");
        // Set ARIA attributes for accessibility
        $faqQuestion.attr("aria-expanded", "true");
        $faqAnswer.attr("aria-hidden", "false");
      } else {
        // Ensure it's closed
        $faqSet.removeClass("active");
        $faqAnswer.hide();
        $dropdownIcon.removeClass("opened");
        // Set ARIA attributes for accessibility
        $faqQuestion.attr("aria-expanded", "false");
        $faqAnswer.attr("aria-hidden", "true");
      }
    });
  }

  /**
   * Event handler for clicking on a FAQ question.
   * Behavior changes based on device type (desktop/mobile).
   */
  function handleFAQClick() {
    $(".faq-question").on("click", function () {
      const $clickedFaqSet = $(this).closest(".faq-set");
      const $faqSlot = $clickedFaqSet.closest(".faq-slot");
      const isActive = $clickedFaqSet.hasClass("active");

      if (isDesktop) {
        // Desktop Behavior: Only one open at a time within the same .faq-slot
        if (!isActive) {
          // Close all FAQs within the same .faq-slot
          $faqSlot
            .find(".faq-set")
            .removeClass("active")
            .find(".faq-answer")
            .slideUp(300);
          $faqSlot.find(".faq-dropdown-icon").removeClass("opened");
          $faqSlot.find(".faq-question").attr("aria-expanded", "false");
          $faqSlot.find(".faq-answer").attr("aria-hidden", "true");

          // Open the clicked FAQ
          $clickedFaqSet.addClass("active").find(".faq-answer").slideDown(300);
          $clickedFaqSet.find(".faq-dropdown-icon").addClass("opened");
          $clickedFaqSet.find(".faq-question").attr("aria-expanded", "true");
          $clickedFaqSet.find(".faq-answer").attr("aria-hidden", "false");
        } else {
          // If already active, close it
          $clickedFaqSet.removeClass("active").find(".faq-answer").slideUp(300);
          $clickedFaqSet.find(".faq-dropdown-icon").removeClass("opened");
          $clickedFaqSet.find(".faq-question").attr("aria-expanded", "false");
          $clickedFaqSet.find(".faq-answer").attr("aria-hidden", "true");
        }
      } else {
        // Mobile Behavior: Toggle the clicked FAQ without affecting others
        if (!isActive) {
          // Open the clicked FAQ
          $clickedFaqSet.addClass("active");
          $clickedFaqSet.find(".faq-answer").slideDown(300);
          $clickedFaqSet.find(".faq-dropdown-icon").addClass("opened");
          $clickedFaqSet.find(".faq-question").attr("aria-expanded", "true");
          $clickedFaqSet.find(".faq-answer").attr("aria-hidden", "false");
        } else {
          // Close the clicked FAQ
          $clickedFaqSet.removeClass("active");
          $clickedFaqSet.find(".faq-answer").slideUp(300);
          $clickedFaqSet.find(".faq-dropdown-icon").removeClass("opened");
          $clickedFaqSet.find(".faq-question").attr("aria-expanded", "false");
          $clickedFaqSet.find(".faq-answer").attr("aria-hidden", "true");
        }
      }
    });
  }

  /**
   * Adjust FAQs when switching between desktop and mobile views.
   * - On switching to desktop: Ensure only one FAQ is open per .faq-slot.
   * - On switching to mobile: Maintain current open FAQs.
   */
  function adjustFAQsOnResize() {
    $(".faq-slot").each(function () {
      const $faqSlot = $(this);

      if (isDesktop) {
        // On Desktop: Ensure only one FAQ is open per .faq-slot
        const $activeFaqSets = $faqSlot.find(".faq-set.active");
        if ($activeFaqSets.length > 1) {
          // Keep the first open and close the rest
          $activeFaqSets.each(function (index) {
            if (index !== 0) {
              $(this).removeClass("active");
              $(this).find(".faq-answer").slideUp(300);
              $(this).find(".faq-dropdown-icon").removeClass("opened");
              $(this).find(".faq-question").attr("aria-expanded", "false");
              $(this).find(".faq-answer").attr("aria-hidden", "true");
            } else {
              // Ensure ARIA attributes are correctly set
              $(this).find(".faq-question").attr("aria-expanded", "true");
              $(this).find(".faq-answer").attr("aria-hidden", "false");
            }
          });
        }
      }
      // No action needed when switching to mobile
    });
  }

  /**
   * Debounce function to limit the rate at which a function can fire.
   * Useful for handling resize events efficiently.
   * @param {Function} func - The function to debounce.
   * @param {number} wait - The delay in milliseconds.
   * @returns {Function}
   */
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  /**
   * Initialize ARIA attributes and initial states based on device type.
   */
  function initializeARIAAttributes() {
    $(".faq-set").each(function () {
      const $faqSet = $(this);
      const $faqQuestion = $faqSet.find(".faq-question");
      const $faqAnswer = $faqSet.find(".faq-answer");

      if ($faqSet.hasClass("active")) {
        $faqQuestion.attr("aria-expanded", "true");
        $faqAnswer.attr("aria-hidden", "false");
      } else {
        $faqQuestion.attr("aria-expanded", "false");
        $faqAnswer.attr("aria-hidden", "true");
      }
    });
  }

  // Initialize all FAQ groups on page load
  initializeAllFAQGroups();

  // Set initial ARIA attributes
  initializeARIAAttributes();

  // Attach click event handlers
  handleFAQClick();

  // Handle window resize events with debounce
  $(window).on(
    "resize",
    debounce(function () {
      const wasDesktop = isDesktop;
      isDesktop = $(window).width() >= DESKTOP_BREAKPOINT;

      if (isDesktop !== wasDesktop) {
        adjustFAQsOnResize();
      }
    }, 250) // Adjust the debounce delay as needed
  );
});
