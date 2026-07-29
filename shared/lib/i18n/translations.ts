/**
 * Internationalization (i18n) Translations
 * Supports multiple languages for global accessibility
 */

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'hi' | 'ar' | 'pt';

export interface Translations {
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    search: string;
    filter: string;
    sort: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    forgotPassword: string;
    rememberMe: string;
  };
  navigation: {
    dashboard: string;
    accounts: string;
    transactions: string;
    budget: string;
    settings: string;
    profile: string;
  };
  dashboard: {
    totalBalance: string;
    monthlyIncome: string;
    monthlyExpenses: string;
    budgetProgress: string;
    recentTransactions: string;
    quickActions: string;
  };
  transactions: {
    addTransaction: string;
    income: string;
    expense: string;
    amount: string;
    category: string;
    date: string;
    description: string;
    receipt: string;
  };
  accounts: {
    addAccount: string;
    accountName: string;
    accountType: string;
    balance: string;
    current: string;
    savings: string;
  };
  budget: {
    monthlyBudget: string;
    setBudget: string;
    budgetAlert: string;
    remaining: string;
    spent: string;
  };
  crypto: {
    wallet: string;
    connectWallet: string;
    send: string;
    receive: string;
    balance: string;
    transactionHistory: string;
  };
  defi: {
    dashboard: string;
    protocols: string;
    stake: string;
    unstake: string;
    apy: string;
    tvl: string;
  };
  notifications: {
    enableNotifications: string;
    notificationsEnabled: string;
    notificationsDisabled: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember me',
    },
    navigation: {
      dashboard: 'Dashboard',
      accounts: 'Accounts',
      transactions: 'Transactions',
      budget: 'Budget',
      settings: 'Settings',
      profile: 'Profile',
    },
    dashboard: {
      totalBalance: 'Total Balance',
      monthlyIncome: 'Monthly Income',
      monthlyExpenses: 'Monthly Expenses',
      budgetProgress: 'Budget Progress',
      recentTransactions: 'Recent Transactions',
      quickActions: 'Quick Actions',
    },
    transactions: {
      addTransaction: 'Add Transaction',
      income: 'Income',
      expense: 'Expense',
      amount: 'Amount',
      category: 'Category',
      date: 'Date',
      description: 'Description',
      receipt: 'Receipt',
    },
    accounts: {
      addAccount: 'Add Account',
      accountName: 'Account Name',
      accountType: 'Account Type',
      balance: 'Balance',
      current: 'Current',
      savings: 'Savings',
    },
    budget: {
      monthlyBudget: 'Monthly Budget',
      setBudget: 'Set Budget',
      budgetAlert: 'Budget Alert',
      remaining: 'Remaining',
      spent: 'Spent',
    },
    crypto: {
      wallet: 'Crypto Wallet',
      connectWallet: 'Connect Wallet',
      send: 'Send',
      receive: 'Receive',
      balance: 'Balance',
      transactionHistory: 'Transaction History',
    },
    defi: {
      dashboard: 'DeFi Dashboard',
      protocols: 'Protocols',
      stake: 'Stake',
      unstake: 'Unstake',
      apy: 'APY',
      tvl: 'TVL',
    },
    notifications: {
      enableNotifications: 'Enable Notifications',
      notificationsEnabled: 'Notifications Enabled',
      notificationsDisabled: 'Notifications Disabled',
    },
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Ocurrió un error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
    },
    auth: {
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar Sesión',
      email: 'Correo',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      rememberMe: 'Recordarme',
    },
    navigation: {
      dashboard: 'Panel',
      accounts: 'Cuentas',
      transactions: 'Transacciones',
      budget: 'Presupuesto',
      settings: 'Configuración',
      profile: 'Perfil',
    },
    dashboard: {
      totalBalance: 'Saldo Total',
      monthlyIncome: 'Ingreso Mensual',
      monthlyExpenses: 'Gastos Mensuales',
      budgetProgress: 'Progreso del Presupuesto',
      recentTransactions: 'Transacciones Recientes',
      quickActions: 'Acciones Rápidas',
    },
    transactions: {
      addTransaction: 'Agregar Transacción',
      income: 'Ingreso',
      expense: 'Gasto',
      amount: 'Monto',
      category: 'Categoría',
      date: 'Fecha',
      description: 'Descripción',
      receipt: 'Recibo',
    },
    accounts: {
      addAccount: 'Agregar Cuenta',
      accountName: 'Nombre de Cuenta',
      accountType: 'Tipo de Cuenta',
      balance: 'Saldo',
      current: 'Corriente',
      savings: 'Ahorros',
    },
    budget: {
      monthlyBudget: 'Presupuesto Mensual',
      setBudget: 'Establecer Presupuesto',
      budgetAlert: 'Alerta de Presupuesto',
      remaining: 'Restante',
      spent: 'Gastado',
    },
    crypto: {
      wallet: 'Billetera Crypto',
      connectWallet: 'Conectar Billetera',
      send: 'Enviar',
      receive: 'Recibir',
      balance: 'Saldo',
      transactionHistory: 'Historial de Transacciones',
    },
    defi: {
      dashboard: 'Panel DeFi',
      protocols: 'Protocolos',
      stake: 'Stakear',
      unstake: 'Unstakear',
      apy: 'APY',
      tvl: 'TVL',
    },
    notifications: {
      enableNotifications: 'Habilitar Notificaciones',
      notificationsEnabled: 'Notificaciones Habilitadas',
      notificationsDisabled: 'Notificaciones Deshabilitadas',
    },
  },
  fr: {
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
    },
    auth: {
      signIn: 'Connexion',
      signUp: 'S\'inscrire',
      signOut: 'Déconnexion',
      email: 'Email',
      password: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      rememberMe: 'Se souvenir de moi',
    },
    navigation: {
      dashboard: 'Tableau de bord',
      accounts: 'Comptes',
      transactions: 'Transactions',
      budget: 'Budget',
      settings: 'Paramètres',
      profile: 'Profil',
    },
    dashboard: {
      totalBalance: 'Solde Total',
      monthlyIncome: 'Revenu Mensuel',
      monthlyExpenses: 'Dépenses Mensuelles',
      budgetProgress: 'Progression du Budget',
      recentTransactions: 'Transactions Récentes',
      quickActions: 'Actions Rapides',
    },
    transactions: {
      addTransaction: 'Ajouter Transaction',
      income: 'Revenu',
      expense: 'Dépense',
      amount: 'Montant',
      category: 'Catégorie',
      date: 'Date',
      description: 'Description',
      receipt: 'Reçu',
    },
    accounts: {
      addAccount: 'Ajouter Compte',
      accountName: 'Nom du Compte',
      accountType: 'Type de Compte',
      balance: 'Solde',
      current: 'Courant',
      savings: 'Épargne',
    },
    budget: {
      monthlyBudget: 'Budget Mensuel',
      setBudget: 'Définir Budget',
      budgetAlert: 'Alerte Budget',
      remaining: 'Restant',
      spent: 'Dépensé',
    },
    crypto: {
      wallet: 'Portefeuille Crypto',
      connectWallet: 'Connecter Portefeuille',
      send: 'Envoyer',
      receive: 'Recevoir',
      balance: 'Solde',
      transactionHistory: 'Historique des Transactions',
    },
    defi: {
      dashboard: 'Tableau de bord DeFi',
      protocols: 'Protocoles',
      stake: 'Staker',
      unstake: 'Unstaker',
      apy: 'APY',
      tvl: 'TVL',
    },
    notifications: {
      enableNotifications: 'Activer les Notifications',
      notificationsEnabled: 'Notifications Activées',
      notificationsDisabled: 'Notifications Désactivées',
    },
  },
  de: {
    common: {
      loading: 'Laden...',
      error: 'Ein Fehler ist aufgetreten',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      close: 'Schließen',
      search: 'Suchen',
      filter: 'Filtern',
      sort: 'Sortieren',
    },
    auth: {
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      signOut: 'Abmelden',
      email: 'E-Mail',
      password: 'Passwort',
      forgotPassword: 'Passwort vergessen?',
      rememberMe: 'Angemeldet bleiben',
    },
    navigation: {
      dashboard: 'Dashboard',
      accounts: 'Konten',
      transactions: 'Transaktionen',
      budget: 'Budget',
      settings: 'Einstellungen',
      profile: 'Profil',
    },
    dashboard: {
      totalBalance: 'Gesamtsaldo',
      monthlyIncome: 'Monatliches Einkommen',
      monthlyExpenses: 'Monatliche Ausgaben',
      budgetProgress: 'Budget-Fortschritt',
      recentTransactions: 'Neueste Transaktionen',
      quickActions: 'Schnelle Aktionen',
    },
    transactions: {
      addTransaction: 'Transaktion Hinzufügen',
      income: 'Einkommen',
      expense: 'Ausgabe',
      amount: 'Betrag',
      category: 'Kategorie',
      date: 'Datum',
      description: 'Beschreibung',
      receipt: 'Beleg',
    },
    accounts: {
      addAccount: 'Konto Hinzufügen',
      accountName: 'Kontoname',
      accountType: 'Kontotyp',
      balance: 'Saldo',
      current: 'Girokonto',
      savings: 'Sparkonto',
    },
    budget: {
      monthlyBudget: 'Monatliches Budget',
      setBudget: 'Budget Festlegen',
      budgetAlert: 'Budget-Warnung',
      remaining: 'Verbleibend',
      spent: 'Ausgegeben',
    },
    crypto: {
      wallet: 'Crypto-Wallet',
      connectWallet: 'Wallet Verbinden',
      send: 'Senden',
      receive: 'Empfangen',
      balance: 'Saldo',
      transactionHistory: 'Transaktionshistorie',
    },
    defi: {
      dashboard: 'DeFi-Dashboard',
      protocols: 'Protokolle',
      stake: 'Staken',
      unstake: 'Unstaken',
      apy: 'APY',
      tvl: 'TVL',
    },
    notifications: {
      enableNotifications: 'Benachrichtigungen Aktivieren',
      notificationsEnabled: 'Benachrichtigungen Aktiviert',
      notificationsDisabled: 'Benachrichtigungen Deaktiviert',
    },
  },
  zh: {
    common: {
      loading: '加载中...',
      error: '发生错误',
      success: '成功',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      close: '关闭',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
    },
    auth: {
      signIn: '登录',
      signUp: '注册',
      signOut: '退出',
      email: '邮箱',
      password: '密码',
      forgotPassword: '忘记密码?',
      rememberMe: '记住我',
    },
    navigation: {
      dashboard: '仪表板',
      accounts: '账户',
      transactions: '交易',
      budget: '预算',
      settings: '设置',
      profile: '个人资料',
    },
    dashboard: {
      totalBalance: '总余额',
      monthlyIncome: '月收入',
      monthlyExpenses: '月支出',
      budgetProgress: '预算进度',
      recentTransactions: '最近交易',
      quickActions: '快速操作',
    },
    transactions: {
      addTransaction: '添加交易',
      income: '收入',
      expense: '支出',
      amount: '金额',
      category: '类别',
      date: '日期',
      description: '描述',
      receipt: '收据',
    },
    accounts: {
      addAccount: '添加账户',
      accountName: '账户名称',
      accountType: '账户类型',
      balance: '余额',
      current: '活期',
      savings: '储蓄',
    },
    budget: {
      monthlyBudget: '月度预算',
      setBudget: '设置预算',
      budgetAlert: '预算警告',
      remaining: '剩余',
      spent: '已花费',
    },
    crypto: {
      wallet: '加密钱包',
      connectWallet: '连接钱包',
      send: '发送',
      receive: '接收',
      balance: '余额',
      transactionHistory: '交易历史',
    },
    defi: {
      dashboard: 'DeFi仪表板',
      protocols: '协议',
      stake: '质押',
      unstake: '取消质押',
      apy: '年化收益率',
      tvl: '总锁仓量',
    },
    notifications: {
      enableNotifications: '启用通知',
      notificationsEnabled: '通知已启用',
      notificationsDisabled: '通知已禁用',
    },
  },
  ja: {
    common: {
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      success: '成功',
      cancel: 'キャンセル',
      save: '保存',
      delete: '削除',
      edit: '編集',
      close: '閉じる',
      search: '検索',
      filter: 'フィルター',
      sort: '並べ替え',
    },
    auth: {
      signIn: 'ログイン',
      signUp: '新規登録',
      signOut: 'ログアウト',
      email: 'メール',
      password: 'パスワード',
      forgotPassword: 'パスワードをお忘れですか?',
      rememberMe: 'ログイン状態を保持',
    },
    navigation: {
      dashboard: 'ダッシュボード',
      accounts: 'アカウント',
      transactions: '取引',
      budget: '予算',
      settings: '設定',
      profile: 'プロフィール',
    },
    dashboard: {
      totalBalance: '総残高',
      monthlyIncome: '月間収入',
      monthlyExpenses: '月間支出',
      budgetProgress: '予算進捗',
      recentTransactions: '最近の取引',
      quickActions: 'クイックアクション',
    },
    transactions: {
      addTransaction: '取引を追加',
      income: '収入',
      expense: '支出',
      amount: '金額',
      category: 'カテゴリ',
      date: '日付',
      description: '説明',
      receipt: 'レシート',
    },
    accounts: {
      addAccount: 'アカウントを追加',
      accountName: 'アカウント名',
      accountType: 'アカウントタイプ',
      balance: '残高',
      current: '当座',
      savings: '貯蓄',
    },
    budget: {
      monthlyBudget: '月間予算',
      setBudget: '予算を設定',
      budgetAlert: '予算アラート',
      remaining: '残り',
      spent: '使用済み',
    },
    crypto: {
      wallet: '暗号通貨ウォレット',
      connectWallet: 'ウォレットを接続',
      send: '送信',
      receive: '受信',
      balance: '残高',
      transactionHistory: '取引履歴',
    },
    defi: {
      dashboard: 'DeFiダッシュボード',
      protocols: 'プロトコル',
      stake: 'ステーキング',
      unstake: 'アンステーキング',
      apy: 'APY',
      tvl: 'TVL',
    },
    notifications: {
      enableNotifications: '通知を有効にする',
      notificationsEnabled: '通知が有効',
      notificationsDisabled: '通知が無効',
    },
  },
  ko: {
    common: {
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      success: '성공',
      cancel: '취소',
      save: '저장',
      delete: '삭제',
      edit: '편집',
      close: '닫기',
      search: '검색',
      filter: '필터',
      sort: '정렬',
    },
    auth: {
      signIn: '로그인',
      signUp: '회원가입',
      signOut: '로그아웃',
      email: '이메일',
      password: '비밀번호',
      forgotPassword: '비밀번호를 잊으셨나요?',
      rememberMe: '로그인 상태 유지',
    },
    navigation: {
      dashboard: '대시보드',
      accounts: '계정',
      transactions: '거래',
      budget: '예산',
      settings: '설정',
      profile: '프로필',
    },
    dashboard: {
      totalBalance: '총 잔액',
      monthlyIncome: '월 수입',
      monthlyExpenses: '월 지출',
      budgetProgress: '예산 진행률',
      recentTransactions: '최근 거래',
      quickActions: '빠른 작업',
    },
    transactions: {
      addTransaction: '거래 추가',
      income: '수입',
      expense: '지출',
      amount: '금액',
      category: '카테고리',
      date: '날짜',
      description: '설명',
      receipt: '영수증',
    },
    accounts: {
      addAccount: '계정 추가',
      accountName: '계정 이름',
      accountType: '계정 유형',
      balance: '잔액',
      current: '당좌',
      savings: '저축',
    },
    budget: {
      monthlyBudget: '월간 예산',
      setBudget: '예산 설정',
      budgetAlert: '예산 알림',
      remaining: '남은',
      spent: '지출됨',
    },
    crypto: {
      wallet: '암호화폐 지갑',
      connectWallet: '지갑 연결',
      send: '보내기',
      receive: '받기',
      balance: '잔액',
      transactionHistory: '거래 기록',
    },
    defi: {
      dashboard: 'DeFi 대시보드',
      protocols: '프로토콜',
      stake: '스테이킹',
      unstake: '언스테이킹',
      apy: 'APY',
      tvl: 'TVL',
    },
    notifications: {
      enableNotifications: '알림 활성화',
      notificationsEnabled: '알림 활성화됨',
      notificationsDisabled: '알림 비활성화됨',
    },
  },
  hi: {
    common: {
      loading: 'लोड हो रहा है...',
      error: 'एक त्रुटि हुई',
      success: 'सफलता',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      close: 'बंद करें',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      sort: 'क्रमबद्ध करें',
    },
    auth: {
      signIn: 'साइन इन करें',
      signUp: 'साइन अप करें',
      signOut: 'साइन आउट',
      email: 'ईमेल',
      password: 'पासवर्ड',
      forgotPassword: 'पासवर्ड भूल गए?',
      rememberMe: 'मुझे याद रखें',
    },
    navigation: {
      dashboard: 'डैशबोर्ड',
      accounts: 'खाते',
      transactions: 'लेनदेन',
      budget: 'बजट',
      settings: 'सेटिंग्स',
      profile: 'प्रोफ़ाइल',
    },
    dashboard: {
      totalBalance: 'कुल बैलेंस',
      monthlyIncome: 'मासिक आय',
      monthlyExpenses: 'मासिक खर्च',
      budgetProgress: 'बजट प्रगति',
      recentTransactions: 'हाल के लेनदेन',
      quickActions: 'त्वरित कार्य',
    },
    transactions: {
      addTransaction: 'लेनदेन जोड़ें',
      income: 'आय',
      expense: 'व्यय',
      amount: 'राशि',
      category: 'श्रेणी',
      date: 'दिनांक',
      description: 'विवरण',
      receipt: 'रसीद',
    },
    accounts: {
      addAccount: 'खाता जोड़ें',
      accountName: 'खाता का नाम',
      accountType: 'खाता प्रकार',
      balance: 'बैलेंस',
      current: 'वर्तमान',
      savings: 'बचत',
    },
    budget: {
      monthlyBudget: 'मासिक बजट',
      setBudget: 'बजट सेट करें',
      budgetAlert: 'बजट अलर्ट',
      remaining: 'शेष',
      spent: 'खर्च किया गया',
    },
    crypto: {
      wallet: 'क्रिप्टो वॉलेट',
      connectWallet: 'वॉलेट कनेक्ट करें',
      send: 'भेजें',
      receive: 'प्राप्त करें',
      balance: 'बैलेंस',
      transactionHistory: 'लेनदेन इतिहास',
    },
    defi: {
      dashboard: 'DeFi डैशबोर्ड',
      protocols: 'प्रोटोकॉल',
      stake: 'स्टेक करें',
      unstake: 'अनस्टेक करें',
      apy: 'APY',
      tvl: 'TVL',
    },
    notifications: {
      enableNotifications: 'नोटिफिकेशन सक्षम करें',
      notificationsEnabled: 'नोटिफिकेशन सक्षम',
      notificationsDisabled: 'नोटिफिकेशन अक्षम',
    },
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'نجاح',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      close: 'إغلاق',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
    },
    auth: {
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      signOut: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني',
    },
    navigation: {
      dashboard: 'لوحة التحكم',
      accounts: 'الحسابات',
      transactions: 'المعاملات',
      budget: 'الميزانية',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
    },
    dashboard: {
      totalBalance: 'إجمالي الرصيد',
      monthlyIncome: 'الدخل الشهري',
      monthlyExpenses: 'المصاريف الشهرية',
      budgetProgress: 'تقدم الميزانية',
      recentTransactions: 'المعاملات الأخيرة',
      quickActions: 'إجراءات سريعة',
    },
    transactions: {
      addTransaction: 'إضافة معاملة',
      income: 'دخل',
      expense: 'مصروف',
      amount: 'المبلغ',
      category: 'الفئة',
      date: 'التاريخ',
      description: 'الوصف',
      receipt: 'إيصال',
    },
    accounts: {
      addAccount: 'إضافة حساب',
      accountName: 'اسم الحساب',
      accountType: 'نوع الحساب',
      balance: 'الرصيد',
      current: 'جاري',
      savings: 'توفير',
    },
    budget: {
      monthlyBudget: 'الميزانية الشهرية',
      setBudget: 'تعيين الميزانية',
      budgetAlert: 'تنبيه الميزانية',
      remaining: 'المتبقي',
      spent: 'تم إنفاقه',
    },
    crypto: {
      wallet: 'محفظة العملات المشفرة',
      connectWallet: 'ربط المحفظة',
      send: 'إرسال',
      receive: 'استلام',
      balance: 'الرصيد',
      transactionHistory: 'سجل المعاملات',
    },
    defi: {
      dashboard: 'لوحة تحكم DeFi',
      protocols: 'البروتوكولات',
      stake: 'الرهان',
      unstake: 'إلغاء الرهان',
      apy: 'APY',
      tvl: 'TVL',
    },
    notifications: {
      enableNotifications: 'تفعيل الإشعارات',
      notificationsEnabled: 'الإشعارات مفعلة',
      notificationsDisabled: 'الإشعارات معطلة',
    },
  },
  pt: {
    common: {
      loading: 'Carregando...',
      error: 'Ocorreu um erro',
      success: 'Sucesso',
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      close: 'Fechar',
      search: 'Pesquisar',
      filter: 'Filtrar',
      sort: 'Ordenar',
    },
    auth: {
      signIn: 'Entrar',
      signUp: 'Cadastrar',
      signOut: 'Sair',
      email: 'E-mail',
      password: 'Senha',
      forgotPassword: 'Esqueceu a senha?',
      rememberMe: 'Lembrar-me',
    },
    navigation: {
      dashboard: 'Painel',
      accounts: 'Contas',
      transactions: 'Transações',
      budget: 'Orçamento',
      settings: 'Configurações',
      profile: 'Perfil',
    },
    dashboard: {
      totalBalance: 'Saldo Total',
      monthlyIncome: 'Renda Mensal',
      monthlyExpenses: 'Despesas Mensais',
      budgetProgress: 'Progresso do Orçamento',
      recentTransactions: 'Transações Recentes',
      quickActions: 'Ações Rápidas',
    },
    transactions: {
      addTransaction: 'Adicionar Transação',
      income: 'Receita',
      expense: 'Despesa',
      amount: 'Valor',
      category: 'Categoria',
      date: 'Data',
      description: 'Descrição',
      receipt: 'Recibo',
    },
    accounts: {
      addAccount: 'Adicionar Conta',
      accountName: 'Nome da Conta',
      accountType: 'Tipo de Conta',
      balance: 'Saldo',
      current: 'Corrente',
      savings: 'Poupança',
    },
    budget: {
      monthlyBudget: 'Orçamento Mensal',
      setBudget: 'Definir Orçamento',
      budgetAlert: 'Alerta de Orçamento',
      remaining: 'Restante',
      spent: 'Gasto',
    },
    crypto: {
      wallet: 'Carteira Crypto',
      connectWallet: 'Conectar Carteira',
      send: 'Enviar',
      receive: 'Receber',
      balance: 'Saldo',
      transactionHistory: 'Histórico de Transações',
    },
    defi: {
      dashboard: 'Painel DeFi',
      protocols: 'Protocolos',
      stake: 'Stake',
      unstake: 'Unstake',
      apy: 'APY',
      tvl: 'TVL',
    },
    notifications: {
      enableNotifications: 'Ativar Notificações',
      notificationsEnabled: 'Notificações Ativadas',
      notificationsDisabled: 'Notificações Desativadas',
    },
  },
};

/**
 * Get translations for a specific language
 */
export function getTranslations(language: Language = 'en'): Translations {
  return translations[language] || translations.en;
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  ];
}
