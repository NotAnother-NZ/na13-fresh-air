function updateSubnavPosition() {
  var nav = document.getElementById("nav");
  var subnav = document.getElementById("subnav");
  if (nav && subnav) {
    subnav.style.top = nav.offsetHeight + "px";
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function waitForLenis(callback) {
  if (typeof lenis !== "undefined") {
    callback();
  } else {
    setTimeout(function () {
      waitForLenis(callback);
    }, 50);
  }
}

function processSectionElements() {
  var elements = document.querySelectorAll('[data-section-subnav="true"]');
  var subnav = document.getElementById("subnav");
  var nav = document.getElementById("nav");
  if (!subnav || !nav) return;

  subnav.innerHTML = "";
  var navOffset = nav.offsetHeight;
  var currentScroll = window.scrollY;

  elements.forEach(function (el) {
    var sectionName = el.getAttribute("data-section-name");
    if (sectionName) {
      var slug = slugify(sectionName);
      el.id = slug;
      var scrollValue =
        el.getBoundingClientRect().top + currentScroll - navOffset;

      var link = document.createElement("a");
      link.href = "#" + slug;
      link.className = "subnav-link w-inline-block";
      link.setAttribute("data-scroll-to", scrollValue);
      link.setAttribute("data-section-id", slug);

      var textDiv = document.createElement("div");
      textDiv.className = "body2-2";
      textDiv.textContent = sectionName;

      link.appendChild(textDiv);
      subnav.appendChild(link);
    }
  });

  attachScrollEvents();
}

function attachScrollEvents() {
  var subnavLinks = document.querySelectorAll(".subnav-link");
  subnavLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var scrollToValue = parseFloat(this.getAttribute("data-scroll-to"));
      var targetId = this.getAttribute("data-section-id");
      if (targetId && !isNaN(scrollToValue)) {
        waitForLenis(function () {
          lenis.scrollTo(scrollToValue);
          history.pushState(null, null, "#" + targetId);
        });
      }
    });
    link.addEventListener("mouseover", function () {
      this.removeAttribute("href");
    });
    link.addEventListener("mouseout", function () {
      this.setAttribute("href", "#" + this.getAttribute("data-section-id"));
    });
  });
}

function scrollToHashOnLoad() {
  var hash = window.location.hash.substring(1);
  if (hash) {
    var targetSection = document.getElementById(hash);
    var matchingLink = document.querySelector(
      '.subnav-link[data-section-id="' + hash + '"]'
    );
    if (targetSection && matchingLink) {
      var scrollToValue = parseFloat(
        matchingLink.getAttribute("data-scroll-to")
      );
      if (!isNaN(scrollToValue)) {
        waitForLenis(function () {
          setTimeout(function () {
            lenis.scrollTo(scrollToValue);
          }, 100);
        });
      }
    }
  }
}

function updateEverything() {
  updateSubnavPosition();
  processSectionElements();
  scrollToHashOnLoad();
}

window.addEventListener("load", function () {
  requestAnimationFrame(updateEverything);
});

window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    updateEverything();
  }, 200);
});
