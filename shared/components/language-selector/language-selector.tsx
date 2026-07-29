/**
 * Language Selector Component
 * Allows users to select their preferred language
 */

'use client';

import { Globe, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/ui/card';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

interface LanguageSelectorProps {
  currentLanguage?: string;
  onLanguageChange: (languageCode: string) => void;
}

export function LanguageSelector({ currentLanguage = 'en', onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Globe className="h-4 w-4" />
        <span>{selectedLanguage.flag}</span>
        <span className="hidden sm:inline">{selectedLanguage.name}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute top-full right-0 mt-2 z-50 w-64 max-h-96 overflow-y-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Select Language</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {languages.map((language) => (
                  <Button
                    key={language.code}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onLanguageChange(language.code);
                      setIsOpen(false);
                    }}
                  >
                    <span className="mr-2">{language.flag}</span>
                    <span className="flex-1 text-left">{language.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                      {language.nativeName}
                    </span>
                    {language.code === currentLanguage && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
