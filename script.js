const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

const videoModal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoPlayer");
const videoTriggers = document.querySelectorAll(".video-trigger");

function buildEmbedUrl(provider, videoId) {
  if (provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
  }

  return `https://drive.google.com/file/d/${videoId}/preview`;
}

function openVideo(trigger) {
  const provider = trigger.dataset.provider;
  const videoId = trigger.dataset.videoId;

  if (window.location.protocol === "file:" && provider === "youtube") {
    window.open(trigger.href, "_blank", "noopener");
    return;
  }

  videoPlayer.src = buildEmbedUrl(provider, videoId);
  videoModal.classList.add("open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeVideo() {
  videoModal.classList.remove("open");
  videoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  videoPlayer.src = "about:blank";
}

function startPreview(trigger) {
  const thumb = trigger.querySelector(".video-thumb");

  thumb?.classList.add("is-previewing");
}

function stopPreview(trigger) {
  const thumb = trigger.querySelector(".video-thumb");

  thumb?.classList.remove("is-previewing");
}

videoTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    stopPreview(trigger);
    openVideo(trigger);
  });

  trigger.addEventListener("mouseenter", () => startPreview(trigger));
  trigger.addEventListener("mouseleave", () => stopPreview(trigger));
  trigger.addEventListener("focus", () => startPreview(trigger));
  trigger.addEventListener("blur", () => stopPreview(trigger));
});

document.querySelectorAll("[data-close-video]").forEach((element) => {
  element.addEventListener("click", closeVideo);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoModal.classList.contains("open")) {
    closeVideo();
  }
});
