import { SupportedLocale, TextDirection } from "@/lib/types";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["zh-CN", "en", "es", "ja", "ar"];

export const LOCALE_META: Record<
  SupportedLocale,
  { label: string; nativeLabel: string; direction: TextDirection }
> = {
  "zh-CN": { label: "Chinese", nativeLabel: "简体中文", direction: "ltr" },
  en: { label: "English", nativeLabel: "English", direction: "ltr" },
  es: { label: "Spanish", nativeLabel: "Español", direction: "ltr" },
  ja: { label: "Japanese", nativeLabel: "日本語", direction: "ltr" },
  ar: { label: "Arabic", nativeLabel: "العربية", direction: "rtl" }
};

interface TranslationMap {
  [key: string]: string | TranslationMap;
}

type TranslationValue = string | TranslationMap;

const MESSAGES: Record<SupportedLocale, TranslationMap> = {
  "zh-CN": {
    nav: {
      home: "首页",
      lessons: "课程",
      trainer: "训练",
      challenge: "挑战",
      friends: "好友",
      custom: "自定义",
      season: "赛季",
      stats: "成长",
      product: "产品",
      auth: "登录"
    },
    shell: {
      eyebrow: "Fun-first touch typing",
      title: "Typing Trainer",
      description: "用分关课程、即时反馈和成长记录，把枯燥练习做成可以坚持的打字训练。",
      backLessons: "返回课程",
      trainingMode: "训练模式",
      language: "界面语言",
      signIn: "登录 / 注册",
      account: "我的账户"
    },
    voice: {
      compactHint: "自然语言：打开成长 / 查段位 / 练第二关 / 暂停一下"
    },
    home: {
      eyebrow: "Beginner-friendly typing lab",
      titleBefore: "把打字训练做成一条",
      titleAccent: "有反馈、有节奏、有成长感",
      titleAfter: "的学习路径",
      description:
        "从基准键开始，逐关建立正确手型；训练过程中即时显示速度、正确率和键位提示，让每一次输入都知道自己该怎么变快。",
      startFirstLesson: "从第一关开始",
      enterChallenge: "进入挑战榜",
      createCustom: "创建自定义练习",
      inviteFriends: "邀请好友",
      productOverview: "产品蓝图",
      seasonReview: "赛季回顾",
      shareCard: "分享战绩卡"
    },
    dashboard: {
      level: "当前等级",
      levelHint: "距离 Lv.{value} 还差 {xp} XP",
      xp: "总经验",
      xpHint: "每次完成训练都会获得经验",
      streak: "连续训练",
      streakHintGood: "状态很好，继续保持",
      streakHintNormal: "每天打一点，进步更稳定",
      bestWpm: "最高速度",
      bestWpmHintFast: "已经进入进阶节奏",
      bestWpmHintNormal: "准确率稳定后再提速",
      coins: "习惯金币",
      coinsHint: "签到、挑战和三星通关都会给你金币"
    },
    auth: {
      eyebrow: "Global access",
      title: "登录后，从任何语言和设备继续你的训练",
      description:
        "你可以先选择界面语言和输入语言，再通过邮箱、手机号或第三方入口进入。这样朋友点开链接后，也能更自然地开始使用。",
      loginTab: "登录",
      registerTab: "注册",
      email: "邮箱",
      phone: "手机号",
      name: "昵称",
      password: "密码",
      interfaceLanguage: "界面语言",
      inputLanguage: "输入语言",
      detectedLanguage: "系统推荐",
      detectedHint: "已根据你的浏览器语言推荐界面语言，你也可以手动切换。",
      emailPlaceholder: "输入邮箱地址",
      phonePlaceholder: "输入手机号",
      namePlaceholder: "给你的主页起个名字",
      passwordPlaceholder: "输入密码",
      loginAction: "进入我的训练",
      registerAction: "创建账户并继续",
      guestAction: "先以游客试用",
      socialTitle: "快捷接入",
      socialDescription: "Google、Facebook、Apple 入口已经准备好，适合海外用户快速开始。",
      socialGoogle: "继续使用 Google",
      socialFacebook: "继续使用 Facebook",
      socialApple: "继续使用 Apple",
      preferencesTitle: "语言与输入偏好",
      preferencesDescription: "界面语言会影响页面文案，输入语言会影响打字区的语言提示与输入方向。",
      note: "网页无法强制切换系统输入法，但会根据你的输入语言自动设置语言提示和阿拉伯语方向。",
      success: "偏好已保存，现在可以开始训练了。",
      currentSession: "当前会话",
      signOut: "退出当前账户"
    }
  },
  en: {
    nav: {
      home: "Home",
      lessons: "Lessons",
      trainer: "Trainer",
      challenge: "Challenge",
      friends: "Friends",
      custom: "Custom",
      season: "Season",
      stats: "Progress",
      product: "Product",
      auth: "Sign in"
    },
    shell: {
      eyebrow: "Fun-first touch typing",
      title: "Typing Trainer",
      description: "Turn drills into a practice system people can actually keep using with guided lessons, live feedback, and visible growth.",
      backLessons: "Back to lessons",
      trainingMode: "Training mode",
      language: "Interface language",
      signIn: "Sign in / Register",
      account: "My account"
    },
    voice: {
      compactHint: "Natural language: open progress / check season rank / lesson two / pause"
    },
    home: {
      eyebrow: "Beginner-friendly typing lab",
      titleBefore: "Turn typing practice into a",
      titleAccent: "feedback-rich, rhythmic, motivating",
      titleAfter: "learning path",
      description:
        "Start from the home row, build good finger habits one lesson at a time, and use live speed, accuracy, and key hints to improve with intention.",
      startFirstLesson: "Start lesson one",
      enterChallenge: "Open challenge board",
      createCustom: "Create custom practice",
      inviteFriends: "Invite friends",
      productOverview: "Product overview",
      seasonReview: "Season review",
      shareCard: "Share my score card"
    },
    dashboard: {
      level: "Current level",
      levelHint: "{xp} XP to reach Lv.{value}",
      xp: "Total XP",
      xpHint: "Every completed session adds experience",
      streak: "Practice streak",
      streakHintGood: "Strong momentum, keep it going",
      streakHintNormal: "A little every day builds stability",
      bestWpm: "Best speed",
      bestWpmHintFast: "You are entering an advanced rhythm",
      bestWpmHintNormal: "Lock in accuracy before pushing speed",
      coins: "Habit coins",
      coinsHint: "Check-ins, challenges, and three-star clears earn coins"
    },
    auth: {
      eyebrow: "Global access",
      title: "Sign in once and keep training across languages and devices",
      description:
        "Choose your interface language and typing language first, then continue with email, phone, or a familiar social account.",
      loginTab: "Sign in",
      registerTab: "Register",
      email: "Email",
      phone: "Phone",
      name: "Display name",
      password: "Password",
      interfaceLanguage: "Interface language",
      inputLanguage: "Typing language",
      detectedLanguage: "Recommended",
      detectedHint: "Your browser language is used as the initial recommendation, and you can change it anytime.",
      emailPlaceholder: "Enter your email",
      phonePlaceholder: "Enter your phone number",
      namePlaceholder: "Name your profile",
      passwordPlaceholder: "Enter your password",
      loginAction: "Enter my trainer",
      registerAction: "Create account and continue",
      guestAction: "Try as guest first",
      socialTitle: "Quick access",
      socialDescription: "Google, Facebook, and Apple entry points are ready for international onboarding.",
      socialGoogle: "Continue with Google",
      socialFacebook: "Continue with Facebook",
      socialApple: "Continue with Apple",
      preferencesTitle: "Language and typing preferences",
      preferencesDescription: "Interface language changes UI copy, while typing language adjusts the typing hint and text direction.",
      note: "A web page cannot force your system keyboard, but it can set helpful language and right-to-left hints for Arabic.",
      success: "Your preferences are saved. You can start training now.",
      currentSession: "Current session",
      signOut: "Sign out"
    }
  },
  es: {
    nav: {
      home: "Inicio",
      lessons: "Cursos",
      trainer: "Entrenamiento",
      challenge: "Desafío",
      friends: "Amigos",
      custom: "Personalizado",
      season: "Temporada",
      stats: "Progreso",
      product: "Producto",
      auth: "Entrar"
    },
    shell: {
      eyebrow: "Práctica de mecanografía con ritmo",
      title: "Typing Trainer",
      description: "Convierte la práctica en un sistema que se mantiene con lecciones guiadas, retroalimentación en tiempo real y progreso visible.",
      backLessons: "Volver a cursos",
      trainingMode: "Modo de entrenamiento",
      language: "Idioma de la interfaz",
      signIn: "Entrar / Registrarse",
      account: "Mi cuenta"
    },
    voice: {
      compactHint: "Lenguaje natural: abrir progreso / ver rango / lección dos / pausar"
    },
    home: {
      eyebrow: "Laboratorio de mecanografía para principiantes",
      titleBefore: "Convierte la práctica en una ruta de aprendizaje",
      titleAccent: "con ritmo, feedback y progreso visible",
      titleAfter: "",
      description:
        "Empieza desde la fila base, mejora un paso a la vez y usa velocidad, precisión y pistas de teclas para avanzar con claridad.",
      startFirstLesson: "Empezar la lección 1",
      enterChallenge: "Abrir desafíos",
      createCustom: "Crear práctica personalizada",
      inviteFriends: "Invitar amigos",
      productOverview: "Visión del producto",
      seasonReview: "Resumen de temporada",
      shareCard: "Compartir mi tarjeta"
    },
    dashboard: {
      level: "Nivel actual",
      levelHint: "Faltan {xp} XP para Lv.{value}",
      xp: "XP total",
      xpHint: "Cada sesión terminada añade experiencia",
      streak: "Racha",
      streakHintGood: "Buen ritmo, sigue así",
      streakHintNormal: "Un poco cada día te hace más estable",
      bestWpm: "Mejor velocidad",
      bestWpmHintFast: "Ya entraste en un ritmo avanzado",
      bestWpmHintNormal: "Asegura la precisión antes de acelerar",
      coins: "Monedas de hábito",
      coinsHint: "Los registros diarios, desafíos y tres estrellas te dan monedas"
    },
    auth: {
      eyebrow: "Acceso global",
      title: "Inicia sesión una vez y sigue practicando en cualquier idioma y dispositivo",
      description:
        "Primero elige el idioma de la interfaz y de escritura. Luego entra con correo, teléfono o una cuenta conocida.",
      loginTab: "Entrar",
      registerTab: "Registrarse",
      email: "Correo",
      phone: "Teléfono",
      name: "Nombre",
      password: "Contraseña",
      interfaceLanguage: "Idioma de la interfaz",
      inputLanguage: "Idioma de escritura",
      detectedLanguage: "Recomendado",
      detectedHint: "Tomamos el idioma del navegador como recomendación inicial y puedes cambiarlo cuando quieras.",
      emailPlaceholder: "Ingresa tu correo",
      phonePlaceholder: "Ingresa tu teléfono",
      namePlaceholder: "Ponle nombre a tu perfil",
      passwordPlaceholder: "Ingresa tu contraseña",
      loginAction: "Entrar a mi entrenamiento",
      registerAction: "Crear cuenta y continuar",
      guestAction: "Probar como invitado",
      socialTitle: "Acceso rápido",
      socialDescription: "Google, Facebook y Apple están listos como entradas rápidas para usuarios globales.",
      socialGoogle: "Continuar con Google",
      socialFacebook: "Continuar con Facebook",
      socialApple: "Continuar con Apple",
      preferencesTitle: "Preferencias de idioma y escritura",
      preferencesDescription: "El idioma de la interfaz cambia los textos. El idioma de escritura ajusta las ayudas y la dirección del texto.",
      note: "La web no puede forzar el teclado del sistema, pero sí puede mostrar pistas correctas y dirección RTL para árabe.",
      success: "Tus preferencias ya están guardadas. Puedes empezar a practicar.",
      currentSession: "Sesión actual",
      signOut: "Cerrar sesión"
    }
  },
  ja: {
    nav: {
      home: "ホーム",
      lessons: "レッスン",
      trainer: "練習",
      challenge: "チャレンジ",
      friends: "友だち",
      custom: "カスタム",
      season: "シーズン",
      stats: "成長",
      product: "製品",
      auth: "ログイン"
    },
    shell: {
      eyebrow: "続けやすいタイピング練習",
      title: "Typing Trainer",
      description: "段階式レッスン、リアルタイムの反応、成長記録で、続けやすいタイピング習慣を作ります。",
      backLessons: "レッスンに戻る",
      trainingMode: "練習モード",
      language: "表示言語",
      signIn: "ログイン / 登録",
      account: "マイアカウント"
    },
    voice: {
      compactHint: "自然な話し方でOK：成長を開く / 段位を見る / 第2課を練習 / 一時停止"
    },
    home: {
      eyebrow: "初心者向けタイピングラボ",
      titleBefore: "タイピング練習を",
      titleAccent: "手応え・リズム・成長が見える",
      titleAfter: "学習ルートに変える",
      description:
        "ホームポジションから始めて、指使いを一つずつ整えながら、速度・正確率・キーのヒントを見て着実に上達できます。",
      startFirstLesson: "第1課から始める",
      enterChallenge: "チャレンジへ",
      createCustom: "カスタム練習を作成",
      inviteFriends: "友だちを招待",
      productOverview: "製品概要",
      seasonReview: "シーズン確認",
      shareCard: "成績カードを共有"
    },
    dashboard: {
      level: "現在のレベル",
      levelHint: "Lv.{value} まであと {xp} XP",
      xp: "合計 XP",
      xpHint: "練習を終えるたびに経験値が増えます",
      streak: "連続練習",
      streakHintGood: "良い流れです。このまま続けましょう",
      streakHintNormal: "毎日少しずつが安定した上達につながります",
      bestWpm: "最高速度",
      bestWpmHintFast: "中級以上のリズムに入っています",
      bestWpmHintNormal: "まずは正確さを安定させてから速度を上げましょう",
      coins: "習慣コイン",
      coinsHint: "チェックイン、チャレンジ、三つ星クリアでコインを獲得できます"
    },
    auth: {
      eyebrow: "グローバルアクセス",
      title: "一度ログインすれば、どの言語・どの端末でも続けて練習できます",
      description:
        "まず表示言語と入力言語を選び、その後メール、電話番号、または使い慣れたアカウントで続行できます。",
      loginTab: "ログイン",
      registerTab: "登録",
      email: "メール",
      phone: "電話番号",
      name: "表示名",
      password: "パスワード",
      interfaceLanguage: "表示言語",
      inputLanguage: "入力言語",
      detectedLanguage: "おすすめ",
      detectedHint: "ブラウザ言語をもとにおすすめを設定しています。あとから変更できます。",
      emailPlaceholder: "メールアドレスを入力",
      phonePlaceholder: "電話番号を入力",
      namePlaceholder: "プロフィール名を入力",
      passwordPlaceholder: "パスワードを入力",
      loginAction: "練習を始める",
      registerAction: "アカウントを作成して続ける",
      guestAction: "まずはゲストで試す",
      socialTitle: "クイックアクセス",
      socialDescription: "Google、Facebook、Apple の入口を用意しており、海外ユーザーでも入りやすくしています。",
      socialGoogle: "Google で続行",
      socialFacebook: "Facebook で続行",
      socialApple: "Apple で続行",
      preferencesTitle: "言語と入力の設定",
      preferencesDescription: "表示言語は画面の文言を切り替え、入力言語は入力欄のヒントや文字方向に反映されます。",
      note: "Web ページからシステムの入力方式を強制変更することはできませんが、アラビア語の右から左入力などのヒントは反映できます。",
      success: "設定を保存しました。すぐに練習を始められます。",
      currentSession: "現在のセッション",
      signOut: "ログアウト"
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      lessons: "الدروس",
      trainer: "التدريب",
      challenge: "التحدي",
      friends: "الأصدقاء",
      custom: "مخصص",
      season: "الموسم",
      stats: "التقدم",
      product: "المنتج",
      auth: "تسجيل الدخول"
    },
    shell: {
      eyebrow: "تجربة كتابة ممتعة وسهلة الاستمرار",
      title: "Typing Trainer",
      description: "حوّل التمرين إلى نظام مستمر باستخدام دروس متدرجة وتغذية راجعة فورية ونمو واضح.",
      backLessons: "العودة إلى الدروس",
      trainingMode: "وضع التدريب",
      language: "لغة الواجهة",
      signIn: "تسجيل الدخول / إنشاء حساب",
      account: "حسابي"
    },
    voice: {
      compactHint: "أوامر طبيعية: افتح التقدم / اعرض الرتبة / الدرس الثاني / أوقف التدريب"
    },
    home: {
      eyebrow: "مختبر كتابة مناسب للمبتدئين",
      titleBefore: "حوّل تدريب الكتابة إلى مسار",
      titleAccent: "واضح الإيقاع والتغذية الراجعة والتقدم",
      titleAfter: "",
      description:
        "ابدأ من الصف الأساسي، وطور حركة الأصابع خطوة بخطوة، وشاهد السرعة والدقة وإرشادات المفاتيح بشكل فوري.",
      startFirstLesson: "ابدأ من الدرس الأول",
      enterChallenge: "افتح صفحة التحدي",
      createCustom: "أنشئ تدريبًا مخصصًا",
      inviteFriends: "ادعُ الأصدقاء",
      productOverview: "نظرة على المنتج",
      seasonReview: "مراجعة الموسم",
      shareCard: "مشاركة بطاقة الإنجاز"
    },
    dashboard: {
      level: "المستوى الحالي",
      levelHint: "تبقى {xp} نقطة XP للوصول إلى Lv.{value}",
      xp: "إجمالي XP",
      xpHint: "كل جلسة مكتملة تضيف خبرة جديدة",
      streak: "سلسلة التدريب",
      streakHintGood: "إيقاع ممتاز، استمر",
      streakHintNormal: "القليل كل يوم يبني استقرارًا أفضل",
      bestWpm: "أفضل سرعة",
      bestWpmHintFast: "لقد دخلت إيقاعًا متقدمًا",
      bestWpmHintNormal: "ثبّت الدقة أولًا ثم ارفع السرعة",
      coins: "عملات العادة",
      coinsHint: "التسجيل اليومي والتحديات والنجوم الثلاث تكسبك عملات"
    },
    auth: {
      eyebrow: "وصول عالمي",
      title: "سجّل مرة واحدة ثم واصل التدريب عبر اللغات والأجهزة",
      description:
        "اختر أولًا لغة الواجهة ولغة الإدخال، ثم تابع بالبريد الإلكتروني أو الهاتف أو حساب اجتماعي مألوف.",
      loginTab: "تسجيل الدخول",
      registerTab: "إنشاء حساب",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      name: "الاسم",
      password: "كلمة المرور",
      interfaceLanguage: "لغة الواجهة",
      inputLanguage: "لغة الإدخال",
      detectedLanguage: "الموصى بها",
      detectedHint: "تمت التوصية باللغة اعتمادًا على لغة المتصفح، ويمكنك تغييرها في أي وقت.",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      phonePlaceholder: "أدخل رقم الهاتف",
      namePlaceholder: "اختر اسم ملفك الشخصي",
      passwordPlaceholder: "أدخل كلمة المرور",
      loginAction: "ادخل إلى التدريب",
      registerAction: "أنشئ حسابًا وتابع",
      guestAction: "جرّب كضيف أولًا",
      socialTitle: "دخول سريع",
      socialDescription: "تم تجهيز مداخل Google وFacebook وApple لتسهيل الوصول على المستخدمين الدوليين.",
      socialGoogle: "المتابعة باستخدام Google",
      socialFacebook: "المتابعة باستخدام Facebook",
      socialApple: "المتابعة باستخدام Apple",
      preferencesTitle: "تفضيلات اللغة والإدخال",
      preferencesDescription: "لغة الواجهة تغيّر النصوص، ولغة الإدخال تضبط التلميحات واتجاه النص داخل منطقة الكتابة.",
      note: "لا يمكن لصفحة الويب فرض لوحة مفاتيح النظام، لكنها تستطيع ضبط اللغة واتجاه الكتابة من اليمين إلى اليسار للعربية.",
      success: "تم حفظ تفضيلاتك. يمكنك البدء الآن.",
      currentSession: "الجلسة الحالية",
      signOut: "تسجيل الخروج"
    }
  }
};

function getValue(locale: SupportedLocale, key: string): string | undefined {
  const parts = key.split(".");
  let cursor: TranslationValue | undefined = MESSAGES[locale];
  for (const part of parts) {
    if (!cursor || typeof cursor === "string") return undefined;
    cursor = cursor[part];
  }
  return typeof cursor === "string" ? cursor : undefined;
}

export function normalizeLocale(locale?: string | null): SupportedLocale {
  if (!locale) return "zh-CN";
  const lower = locale.toLowerCase();
  if (lower.startsWith("zh")) return "zh-CN";
  if (lower.startsWith("en")) return "en";
  if (lower.startsWith("es")) return "es";
  if (lower.startsWith("ja")) return "ja";
  if (lower.startsWith("ar")) return "ar";
  return "zh-CN";
}

export function getDirection(locale: SupportedLocale): TextDirection {
  return LOCALE_META[locale].direction;
}

export function formatMessage(
  locale: SupportedLocale,
  key: string,
  replacements?: Record<string, string | number>
) {
  const template = getValue(locale, key) ?? getValue("zh-CN", key) ?? key;
  if (!replacements) return template;

  return Object.entries(replacements).reduce(
    (message, [token, value]) => message.replaceAll(`{${token}}`, String(value)),
    template
  );
}
