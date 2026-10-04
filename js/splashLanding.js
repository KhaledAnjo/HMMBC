// =====================================================================
// splashLanding.js
// 1) يشغّل الـ Splash Screen ويخفيه تلقائياً بعد مدة قصيرة
// 2) يعرض الـ Landing Page ويستقبل اختيار المستخدم لنوع المبنى
// =====================================================================

const SPLASH_DURATION_MS = 900;

export function runSplashScreen() {
  const splashEl = document.getElementById("splash-screen");
  const landingEl = document.getElementById("landing");

  setTimeout(() => {
    splashEl.classList.add("splash-fade-out");
    landingEl.classList.remove("hidden");
    landingEl.classList.add("landing-fade-in");

    setTimeout(() => {
      splashEl.remove();
    }, 500);
  }, SPLASH_DURATION_MS);
}

export function initLandingCards(onBuildingTypeSelected) {
  const cards = document.querySelectorAll(".building-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const buildingType = card.dataset.buildingType;

      cards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");

      onBuildingTypeSelected(buildingType);

      const wizardRoot = document.getElementById("wizard-root");
      wizardRoot.classList.remove("hidden");
      wizardRoot.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}