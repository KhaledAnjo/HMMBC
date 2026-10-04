import { initLanguageToggle, consumeJustSwitchedLangFlag } from "./i18n.js";
import { runSplashScreen, initLandingCards } from "./splashLanding.js";
import { runScrollWizard } from "./wizard/scrollWizard.js";
import { loadProjectState } from "./projectStorage.js";
import { initDynamicBackground } from "./dynamicBackground.js";

document.addEventListener("DOMContentLoaded", () => {
  initDynamicBackground();
  initLanguageToggle();

  const savedState = loadProjectState();
  const wizardRoot = document.getElementById("wizard-root");
  const justSwitchedLang = consumeJustSwitchedLangFlag();

  // نكمل تلقائياً على المشروع المحفوظ فقط إذا:
  // 1) في مشروع محفوظ فعلاً وفيه نوع مبنى محدد (يعني المستخدم بدأ فعلياً)
  // 2) والمستخدم إما رجع من تبديل لغة، أو وافق صراحة على المتابعة
  const hasRealProject = savedState && savedState.buildingType;

  if (hasRealProject) {
    const shouldResume =
      justSwitchedLang ||
      confirm(
        localStorage.getItem("hm2bc_lang") === "en"
          ? "There's a saved project. Continue with it?"
          : "في مشروع محفوظ من قبل. بدك تكمل عليه؟"
      );
    if (shouldResume) {
      document.getElementById("splash-screen")?.remove();
      document.getElementById("landing")?.remove();
      wizardRoot.classList.remove("hidden");
      runScrollWizard(wizardRoot, savedState.buildingType, savedState);
      return;
    }
  }

  runSplashScreen();
  initLandingCards((buildingType) => {
    runScrollWizard(wizardRoot, buildingType);
  });
});