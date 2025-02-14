$(document).ready(function () {
  $(".lesson-card").each(function () {
    let hoverBgColor = $(this).data("hover-bg-color");
    let hoverShapeColor = $(this).data("hover-shape-color");
    $(this).data("original-bg-color", $(this).css("background-color"));
    if (hoverBgColor) {
      let rootColorVariable = `--swatches--${hoverBgColor}`;
      let hoverBgComputed = getComputedStyle(document.documentElement)
        .getPropertyValue(rootColorVariable)
        .trim();
      $(this).data("hover-bg-computed", hoverBgComputed);
    }
    $(this)
      .find("svg .shape-hover-svg")
      .each(function () {
        $(this).data("original-fill", $(this).css("fill"));
        if (hoverBgColor) {
          $(this).data("hover-fill", `var(--swatches--${hoverBgColor})`);
        }
      });
    $(this)
      .find("[data-hover-text-color]")
      .each(function () {
        let hoverTextColor = $(this).data("hover-text-color");
        if (hoverTextColor) {
          let rootTextColorVariable = `--swatches--${hoverTextColor}`;
          let hoverTextComputed = getComputedStyle(document.documentElement)
            .getPropertyValue(rootTextColorVariable)
            .trim();
          $(this).data("original-color", $(this).css("color"));
          $(this).data("hover-color", hoverTextComputed);
        }
      });
    $(this)
      .find("[data-hover-border-color]")
      .each(function () {
        let hoverBorderColor = $(this).data("hover-border-color");
        if (hoverBorderColor) {
          let rootBorderColorVariable = `--swatches--${hoverBorderColor}`;
          let hoverBorderComputed = getComputedStyle(document.documentElement)
            .getPropertyValue(rootBorderColorVariable)
            .trim();
          let originalBorderColor = $(this).css("border-bottom-color");
          $(this).data("original-border-bottom-color", originalBorderColor);
          $(this).data("hover-border-bottom-color", hoverBorderComputed);
        }
      });
    let baseImage = $(this).find(".frame-image").not(".hover-color");
    let hoverImage = $(this).find(".frame-image.hover-color");
    if (baseImage.length > 0 && hoverImage.length > 0) {
      baseImage.data("original-src", baseImage.attr("src"));
      baseImage.data("original-srcset", baseImage.attr("srcset"));
      baseImage.data("original-bg", baseImage.css("background-color"));
      if (hoverShapeColor) {
        let rootShapeColor = `--swatches--${hoverShapeColor}`;
        let hoverShapeComputed = getComputedStyle(document.documentElement)
          .getPropertyValue(rootShapeColor)
          .trim();
        hoverImage.data("hover-bg", hoverShapeComputed);
        hoverImage.css("background-color", "transparent");
      }
      hoverImage.removeAttr("src");
      hoverImage.removeAttr("srcset");
      hoverImage.hide();
    }
  });
  $(".lesson-card").hover(
    function () {
      let hoverBgComputed = $(this).data("hover-bg-computed");
      if (hoverBgComputed) {
        $(this).css({
          "background-color": hoverBgComputed,
          transition: "background-color 200ms ease",
        });
      }
      $(this)
        .find("svg .shape-hover-svg")
        .each(function () {
          let hoverFill = $(this).data("hover-fill");
          if (hoverFill) {
            $(this).css({
              fill: hoverFill,
              transition: "fill 200ms ease",
            });
          }
        });
      let baseImage = $(this).find(".frame-image").not(".hover-color");
      let hoverImage = $(this).find(".frame-image.hover-color");
      if (baseImage.length > 0 && hoverImage.length > 0) {
        baseImage.hide();
        hoverImage.show();
        hoverImage.css("transition", "background-color 200ms ease");
        hoverImage.css("background-color", hoverImage.data("hover-bg"));
      }
      $(this)
        .find("[data-hover-text-color]")
        .each(function () {
          let hoverColor = $(this).data("hover-color");
          if (hoverColor) {
            $(this).css({
              color: hoverColor,
              transition: "color 200ms ease",
            });
          }
        });
      $(this)
        .find("[data-hover-border-color]")
        .each(function () {
          let hoverBorderColor = $(this).data("hover-border-bottom-color");
          if (hoverBorderColor) {
            $(this).css({
              "border-bottom-color": hoverBorderColor,
              transition: "border-bottom-color 200ms ease",
            });
          }
        });
    },
    function () {
      let originalBgColor = $(this).data("original-bg-color");
      if (originalBgColor) {
        $(this).css({
          "background-color": originalBgColor,
          transition: "background-color 0ms",
        });
      }
      $(this)
        .find("svg .shape-hover-svg")
        .each(function () {
          let originalFill = $(this).data("original-fill");
          if (originalFill) {
            $(this).css({
              fill: originalFill,
              transition: "fill 0ms",
            });
          }
        });
      let baseImage = $(this).find(".frame-image").not(".hover-color");
      let hoverImage = $(this).find(".frame-image.hover-color");
      if (baseImage.length > 0 && hoverImage.length > 0) {
        hoverImage.css("transition", "background-color 0ms");
        hoverImage.css("background-color", "transparent");
        hoverImage.hide();
        baseImage.show();
      }
      $(this)
        .find("[data-hover-text-color]")
        .each(function () {
          let originalColor = $(this).data("original-color");
          if (originalColor) {
            $(this).css({
              color: originalColor,
              transition: "color 0ms",
            });
          }
        });
      $(this)
        .find("[data-hover-border-color]")
        .each(function () {
          let originalBorderColor = $(this).data(
            "original-border-bottom-color"
          );
          if (originalBorderColor) {
            $(this).css({
              "border-bottom-color": originalBorderColor,
              transition: "border-bottom-color 0ms",
            });
          }
        });
    }
  );
});
