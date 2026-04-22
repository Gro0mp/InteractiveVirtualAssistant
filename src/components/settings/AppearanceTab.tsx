import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'
import { SettingsRow } from './SettingsRow'
import { type ThemeMode, useTheme } from '../../context/ThemeContext'

type Density = 'compact' | 'comfortable' | 'spacious'
type FontSize = 'sm' | 'md' | 'lg'
type AccentColor = 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose'

const ACCENT_COLORS: { key: AccentColor; hex: string; label: string }[] = [
    { key: 'blue',   hex: '#2563eb', label: 'Blue' },
    { key: 'indigo', hex: '#4f46e5', label: 'Indigo' },
    { key: 'emerald',hex: '#059669', label: 'Emerald' },
    { key: 'amber',  hex: '#d97706', label: 'Amber' },
    { key: 'rose',   hex: '#e11d48', label: 'Rose' },
]

const THEME_OPTIONS: { key: ThemeMode; label: string; description: string }[] = [
    { key: 'light',  label: 'Light',  description: 'Always use light mode' },
    { key: 'dark',   label: 'Dark',   description: 'Always use dark mode' },
    { key: 'system', label: 'System', description: 'Match your OS setting' },
]

export function AppearanceTab() {
    const { themeMode, setThemeMode } = useTheme()

    const [density, setDensity] = useState<Density>('comfortable')
    const [fontSize, setFontSize] = useState<FontSize>('md')
    const [accent, setAccent] = useState<AccentColor>('blue')
    const [reducedMotion, setReducedMotion] = useState(false)
    const [highContrast, setHighContrast] = useState(false)
    const [sidebarLabels, setSidebarLabels] = useState(true)
    const [saved, setSaved] = useState(false)

    // Theme selection is applied immediately via ThemeContext (persisted in localStorage).
    // Other layout/accessibility options show a save confirmation for UX feedback.
    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Theme */}
            <SettingsSection tag="01" title="Theme" accentCorner="tl">
                <div className="grid grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800">
                    {THEME_OPTIONS.map((opt) => {
                        const isActive = themeMode === opt.key
                        return (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => setThemeMode(opt.key)}
                                className={[
                                    'relative p-4 text-left transition-colors duration-150',
                                    isActive
                                        ? 'bg-blue-600'
                                        : 'bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900',
                                ].join(' ')}
                            >
                                {/* Mini preview */}
                                <div className={[
                                    'w-full h-12 border mb-3 flex overflow-hidden',
                                    opt.key === 'dark'
                                        ? 'bg-neutral-950 border-neutral-800'
                                        : opt.key === 'light'
                                            ? 'bg-white border-neutral-200'
                                            : 'border-neutral-300 dark:border-neutral-700',
                                ].join(' ')}>
                                    {/* Sidebar sliver */}
                                    <div className={[
                                        'w-5 h-full border-r',
                                        opt.key === 'dark' ? 'bg-neutral-900 border-neutral-800' :
                                            opt.key === 'light' ? 'bg-neutral-50 border-neutral-200' :
                                                'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800',
                                    ].join(' ')} />
                                    <div className="flex-1 p-2 flex flex-col gap-1">
                                        <div className={`h-1 w-10 rounded-sm ${opt.key === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                                        <div className={`h-1 w-7 rounded-sm ${opt.key === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                                        <div className="mt-1 h-1 w-4 rounded-sm bg-blue-500" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-[11px] font-mono font-semibold ${isActive ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'}`}>
                                            {opt.label}
                                        </p>
                                        <p className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-blue-200' : 'text-neutral-400 dark:text-neutral-600'}`}>
                                            {opt.description}
                                        </p>
                                    </div>
                                    {isActive && <Check className="h-3.5 w-3.5 text-white" />}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </SettingsSection>

            {/* Accent color */}
            <SettingsSection tag="02" title="Accent Color" accentCorner="tr">
                <SettingsRow label="Interface accent" description="Applied to buttons, links, and active states">
                    <div className="flex items-center gap-2">
                        {ACCENT_COLORS.map((c) => (
                            <button
                                key={c.key}
                                type="button"
                                onClick={() => setAccent(c.key)}
                                aria-label={c.label}
                                className="w-6 h-6 border-2 transition-all duration-150 flex items-center justify-center"
                                style={{
                                    backgroundColor: c.hex,
                                    borderColor: accent === c.key ? c.hex : 'transparent',
                                    outline: accent === c.key ? `2px solid ${c.hex}` : 'none',
                                    outlineOffset: '2px',
                                }}
                            >
                                {accent === c.key && <Check className="h-3 w-3 text-white" />}
                            </button>
                        ))}
                    </div>
                </SettingsRow>
            </SettingsSection>

            {/* Layout density */}
            <SettingsSection tag="03" title="Layout" accentCorner="tl">
                <SettingsRow label="Density" description="Controls spacing and padding throughout the UI">
                    <div className="flex border border-neutral-200 dark:border-neutral-800 divide-x divide-neutral-200 dark:divide-neutral-800">
                        {(['compact', 'comfortable', 'spacious'] as Density[]).map((d) => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => setDensity(d)}
                                className={[
                                    'px-3 py-1.5 text-[9px] font-mono font-semibold uppercase tracking-widest transition-colors duration-150 capitalize',
                                    density === d
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white',
                                ].join(' ')}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </SettingsRow>

                <SettingsRow label="Font size" description="Base text size across the interface">
                    <div className="flex border border-neutral-200 dark:border-neutral-800 divide-x divide-neutral-200 dark:divide-neutral-800">
                        {([
                            { key: 'sm' as FontSize, label: 'S' },
                            { key: 'md' as FontSize, label: 'M' },
                            { key: 'lg' as FontSize, label: 'L' },
                        ]).map((opt) => (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => setFontSize(opt.key)}
                                className={[
                                    'w-10 py-1.5 text-[11px] font-mono font-semibold transition-colors duration-150',
                                    fontSize === opt.key
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white',
                                ].join(' ')}
                                aria-label={`Font size ${opt.key}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </SettingsRow>

                <SettingsToggle
                    id="sidebar-labels"
                    label="Sidebar labels"
                    description="Show text labels next to sidebar navigation icons."
                    checked={sidebarLabels}
                    onChange={setSidebarLabels}
                />
            </SettingsSection>

            {/* Accessibility */}
            <SettingsSection tag="04" title="Accessibility" accentCorner="tl">
                <SettingsToggle
                    id="reduced-motion"
                    label="Reduce motion"
                    description="Minimise animations and transitions throughout the interface."
                    checked={reducedMotion}
                    onChange={setReducedMotion}
                />
                <SettingsToggle
                    id="high-contrast"
                    label="High contrast"
                    description="Increase contrast for text and borders to improve readability."
                    checked={highContrast}
                    onChange={setHighContrast}
                />
            </SettingsSection>

            {/* Save */}
            <div className="flex items-center justify-between px-5 py-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                    Theme applies immediately — saved to this device
                </p>
                <Button variant="secondary" size="md" onClick={handleSave}>
                    {saved ? 'Saved!' : 'Save appearance'}
                </Button>
            </div>
        </motion.div>
    )
}