export type Language = 'english' | 'sinhala' | 'tamil';

export interface TranslationStrings {
  appTitle: string;
  selectSection: string;
  rateService: string;
  thankYou: string;
  login: string;
  email: string;
  password: string;
  loginButton: string;
  dashboard: string;
  logout: string;
  feedbackSummary: string;
  dateWiseTrends: string;
  poor: string;
  good: string;
  excellent: string;
  sections: {
    counter: string;
    loan: string;
    recovery: string;
    chequeClearingUnit: string;
    pawning: string;
    personalBankingUnit: string;
  };
}

export const translations: Record<Language, TranslationStrings> = {
  english: {
    appTitle: 'BOC Customer Feedback',
    selectSection: 'Select Service Section',
    rateService: 'Rate Our Service',
    thankYou: 'Thank you for your feedback!',
    login: 'Manager Login',
    email: 'Email',
    password: 'Password',
    loginButton: 'Login',
    dashboard: 'Dashboard',
    logout: 'Logout',
    feedbackSummary: 'Feedback Summary',
    dateWiseTrends: 'Date-wise Trends',
    poor: 'Poor',
    good: 'Good',
    excellent: 'Excellent',
    sections: {
      counter: 'COUNTER',
      loan: 'LOAN',
      recovery: 'RECOVERY',
      chequeClearingUnit: 'CHEQUE CLEARING UNIT',
      pawning: 'PAWNING',
      personalBankingUnit: 'PERSONAL BANKING UNIT',
    },
  },
  sinhala: {
    appTitle: 'BOC පාරිභෝගික ප්‍රතිචාර',
    selectSection: 'සේවා අංශය තෝරන්න',
    rateService: 'අපගේ සේවාව අගයන්න',
    thankYou: 'ඔබගේ ප්‍රතිචාරයට ස්තුතියි!',
    login: 'කළමනාකරු පිවිසුම',
    email: 'විද්‍යුත් තැපෑල',
    password: 'මුරපදය',
    loginButton: 'පිවිසෙන්න',
    dashboard: 'උපකරණ පුවරුව',
    logout: 'පිටවීම',
    feedbackSummary: 'ප්‍රතිපෝෂණ සාරාංශය',
    dateWiseTrends: 'දිනය අනුව ප්‍රවණතා',
    poor: 'දුර්වල',
    good: 'හොඳයි',
    excellent: 'විශිෂ්ටයි',
    sections: {
      counter: 'කවුන්ටරය',
      loan: 'ණය',
      recovery: 'අය කිරීම්',
      chequeClearingUnit: 'චෙක්පත් නිෂ්කාශන ඒකකය',
      pawning: 'උකස්',
      personalBankingUnit: 'පුද්ගලික බැංකු ඒකකය',
    },
  },
  tamil: {
    appTitle: 'BOC வாடிக்கையாளர் கருத்து',
    selectSection: 'சேவை பிரிவைத் தேர்ந்தெடுக்கவும்',
    rateService: 'எங்கள் சேவையை மதிப்பிடவும்',
    thankYou: 'உங்கள் கருத்துக்கு நன்றி!',
    login: 'மேலாளர் உள்நுழைவு',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    loginButton: 'உள்நுழைக',
    dashboard: 'டாஷ்போர்டு',
    logout: 'வெளியேறு',
    feedbackSummary: 'கருத்து சுருக்கம்',
    dateWiseTrends: 'தேதி வாரியான போக்குகள்',
    poor: 'மோசமான',
    good: 'நல்லது',
    excellent: 'சிறந்தது',
    sections: {
      counter: 'கவுண்டர்',
      loan: 'கடன்',
      recovery: 'மீட்டல்',
      chequeClearingUnit: 'காசோலை அனுமதி பிரிவு',
      pawning: 'அடகு',
      personalBankingUnit: 'தனிப்பட்ட வங்கி பிரிவு',
    },
  },
};

export const sections = [
  'counter',
  'loan',
  'recovery',
  'chequeClearingUnit',
  'pawning',
  'personalBankingUnit',
];