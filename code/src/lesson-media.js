if (window.LogRocket && !window.__logrocketInitialized) {
  window.__logrocketInitialized = true;
  LogRocket.init("luu2kj/fresh-air", {
    mergeIframes: true,
    childDomains: ["*"],
  });
}
let isOverlayOpen = false;
let savedScrollPosition = 0;
const fullscreenDiv = document.createElement("div");
fullscreenDiv.id = "fullscreen-overlay";
fullscreenDiv.style.position = "fixed";
fullscreenDiv.style.left = "0";
fullscreenDiv.style.bottom = "-100%";
fullscreenDiv.style.width = "100%";
fullscreenDiv.style.height = "100%";
fullscreenDiv.style.backgroundColor = "rgba(0,0,0,0.75)";
fullscreenDiv.style.zIndex = "9999";
fullscreenDiv.style.transition = "bottom 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
fullscreenDiv.style.display = "flex";
fullscreenDiv.style.alignItems = "center";
fullscreenDiv.style.justifyContent = "center";
fullscreenDiv.style.pointerEvents = "none";
document.body.appendChild(fullscreenDiv);
function createCloseButton() {
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.style.position = "absolute";
  closeButton.style.top = "20px";
  closeButton.style.right = "20px";
  closeButton.style.background = "rgba(0,0,0,0.6)";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.padding = "10px 15px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "24px";
  closeButton.style.borderRadius = "50%";
  closeButton.style.display = "none";
  closeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    closeOverlay();
  });
  fullscreenDiv.appendChild(closeButton);
  return closeButton;
}
const closeButton = createCloseButton();
function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t + b;
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
}
function animateDiv(open = true, callback) {
  let start = null;
  const duration = 500;
  const startPosition = open ? -100 : 0;
  const endPosition = open ? 0 : -100;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const newPosition = easeInOutCubic(
      progress,
      startPosition,
      endPosition - startPosition,
      duration
    );
    fullscreenDiv.style.bottom = newPosition + "%";
    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      fullscreenDiv.style.bottom = endPosition + "%";
      isOverlayOpen = open;
      fullscreenDiv.style.pointerEvents = open ? "auto" : "none";
      closeButton.style.display = open ? "block" : "none";
      if (callback) setTimeout(callback, 100);
    }
  }
  window.requestAnimationFrame(step);
}
function clearFullscreenDiv() {
  fullscreenDiv.innerHTML = "";
  fullscreenDiv.appendChild(closeButton);
}
function extractYouTubeID(url) {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
function closeOverlay() {
  if (isOverlayOpen) {
    animateDiv(false);
    setTimeout(() => {
      enableScroll();
      window.scrollTo(0, savedScrollPosition);
      clearFullscreenDiv();
    }, 500);
  }
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isOverlayOpen && !document.fullscreenElement) {
    closeOverlay();
  }
});
function addMediaContent(mediaUrl) {
  clearFullscreenDiv();
  const isMobile = window.innerWidth <= 768;
  const mediaContainer = document.createElement("div");
  mediaContainer.style.position = "relative";
  mediaContainer.style.width = isMobile ? "90%" : "70%";
  mediaContainer.style.maxWidth = isMobile ? "90%" : "70%";
  mediaContainer.style.aspectRatio = "16 / 9";
  fullscreenDiv.appendChild(mediaContainer);
  if (mediaUrl.includes("canva.com")) {
    const iframe = document.createElement("iframe");
    iframe.src = mediaUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.backgroundColor = "var(--swatches--off-white)";
    iframe.setAttribute("tabindex", "-1");
    iframe.addEventListener("load", () => {
      iframe.style.backgroundColor = "transparent";
    });
    mediaContainer.appendChild(iframe);
    const fullscreenButton = document.createElement("button");
    fullscreenButton.innerHTML = "⛶";
    fullscreenButton.style.position = "absolute";
    fullscreenButton.style.top = "10px";
    fullscreenButton.style.left = "10px";
    fullscreenButton.style.background = "rgba(0,0,0,0.6)";
    fullscreenButton.style.color = "white";
    fullscreenButton.style.border = "none";
    fullscreenButton.style.padding = "12px";
    fullscreenButton.style.cursor = "pointer";
    fullscreenButton.style.fontSize = "20px";
    fullscreenButton.style.borderRadius = "4px";
    fullscreenButton.style.display = "none";
    fullscreenButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    });
    mediaContainer.appendChild(fullscreenButton);
    animateDiv(true, () => {
      if (!isMobile) {
        fullscreenButton.style.display = "block";
      }
    });
  } else if (
    mediaUrl.includes("youtu.be") ||
    mediaUrl.includes("youtube.com")
  ) {
    const videoId = extractYouTubeID(mediaUrl);
    if (!videoId) return;
    const iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube.com/embed/" +
      videoId +
      "?autoplay=1&controls=1&modestbranding=1&showinfo=0&rel=0";
    iframe.allow = "fullscreen";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.backgroundColor = "var(--swatches--black)";
    iframe.setAttribute("tabindex", "-1");
    iframe.addEventListener("load", () => {
      iframe.style.backgroundColor = "transparent";
    });
    mediaContainer.appendChild(iframe);
  }
}
function disableScroll() {
  document.body.style.overflow = "hidden";
}
function enableScroll() {
  document.body.style.overflow = "";
}
const mediaWrappers = document.querySelectorAll(".lesson-media-wrapper");
mediaWrappers.forEach((wrapper) => {
  wrapper.addEventListener("click", (event) => {
    event.preventDefault();
    savedScrollPosition = window.pageYOffset;
    const mediaUrl = wrapper
      .querySelector("[data-lesson-media-url]")
      .getAttribute("data-lesson-media-url");
    if (mediaUrl) {
      addMediaContent(mediaUrl);
      disableScroll();
      animateDiv(true);
    }
  });
});
fullscreenDiv.addEventListener("click", (event) => {
  if (event.target === fullscreenDiv) {
    closeOverlay();
  }
});
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    window.scrollTo(0, savedScrollPosition);
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const mediaWrappers = document.querySelectorAll(".lesson-media-wrapper");
  mediaWrappers.forEach((wrapper) => {
    const mediaUrlElement = wrapper.querySelector("[data-lesson-media-url]");
    if (mediaUrlElement) {
      const mediaUrl = mediaUrlElement.getAttribute("data-lesson-media-url");
      if (
        mediaUrl &&
        (mediaUrl.includes("youtu.be") || mediaUrl.includes("youtube.com"))
      ) {
        const videoId = extractYouTubeID(mediaUrl);
        if (videoId) {
          const thumbnailUrl =
            "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg";
          const srcset =
            "https://img.youtube.com/vi/" +
            videoId +
            "/mqdefault.jpg 320w, https://img.youtube.com/vi/" +
            videoId +
            "/hqdefault.jpg 480w, https://img.youtube.com/vi/" +
            videoId +
            "/sddefault.jpg 640w, https://img.youtube.com/vi/" +
            videoId +
            "/maxresdefault.jpg 1280w";
          const thumbImage = wrapper.querySelector(
            "img.lesson-media-thumbnail"
          );
          if (thumbImage) {
            thumbImage.src = thumbnailUrl;
            thumbImage.srcset = srcset;
          }
        }
      }
    }
  });
});
