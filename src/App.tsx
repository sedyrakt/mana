
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Download,
  ChevronRight,
  CheckCircle2,
  Sun,
  Moon,
  Utensils,
  ChartNoAxesCombined,
  Activity,
  Search,
  History,
  Leaf,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Smartphone,
  ExternalLink,
  Share,
  PlusSquare,
  MonitorDown,
  CircleHelp,
  AlertTriangle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import "./App.css";

// ==========================================
// CONFIGURATION MANA
// ==========================================

const APP_NAME = "MANA";
const APP_VERSION = "1.0.0";

const BASE_URL = import.meta.env.BASE_URL;
const APK_PATH = `${BASE_URL}mana.apk`;

const PWA_URL = "https://sedyrakt.github.io/pwa-mana/";

type Theme = "light" | "dark";

type Platform = "android" | "ios" | "desktop" | "other";

type Device =
  | "iphone"
  | "ipad"
  | "android-phone"
  | "android-tablet"
  | "computer"
  | "other";

type Browser =
  | "safari"
  | "chrome"
  | "edge"
  | "firefox"
  | "opera"
  | "samsung"
  | "other";

const THEME_STORAGE_KEY = "mana-website-theme";

// ==========================================
// TYPES INSTALLATION PWA
// ==========================================

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type InstallState =
  | "available"
  | "installed"
  | "unavailable"
  | "installing";

// ==========================================
// DONNÉES NUTRITIONNELLES
// ==========================================

const nutrients = [
  {
    title: "Calories",
    value: "Kcal",
    description: "L'énergie apportée par les aliments.",
    color: "orange",
    icon: Flame,
  },
  {
    title: "Protéines",
    value: "g",
    description:
      "Essentielles au maintien et au développement musculaire.",
    color: "blue",
    icon: Dumbbell,
  },
  {
    title: "Glucides",
    value: "g",
    description:
      "Une source importante d'énergie pour l'organisme.",
    color: "yellow",
    icon: Wheat,
  },
  {
    title: "Lipides",
    value: "g",
    description:
      "Des nutriments indispensables au bon fonctionnement du corps.",
    color: "purple",
    icon: Droplets,
  },
];

// ==========================================
// FONCTIONNALITÉS
// ==========================================

const features = [
  {
    title: "Informations nutritionnelles",
    description:
      "Explorez la composition nutritionnelle de différents aliments et découvrez leurs apports énergétiques.",
    color: "green",
    icon: Utensils,
  },
  {
    title: "Analyse nutritionnelle",
    description:
      "Consultez les calories, protéines, glucides et lipides pour mieux comprendre la composition des aliments.",
    color: "blue",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Suivi nutritionnel",
    description:
      "Retrouvez vos données nutritionnelles et consultez votre historique au fil du temps.",
    color: "orange",
    icon: Activity,
  },
  {
    title: "Recherche alimentaire",
    description:
      "Recherchez facilement des aliments et accédez rapidement à leurs informations nutritionnelles.",
    color: "purple",
    icon: Search,
  },
  {
    title: "Historique des consultations",
    description:
      "Retrouvez les aliments et les informations nutritionnelles que vous avez consultés précédemment.",
    color: "pink",
    icon: History,
  },
  {
    title: "Équilibre alimentaire",
    description:
      "Mieux comprendre les nutriments pour faire des choix alimentaires plus éclairés au quotidien.",
    color: "teal",
    icon: Leaf,
  },
];

// ==========================================
// ÉTAPES D'INSTALLATION
// ==========================================

const steps = [
  {
    number: "01",
    title: "Ouvrez MANA",
    description:
      "Scannez le QR Code ou ouvrez le lien MANA depuis votre navigateur.",
  },
  {
    number: "02",
    title: "Sur Android",
    description:
      "Appuyez sur Installer MANA. Confirmez l'installation dans la fenêtre proposée par votre navigateur.",
  },
  {
    number: "03",
    title: "Sur iPhone",
    description:
      "Ouvrez MANA dans votre navigateur, appuyez sur Partager, puis Ajouter à l’écran d’accueil et Ajouter.",
  },
  {
    number: "04",
    title: "Découvrez MANA",
    description:
      "Lancez MANA depuis votre écran d'accueil et explorez les informations nutritionnelles.",
  },
];

// ==========================================
// DÉTECTION DU TYPE D'APPAREIL
// ==========================================

function detectDevice(): Device {
  const ua = navigator.userAgent || "";

  if (/iPhone/i.test(ua)) {
    return "iphone";
  }

  if (/iPad/i.test(ua)) {
    return "ipad";
  }

  if (
    /Macintosh/i.test(ua) &&
    navigator.maxTouchPoints > 1
  ) {
    return "ipad";
  }

  if (/Android/i.test(ua)) {
    if (/Mobile/i.test(ua)) {
      return "android-phone";
    }

    return "android-tablet";
  }

  if (
    /Windows NT|Macintosh|Mac OS X|Linux x86_64|X11|Linux i686/i.test(
      ua
    )
  ) {
    return "computer";
  }

  return "other";
}

// ==========================================
// DÉTECTION DE LA PLATEFORME
// ==========================================

function detectPlatform(): Platform {
  const device = detectDevice();

  if (device === "iphone" || device === "ipad") {
    return "ios";
  }

  if (
    device === "android-phone" ||
    device === "android-tablet"
  ) {
    return "android";
  }

  if (device === "computer") {
    return "desktop";
  }

  return "other";
}

// ==========================================
// DÉTECTION DU NAVIGATEUR
// ==========================================

function detectBrowser(): Browser {
  const ua = navigator.userAgent || "";

  if (/SamsungBrowser/i.test(ua)) {
    return "samsung";
  }

  if (/EdgiOS|EdgA|Edg\//i.test(ua)) {
    return "edge";
  }

  if (/OPiOS|OPR\/|Opera/i.test(ua)) {
    return "opera";
  }

  if (/FxiOS|Firefox/i.test(ua)) {
    return "firefox";
  }

  if (/CriOS|Chrome|Chromium/i.test(ua)) {
    return "chrome";
  }

  if (
    /Safari/i.test(ua) &&
    /AppleWebKit/i.test(ua)
  ) {
    return "safari";
  }

  return "other";
}

// ==========================================
// NOM DU NAVIGATEUR
// ==========================================

function getBrowserName(browser: Browser): string {
  const names: Record<Browser, string> = {
    safari: "Safari",
    chrome: "Google Chrome",
    edge: "Microsoft Edge",
    firefox: "Firefox",
    opera: "Opera",
    samsung: "Samsung Internet",
    other: "votre navigateur actuel",
  };

  return names[browser];
}

// ==========================================
// NOM DE L'APPAREIL
// ==========================================

function getDeviceName(device: Device): string {
  const names: Record<Device, string> = {
    iphone: "un iPhone",
    ipad: "un iPad",
    "android-phone": "un téléphone Android",
    "android-tablet": "une tablette Android",
    computer: "un ordinateur",
    other: "votre appareil",
  };

  return names[device];
}

// ==========================================
// TITRE D'INSTALLATION
// ==========================================

function getInstallTitle(device: Device): string {
  const titles: Record<Device, string> = {
    iphone: "Installer MANA sur iPhone",
    ipad: "Installer MANA sur iPad",
    "android-phone": "Installer MANA sur Android",
    "android-tablet": "Installer MANA sur tablette Android",
    computer: "Installer MANA sur ordinateur",
    other: "Installer MANA sur votre appareil",
  };

  return titles[device];
}

// ==========================================
// DÉTECTION APPLICATION INSTALLÉE
// ==========================================

function isPWAInstalled(): boolean {
  const standalone = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;

  const iosStandalone =
    "standalone" in navigator &&
    Boolean(
      (navigator as Navigator & {
        standalone?: boolean;
      }).standalone
    );

  return standalone || iosStandalone;
}

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================

function App() {
  // ========================================
  // SPLASH SCREEN LOADER
  // ========================================

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  const [device] = useState<Device>(() =>
    detectDevice()
  );

  const [platform] = useState<Platform>(() =>
    detectPlatform()
  );

  const [browser] = useState<Browser>(() =>
    detectBrowser()
  );

  const [isInstalled, setIsInstalled] = useState(() =>
    isPWAInstalled()
  );

  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [installState, setInstallState] =
    useState<InstallState>(() =>
      isPWAInstalled() ? "installed" : "unavailable"
    );

  const [showInstallHelp, setShowInstallHelp] =
    useState(false);

  const [installMessage, setInstallMessage] =
    useState("");

  // ========================================
  // MODE DARK / LIGHT
  // ========================================

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem(
        THEME_STORAGE_KEY
      );

      if (
        savedTheme === "dark" ||
        savedTheme === "light"
      ) {
        return savedTheme;
      }
    } catch (error) {
      console.warn("Erreur thème MANA :", error);
    }

    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-mana-theme",
      theme
    );

    try {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        theme
      );
    } catch (error) {
      console.warn(
        "Impossible de sauvegarder le thème :",
        error
      );
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  // ========================================
  // INSTALLATION PWA - ÉCOUTE NAVIGATEUR
  // ========================================

  useEffect(() => {
    let mounted = true;

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();

      const promptEvent =
        event as BeforeInstallPromptEvent;

      if (!mounted) return;

      setInstallPrompt(promptEvent);
      setInstallState("available");
    };

    const handleAppInstalled = () => {
      if (!mounted) return;

      setIsInstalled(true);
      setInstallState("installed");
      setInstallPrompt(null);
      setShowInstallHelp(false);

      setInstallMessage(
        "MANA a été installé avec succès !"
      );
    };

    const checkStandalone = () => {
      if (!mounted) return;

      if (isPWAInstalled()) {
        setIsInstalled(true);
        setInstallState("installed");
        setInstallPrompt(null);
      }
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    const standaloneQuery = window.matchMedia(
      "(display-mode: standalone)"
    );

    if (standaloneQuery.addEventListener) {
      standaloneQuery.addEventListener(
        "change",
        checkStandalone
      );
    } else {
      standaloneQuery.addListener(checkStandalone);
    }

    checkStandalone();

    return () => {
      mounted = false;

      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstall
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );

      if (standaloneQuery.removeEventListener) {
        standaloneQuery.removeEventListener(
          "change",
          checkStandalone
        );
      } else {
        standaloneQuery.removeListener(checkStandalone);
      }
    };
  }, []);

  // ========================================
  // INSTALLER MANA
  // ========================================

  const handleInstallPWA = async () => {
    if (isPWAInstalled() || isInstalled) {
      setIsInstalled(true);
      setInstallState("installed");

      setInstallMessage(
        "MANA est déjà installé sur cet appareil."
      );

      return;
    }

    if (platform === "ios") {
      setShowInstallHelp(true);
      setInstallMessage("");
      return;
    }

    if (installPrompt) {
      try {
        setInstallState("installing");

        await installPrompt.prompt();

        const choice = await installPrompt.userChoice;

        setInstallPrompt(null);

        if (choice.outcome === "accepted") {
          setInstallMessage(
            "Installation acceptée. Finalisez l'installation sur votre appareil."
          );
        } else {
          setInstallMessage(
            "Installation annulée. Vous pourrez réessayer quand vous le souhaitez."
          );
        }

        if (isPWAInstalled()) {
          setIsInstalled(true);
          setInstallState("installed");
        } else {
          setInstallState("unavailable");
        }
      } catch (error) {
        console.error(
          "Erreur installation PWA :",
          error
        );

        setInstallPrompt(null);
        setInstallState("unavailable");
        setShowInstallHelp(true);
        setInstallMessage("");
      }

      return;
    }

    setShowInstallHelp(true);
    setInstallMessage("");
  };

  // ========================================
  // OUVRIR MANA
  // ========================================

  const handleOpenPWA = () => {
    window.location.href = PWA_URL;
  };

  // ========================================
  // TÉLÉCHARGEMENT APK
  // ========================================

  const handleDownload = () => {
    const link = document.createElement("a");

    link.href = APK_PATH;
    link.download = "MANA.apk";
    link.rel = "noopener";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ========================================
  // MENU MOBILE
  // ========================================

  const closeMenu = () => setMenuOpen(false);

  const toggleMenu = () =>
    setMenuOpen((previous) => !previous);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [menuOpen]);

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [menuOpen]);

  // ========================================
  // NAVIGATION
  // ========================================

  const scrollTo = (id: string) => {
    const section = document.getElementById(id);

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    closeMenu();
  };

  // ========================================
  // BOUTON INSTALLATION DYNAMIQUE
  // ========================================

  const installButtonLabel = isInstalled
    ? "Ouvrir MANA"
    : installState === "installing"
      ? "Installation..."
      : "Installer MANA";

  const InstallButtonIcon = isInstalled
    ? CheckCircle2
    : Smartphone;

  const handleInstallButton = () => {
    if (isInstalled || isPWAInstalled()) {
      handleOpenPWA();
    } else {
      void handleInstallPWA();
    }
  };

  // ========================================
  // RENDU
  // ========================================

  return (
    <div
      className={`mana-site ${
        theme === "dark" ? "dark-mode" : "light-mode"
      }`}
    >
      {/* SPLASH SCREEN */}

      {isLoading && (
        <div
          className="mana-splash-screen"
          role="status"
          aria-live="polite"
          aria-label="Préparation de MANA"
        >
          <div className="mana-splash-content">
            <div className="mana-splash-logo-wrapper">
              <img
                src={`${BASE_URL}logo.png`}
                alt="MANA"
                className="mana-splash-logo"
              />
            </div>

            <h1 className="mana-splash-title">
              MANA
            </h1>

            <p className="mana-splash-description">
              Préparation de votre expérience nutritionnelle…
            </p>

            <div
              className="mana-splash-loader"
              aria-hidden="true"
            >
              <span />
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}

      <nav
        className="navbar"
        aria-label="Navigation principale"
      >
        <div className="nav-container">
          <a
            href="#accueil"
            className="brand"
            aria-label="MANA - Accueil"
            onClick={closeMenu}
          >
            <img
              src={`${BASE_URL}logobrand.png`}
              alt="Logo MANA"
              className="brand-logo"
            />
          </a>

          <div
            id="mana-navigation"
            className={`nav-links ${
              menuOpen ? "active" : ""
            }`}
          >
            <a href="#accueil" onClick={closeMenu}>
              Accueil
            </a>
            <a href="#application" onClick={closeMenu}>
              Application
            </a>
            <a href="#nutrition" onClick={closeMenu}>
              Nutrition
            </a>
            <a href="#fonctionnalites" onClick={closeMenu}>
              Fonctionnalités
            </a>
            <a href="#installation" onClick={closeMenu}>
              Installation
            </a>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Activer le mode sombre"
                : "Activer le mode clair"
            }
            aria-pressed={theme === "dark"}
          >
            {theme === "light" ? (
              <Moon size={19} />
            ) : (
              <Sun size={19} />
            )}

            <span className="theme-toggle-label">
              {theme === "light"
                ? "Mode sombre"
                : "Mode clair"}
            </span>
          </button>

          <button
            type="button"
            className="mobile-menu"
            aria-label={
              menuOpen
                ? "Fermer le menu"
                : "Ouvrir le menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mana-navigation"
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="nav-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* HERO */}

      <section className="hero" id="accueil">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-label">
              <span className="label-dot" />
              DÉCOUVREZ LA NUTRITION AUTREMENT
            </div>

            <h1>
              Découvrez la richesse
              <span>
                {" "}nutritionnelle des aliments.
              </span>
            </h1>

            <p className="hero-description">
              Explorez la richesse nutritionnelle des
              aliments et découvrez leurs apports pour
              mieux comprendre votre alimentation au
              quotidien.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="primary-button"
                onClick={handleDownload}
              >
                <Download size={19} />
                Télécharger MANA APK
              </button>

              <button
                type="button"
                className="secondary-button pwa-install-button"
                onClick={handleInstallButton}
                disabled={installState === "installing"}
              >
                <InstallButtonIcon size={19} />
                {installButtonLabel}
                {!isInstalled && (
                  <ExternalLink size={16} />
                )}
              </button>
            </div>

            {installMessage && (
              <p
                className="install-status-message"
                role="status"
              >
                {installMessage}
              </p>
            )}

            <div className="hero-trust">
              <div className="trust-item">
                <CheckCircle2 size={17} />
                Informations nutritionnelles
              </div>

              <div className="trust-item">
                <CheckCircle2 size={17} />
                Android & iPhone
              </div>
            </div>

            <div className="hero-nutrients">
              <div className="hero-nutrient">
                <span>Kcal</span>
              </div>
              <div className="hero-nutrient">
                <span>Protéines</span>
              </div>
              <div className="hero-nutrient">
                <span>Glucides</span>
              </div>
              <div className="hero-nutrient">
                <span>Lipides</span>
              </div>
            </div>
          </div>

          {/* VISUEL TÉLÉPHONE */}

          <div className="hero-visual">
            <div
              className="visual-glow"
              aria-hidden="true"
            />

            <div className="floating-card floating-card-top">
              <div>
                <strong>Nutrition équilibrée</strong>
                <span>
                  Comprendre votre alimentation
                </span>
              </div>
            </div>

            <div className="phone-frame">
              <div className="phone-notch" />

              <div className="phone-screen">
                <div className="phone-header">
                  <img
                    src={`${BASE_URL}logo.png`}
                    alt="MANA"
                  />
                  <span>MANA</span>
                </div>

                <div className="phone-welcome">
                  <span>BIENVENUE SUR MANA</span>
                  <h3>
                    Découvrez ce que contient votre
                    assiette.
                  </h3>
                </div>

                <div className="phone-food">
                  <img
                    src={`${BASE_URL}photo-food.jpg`}
                    alt="Aliments et produits alimentaires"
                    className="phone-food-image"
                  />

                  <div className="phone-food-overlay">
                    <span>Nutrition alimentaire</span>
                    <strong>
                      Une alimentation plus équilibrée.
                    </strong>
                  </div>
                </div>

                <div className="phone-stats">
                  <div>
                    <span>Énergie</span>
                    <strong>Kcal</strong>
                  </div>
                  <div>
                    <span>Protéines</span>
                    <strong>g</strong>
                  </div>
                </div>

                <div className="phone-bottom">
                  <span>Accueil</span>
                  <span>Recherche</span>
                  <span>Historique</span>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <div>
                <strong>Valeurs nutritionnelles</strong>
                <span>
                  Kcal · Protéines · Glucides · Lipides
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bottom-shape" />
      </section>

      {/* APPLICATION */}

      <section
        className="application-section section"
        id="application"
      >
        <div className="section-container">
          <div className="application-grid">
            <div className="application-visual">
              <div className="app-illustration">
                <div className="illustration-circle">
                  <img
                    src={`${BASE_URL}logo.png`}
                    alt="Logo MANA"
                    className="application-logo"
                  />
                </div>
              </div>
            </div>

            <div className="application-content">
              <span className="section-eyebrow">
                À PROPOS DE MANA
              </span>

              <h2>
                Comprenez mieux
                <span> ce que vous mangez.</span>
              </h2>

              <p>
                MANA est une application mobile dédiée à
                la nutrition alimentaire. Elle vous permet
                de découvrir les aliments et leur
                composition nutritionnelle.
              </p>

              <p>
                Consultez les informations nutritionnelles
                des aliments : calories (Kcal), protéines,
                glucides et lipides. Retrouvez également
                vos consultations précédentes grâce à
                l'historique intégré.
              </p>

              <div className="app-highlights">
                <div>
                  <CheckCircle2 />
                  <span>
                    Informations nutritionnelles détaillées
                  </span>
                </div>
                <div>
                  <CheckCircle2 />
                  <span>
                    Recherche simple des aliments
                  </span>
                </div>
                <div>
                  <CheckCircle2 />
                  <span>
                    Consultation de votre historique
                    nutritionnel
                  </span>
                </div>
                <div>
                  <CheckCircle2 />
                  <span>
                    Interface moderne et intuitive
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="text-button"
                onClick={() => scrollTo("fonctionnalites")}
              >
                Explorer les fonctionnalités
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NUTRITION */}

      <section
        className="nutrition-section section"
        id="nutrition"
      >
        <div className="section-container">
          <div className="section-heading">
            <span className="section-eyebrow">
              COMPOSITION NUTRITIONNELLE
            </span>

            <h2>
              Les 4 principaux nutriments
              <span> de vos aliments.</span>
            </h2>

            <p>
              Découvrez les principaux nutriments qui
              composent les aliments et leurs apports
              énergétiques.
            </p>
          </div>

          <div className="nutrients-grid">
            {nutrients.map((nutrient) => {
              const NutrientIcon = nutrient.icon;

              return (
                <article
                  className={`nutrient-card nutrient-${nutrient.color}`}
                  key={nutrient.title}
                >
                  <div className="nutrient-card-info">
                    <div className="nutrient-title-group">
                      <div className="nutrient-icon">
                        <NutrientIcon
                          size={21}
                          strokeWidth={2}
                        />
                      </div>
                      <h3>{nutrient.title}</h3>
                    </div>

                    <span className="nutrient-unit">
                      {nutrient.value}
                    </span>
                  </div>

                  <p>{nutrient.description}</p>
                </article>
              );
            })}
          </div>

          <div className="nutrition-note">
            <div>
              <strong>
                Comprendre la composition des aliments
              </strong>
              <p>
                Les valeurs nutritionnelles permettent de
                mieux connaître les apports énergétiques
                et nutritionnels des aliments. Elles
                peuvent varier selon les aliments et les
                portions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}

      <section
        className="features-section section"
        id="fonctionnalites"
      >
        <div className="section-container">
          <div className="section-heading">
            <span className="section-eyebrow">
              NOS FONCTIONNALITÉS
            </span>

            <h2>
              Tout pour mieux comprendre
              <span> votre alimentation.</span>
            </h2>

            <p>
              Découvrez les outils disponibles dans MANA
              pour explorer les aliments et leurs valeurs
              nutritionnelles.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;

              return (
                <article
                  className={`feature-card feature-${feature.color}`}
                  key={feature.title}
                >
                  <div className="feature-card-top">
                    <div className="feature-icon">
                      <FeatureIcon
                        size={25}
                        strokeWidth={1.8}
                      />
                    </div>

                    <span className="feature-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TÉLÉCHARGEMENT + QR CODE */}

      <section
        className="download-section section"
        id="telecharger"
      >
        <div className="section-container">
          <div className="download-box">
            <div className="download-content">
              <span className="download-eyebrow">
                DISPONIBLE SUR ANDROID & IPHONE
              </span>

              <h2>
                Découvrez MANA
                <span> dès maintenant.</span>
              </h2>

              <p>
                Téléchargez gratuitement l'application
                MANA sur Android ou accédez à sa version
                web installable sur Android et iPhone.
              </p>

              <div className="download-actions">
                <button
                  type="button"
                  className="download-main-button"
                  onClick={handleDownload}
                >
                  <Download size={21} />
                  Télécharger MANA APK
                </button>

                <button
                  type="button"
                  className="pwa-install-button"
                  onClick={handleInstallButton}
                  disabled={installState === "installing"}
                >
                  <InstallButtonIcon size={21} />
                  {installButtonLabel}
                </button>
              </div>

              <div className="download-meta">
                <span>Android APK</span>
                <span>PWA Android & iPhone</span>
                <span>Version {APP_VERSION}</span>
              </div>

              {installMessage && (
                <p
                  className="install-status-message"
                  role="status"
                >
                  {installMessage}
                </p>
              )}
            </div>

            {/* QR CODE */}

            <div className="qr-container">
              <div className="qr-card">
                <div className="qr-title">
                  <strong>
                    Accéder à MANA sur Android & iPhone
                  </strong>
                  <span>
                    Scannez ce QR Code pour ouvrir MANA
                  </span>
                </div>

                <div className="qr-code">
                  <QRCodeSVG
                    value={PWA_URL}
                    size={176}
                    level="H"
                    includeMargin
                    imageSettings={{
                      src: `${BASE_URL}logo.png`,
                      height: 35,
                      width: 35,
                      excavate: true,
                    }}
                  />
                </div>

                <p>
                  Scannez avec votre téléphone pour
                  accéder à la version web de MANA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GUIDE D'INSTALLATION */}

      <section
        className="installation-section section"
        id="installation"
      >
        <div className="section-container">
          <div className="section-heading">
            <span className="section-eyebrow">
              GUIDE D'INSTALLATION
            </span>

            <h2>
              Installez MANA en
              <span> quelques étapes.</span>
            </h2>

            <p>
              Suivez les étapes adaptées à votre appareil
              pour installer MANA sur Android ou iPhone.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <div
                className="step-card"
                key={step.number}
              >
                <div className="step-marker">
                  <span className="step-number">
                    {step.number}
                  </span>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>

          <div className="installation-notice">
            <div>
              <strong>Installation sur iPhone et iPad</strong>
              <p>
                Ouvrez le site MANA dans votre navigateur.
                Appuyez sur Partager, puis sur « Ajouter à
                l’écran d’accueil ». Vérifiez le nom MANA
                et appuyez sur « Ajouter ».
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="final-cta">
        <div className="final-cta-content">
          <h2>
            Découvrez la nutrition
            <span> avec MANA.</span>
          </h2>

          <p>
            Explorez les aliments, découvrez leurs valeurs
            nutritionnelles et comprenez leurs apports
            énergétiques au quotidien.
          </p>

          <div className="download-actions final-cta-actions">
            <button
              type="button"
              className="cta-button"
              onClick={handleDownload}
            >
              <Download size={19} />
              Télécharger MANA APK
            </button>

            <button
              type="button"
              className="pwa-install-button"
              onClick={handleInstallButton}
              disabled={installState === "installing"}
            >
              <InstallButtonIcon size={19} />
              {installButtonLabel}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="footer">
        <div className="section-container">
          <div className="footer-main">
            <div className="footer-brand">
              <a
                href="#accueil"
                className="brand"
                onClick={closeMenu}
                aria-label="MANA - Retour à l'accueil"
              >
                <img
                  src={`${BASE_URL}logobrand.png`}
                  alt="Logo MANA"
                  className="brand-logo"
                />
              </a>

              <p>
                Découvrez la richesse nutritionnelle des
                aliments pour mieux comprendre leurs
                apports énergétiques au quotidien.
              </p>
            </div>

            <div className="footer-column">
              <h4>Navigation</h4>
              <a href="#accueil">Accueil</a>
              <a href="#application">Application</a>
              <a href="#nutrition">Nutrition</a>
              <a href="#fonctionnalites">
                Fonctionnalités
              </a>
            </div>

            <div className="footer-column">
              <h4>Nutrition</h4>
              <a href="#nutrition">Calories (Kcal)</a>
              <a href="#nutrition">Protéines</a>
              <a href="#nutrition">Glucides</a>
              <a href="#nutrition">Lipides</a>
            </div>

            <div className="footer-column">
              <h4>Informations</h4>

              <a
                href={APK_PATH}
                download="MANA.apk"
              >
                Télécharger APK
              </a>

              <a
                href={PWA_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Installer MANA PWA
              </a>

              <a href="#installation">
                Installation
              </a>

              <span>Version {APP_VERSION}</span>
              <span>Android & iPhone</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {APP_NAME}.
              Tous droits réservés.
            </span>

            <a href="#accueil">
              Retour en haut ↑
            </a>
          </div>
        </div>
      </footer>

      {/* ======================================
          MODAL INSTALLATION PWA
      ====================================== */}

      {showInstallHelp && !isInstalled && (
        <div
          className="pwa-install-overlay"
          onClick={() => setShowInstallHelp(false)}
          role="presentation"
        >
          <div
            className="pwa-install-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="pwa-modal-close"
              onClick={() => setShowInstallHelp(false)}
              aria-label="Fermer"
            >
              <X size={22} />
            </button>

            <div className="pwa-modal-logo">
              <img
                src={`${BASE_URL}logobrand.png`}
                alt="Logo MANA"
                className="pwa-modal-logo-image"
              />
            </div>

            <span className="section-eyebrow">
              INSTALLATION DE MANA
            </span>

            <h2 id="pwa-modal-title">
              {getInstallTitle(device)}
            </h2>

            {/* IPHONE / IPAD */}

            {platform === "ios" && (
              <div className="pwa-help-steps">
                <p className="pwa-modal-description">
                  Vous utilisez{" "}
                  <strong>
                    {getBrowserName(browser)}
                  </strong>{" "}
                  sur {getDeviceName(device)}. Pour
                  installer MANA, appuyez sur Partager,
                  puis Ajouter à l’écran d’accueil.
                </p>

                <div className="pwa-help-step">
                  <span>1</span>
                  <div>
                    <strong>Ouvrez le site MANA</strong>
                    <p>
                      Accédez à la version web officielle
                      de MANA.
                    </p>
                  </div>
                  <ExternalLink size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>2</span>
                  <div>
                    <strong>Appuyez sur Partager</strong>
                    <p>
                      Dans {getBrowserName(browser)},
                      appuyez sur l'icône de partage ou
                      ouvrez le menu de partage.
                    </p>
                  </div>
                  <Share size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>3</span>
                  <div>
                    <strong>
                      Ajouter à l’écran d’accueil
                    </strong>
                    <p>
                      Recherchez l'option « Ajouter à
                      l’écran d’accueil » dans les options
                      de partage.
                    </p>
                  </div>
                  <PlusSquare size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>4</span>
                  <div>
                    <strong>Confirmez l'ajout</strong>
                    <p>
                      Vérifiez le nom MANA, puis appuyez
                      sur « Ajouter » pour retrouver MANA
                      sur votre écran d'accueil.
                    </p>
                  </div>
                  <CheckCircle2 size={24} />
                </div>
              </div>
            )}

            {/* ANDROID */}

            {platform === "android" && (
              <div className="pwa-help-steps">
                <p className="pwa-modal-description">
                  Vous utilisez{" "}
                  <strong>
                    {getBrowserName(browser)}
                  </strong>{" "}
                  sur {getDeviceName(device)}.
                </p>

                {browser !== "chrome" &&
                  browser !== "samsung" &&
                  browser !== "edge" && (
                    <div className="pwa-modal-alert">
                      <AlertTriangle size={24} />
                      <p>
                        Si l'installation n'est pas
                        proposée, essayez Google Chrome
                        ou Samsung Internet.
                      </p>
                    </div>
                  )}

                <div className="pwa-help-step">
                  <span>1</span>
                  <div>
                    <strong>Ouvrez le site MANA</strong>
                    <p>
                      Accédez à {PWA_URL}
                    </p>
                  </div>
                  <ExternalLink size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>2</span>
                  <div>
                    <strong>
                      Ouvrez le menu du navigateur
                    </strong>
                    <p>
                      Appuyez sur les trois points ou
                      le menu de votre navigateur.
                    </p>
                  </div>
                  <MonitorDown size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>3</span>
                  <div>
                    <strong>Installer l'application</strong>
                    <p>
                      Choisissez « Installer
                      l'application » ou « Ajouter à
                      l'écran d'accueil », selon les
                      options disponibles.
                    </p>
                  </div>
                  <Download size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>4</span>
                  <div>
                    <strong>Confirmez l'installation</strong>
                    <p>
                      MANA apparaîtra sur votre écran
                      d'accueil ou dans vos applications.
                    </p>
                  </div>
                  <CheckCircle2 size={24} />
                </div>
              </div>
            )}

            {/* DESKTOP */}

            {platform === "desktop" && (
              <div className="pwa-help-steps">
                <p className="pwa-modal-description">
                  Vous utilisez{" "}
                  <strong>
                    {getBrowserName(browser)}
                  </strong>{" "}
                  sur {getDeviceName(device)}.
                </p>

                <div className="pwa-help-step">
                  <span>1</span>
                  <div>
                    <strong>Ouvrez le site MANA</strong>
                    <p>
                      Accédez au site officiel depuis
                      votre navigateur.
                    </p>
                  </div>
                  <ExternalLink size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>2</span>
                  <div>
                    <strong>
                      Recherchez l'option d'installation
                    </strong>
                    <p>
                      Regardez dans le menu du navigateur
                      ou dans la barre d'adresse.
                    </p>
                  </div>
                  <MonitorDown size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>3</span>
                  <div>
                    <strong>Installer MANA</strong>
                    <p>
                      Si l'option est disponible, cliquez
                      sur « Installer » ou « Installer
                      MANA ».
                    </p>
                  </div>
                  <Download size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>4</span>
                  <div>
                    <strong>Lancez MANA</strong>
                    <p>
                      L'application pourra être ouverte
                      depuis votre bureau ou le menu
                      des applications.
                    </p>
                  </div>
                  <CheckCircle2 size={24} />
                </div>
              </div>
            )}

            {/* AUTRE APPAREIL */}

            {platform === "other" && (
              <div className="pwa-help-steps">
                <div className="pwa-modal-alert">
                  <AlertTriangle size={24} />
                  <p>
                    Impossible d'identifier précisément
                    votre appareil. Ouvrez MANA dans un
                    navigateur compatible avec les PWA.
                  </p>
                </div>

                <p className="pwa-modal-description">
                  Navigateur détecté :{" "}
                  <strong>
                    {getBrowserName(browser)}
                  </strong>
                  .
                </p>

                <div className="pwa-help-step">
                  <span>1</span>
                  <div>
                    <strong>Ouvrez le site MANA</strong>
                    <p>{PWA_URL}</p>
                  </div>
                  <ExternalLink size={24} />
                </div>

                <div className="pwa-help-step">
                  <span>2</span>
                  <div>
                    <strong>
                      Recherchez l'option Installer
                    </strong>
                    <p>
                      Consultez le menu de votre
                      navigateur.
                    </p>
                  </div>
                  <Download size={24} />
                </div>
              </div>
            )}

            {/* OUVRIR MANA */}

            <a
              href={PWA_URL}
              className="pwa-modal-open-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={18} />
              Ouvrir MANA
            </a>

            <p className="pwa-modal-footnote">
              <CircleHelp size={15} />
              L'installation dépend du navigateur, du
              système et de la compatibilité de l'appareil.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
