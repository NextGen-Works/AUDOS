import React from 'react'
import { AudioProvider } from './store/audioStore'
import { JournalProvider } from './store/journalStore'
import { CodexProvider } from './store/codexStore'
import { SIGLProvider } from './store/siglStore'
import { AudioControls } from './components/AudioControls'
import { BreathCoach } from './components/BreathCoach'
import { Sketchpad } from './components/Sketchpad'
import { ParallaxBackground } from './components/ParallaxBackground'
import { SIGL } from './components/SIGL'
import { useAudioEngine } from './hooks/useAudioEngine'
import { useStorage } from './hooks/useStorage'

export interface ContactInfo {
  name: string
  company: string
  location: string
  phone: string
  email: string
}

export interface TechStack {
  technologies: string[]
  frameworks: string[]
  databases: string[]
  tools: string[]
}

export interface AppSettings {
  theme: 'dark' | 'light'
  audioEnabled: boolean
  notificationsEnabled: boolean
  privacyMode: boolean
  autoSave: boolean
}

const defaultContactInfo: ContactInfo = {
  name: 'Your Name',
  company: 'Your Company',
  location: 'Your Location',
  phone: '+1 (555) 123-4567',
  email: 'your.email@example.com',
}

const defaultTechStack: TechStack = {
  technologies: ['React', 'TypeScript', 'Vite', 'Zustand'],
  frameworks: ['Tailwind CSS', 'Framer Motion', 'React Router'],
  databases: ['IndexedDB', 'localStorage'],
  tools: ['Vite', 'Jest', 'Oxlint'],
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  audioEnabled: true,
  notificationsEnabled: false,
  privacyMode: true,
  autoSave: true,
}

export default function App() {
  const { engine, controls } = useAudioEngine()

  const {
    storedValue: contactInfo,
    setValue: setContactInfo,
  } = useStorage<ContactInfo>('audos-contact-info', defaultContactInfo)

  const {
    storedValue: techStack,
    setValue: setTechStack,
  } = useStorage<TechStack>('audos-tech-stack', defaultTechStack)

  const {
    storedValue: settings,
    setValue: setSettings,
  } = useStorage<AppSettings>('audos-settings', defaultSettings)

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }))
  }

  const togglePrivacyMode = () => {
    setSettings(prev => ({
      ...prev,
      privacyMode: !prev.privacyMode,
    }))
  }

  const toggleAutoSave = () => {
    setSettings(prev => ({
      ...prev,
      autoSave: !prev.autoSave,
    }))
  }

  return (
    <AudioProvider>
      <JournalProvider>
        <CodexProvider>
          <SIGLProvider>
            <div className={`app-container ${settings.theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
              <header className="app-header">
                <div className="header-left">
                  <h1>AUD-OS</h1>
                  <p>A Personal Neuro-Intelligent Web Application</p>
                </div>

                <div className="header-right">
                  <div className="settings-toggle">
                    <button
                      onClick={toggleTheme}
                      className="theme-toggle"
                      title="Toggle Theme"
                    >
                      {settings.theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    <button
                      onClick={togglePrivacyMode}
                      className={`privacy-toggle ${settings.privacyMode ? 'active' : ''}`}
                      title="Toggle Privacy Mode"
                    >
                      🔒
                    </button>

                    <button
                      onClick={toggleAutoSave}
                      className={`autosave-toggle ${settings.autoSave ? 'active' : ''}`}
                      title="Toggle Auto Save"
                    >
                      💾
                    </button>
                  </div>
                </div>
              </header>

              <main className="app-main">
                <div className="left-panel">
                  <AudioControls />
                  <BreathCoach isVisible={true} />
                </div>

                <div className="center-panel">
                  <ParallaxBackground isVisible={true} audioAnalyser={engine?.analyser || null} />
                </div>

                <div className="right-panel">
                  <Sketchpad />
                </div>
              </main>

              <footer className="app-footer">
                <div className="footer-nav">
                  <button className="nav-button active">🎵 Audio</button>
                  <button className="nav-button">🌐 SIGL</button>
                  <button className="nav-button">📓 Codex</button>
                  <button className="nav-button">📝 Journal</button>
                  <button className="nav-button">⚙ Settings</button>
                </div>

                <div className="footer-info">
                  <span>Version 0.1.0</span>
                  <span>© 2024 AUD-OS</span>
                </div>
              </footer>
            </div>
          </SIGLProvider>
        </CodexProvider>
      </JournalProvider>
    </AudioProvider>
  )
}
