import React, { useState, useEffect } from 'react';
import { Accessibility, Moon, Sun, MoonStar, Type, Languages, Mic, Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility';
import { Button } from './button';
import { Switch } from './switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Slider } from './slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    isSpeaking,
    stopSpeaking,
    isListening,
    startListening,
    stopListening,
    transcript,
    resetTranscript,
    language,
    setLanguage,
    speakText
  } = useAccessibility();

  // Listen for toggle events from the header button
  useEffect(() => {
    const handleToggleEvent = () => {
      setIsOpen(prevState => !prevState);
    };

    document.addEventListener('toggle-accessibility', handleToggleEvent);
    return () => {
      document.removeEventListener('toggle-accessibility', handleToggleEvent);
    };
  }, []);

  // Close panel when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Available Indian languages for translation
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'te', label: 'Telugu' },
    { value: 'mr', label: 'Marathi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'ur', label: 'Urdu' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'pa', label: 'Punjabi' }
  ];
  
  // Handle text to speech for main content
  const handleReadPage = () => {
    // Force stop any previous speech first
    if (isSpeaking) {
      stopSpeaking();
      // Small delay to ensure previous speech is stopped
      setTimeout(() => {
        const mainContent = document.querySelector('main')?.textContent || '';
        speakText(mainContent);
      }, 100);
    } else {
      const mainContent = document.querySelector('main')?.textContent || '';
      speakText(mainContent);
    }
  };
  
  return (
    <>
      {/* Accessibility Panel */}
      <div className={`accessibility-panel ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Accessibility</h2>
          <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close panel">
            <span aria-hidden="true">&times;</span>
          </Button>
        </div>
        
        <Tabs defaultValue="display">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="display" className="flex-1">Display</TabsTrigger>
            <TabsTrigger value="speech" className="flex-1">Speech</TabsTrigger>
            <TabsTrigger value="language" className="flex-1">Language</TabsTrigger>
          </TabsList>
          
          {/* Display Settings */}
          <TabsContent value="display" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Theme</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    onClick={() => setTheme('light')}
                    className="flex items-center space-x-2"
                    aria-pressed={theme === 'light'}
                  >
                    <Sun size={16} />
                    <span>Light</span>
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    onClick={() => setTheme('dark')}
                    className="flex items-center space-x-2"
                    aria-pressed={theme === 'dark'}
                  >
                    <Moon size={16} />
                    <span>Dark</span>
                  </Button>
                  <Button 
                    variant={theme === 'system' ? 'default' : 'outline'} 
                    onClick={() => setTheme('system')}
                    className="flex items-center space-x-2"
                    aria-pressed={theme === 'system'}
                  >
                    <MoonStar size={16} />
                    <span>System</span>
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Font Size</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant={fontSize === 'normal' ? 'default' : 'outline'} 
                    onClick={() => setFontSize('normal')}
                    aria-pressed={fontSize === 'normal'}
                  >
                    A
                  </Button>
                  <Button 
                    variant={fontSize === 'large' ? 'default' : 'outline'} 
                    onClick={() => setFontSize('large')}
                    className="text-lg"
                    aria-pressed={fontSize === 'large'}
                  >
                    A
                  </Button>
                  <Button 
                    variant={fontSize === 'x-large' ? 'default' : 'outline'} 
                    onClick={() => setFontSize('x-large')}
                    className="text-xl"
                    aria-pressed={fontSize === 'x-large'}
                  >
                    A
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Type size={16} />
                  <span>High Contrast</span>
                </div>
                <Switch 
                  checked={highContrast} 
                  onCheckedChange={setHighContrast}
                  aria-label="Toggle high contrast mode"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Speech Settings */}
          <TabsContent value="speech" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Text to Speech</h3>
                {!isSpeaking ? (
                  <Button 
                    onClick={handleReadPage}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Volume2 size={16} />
                    <span>Read Page Content</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={stopSpeaking}
                    variant="destructive"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <VolumeX size={16} />
                    <span>Stop Reading</span>
                  </Button>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Speech to Text</h3>
                {isListening ? (
                  <Button 
                    onClick={stopListening}
                    variant="destructive"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Mic size={16} />
                    <span>Stop Listening</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={startListening}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Mic size={16} />
                    <span>Start Listening</span>
                  </Button>
                )}
                
                {transcript && (
                  <div className="mt-2">
                    <div className="p-2 bg-secondary rounded-md max-h-24 overflow-y-auto">
                      <p className="text-sm">{transcript}</p>
                    </div>
                    <Button 
                      onClick={resetTranscript}
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Language Settings */}
          <TabsContent value="language" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Display Language</h3>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Changes the language for text-to-speech and speech-to-text features.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Speech Recognition Indicator */}
      {isListening && (
        <div className="speech-indicator">
          <div className="speech-indicator-pulse" />
          <span>Listening...</span>
        </div>
      )}
      
      {/* Skip Link for Keyboard Users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
    </>
  );
};

export default AccessibilityPanel; 