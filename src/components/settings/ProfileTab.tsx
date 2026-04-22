import React, {useState, useEffect} from 'react'
import {motion} from 'framer-motion'
import {AlertTriangle, Camera, Check} from 'lucide-react'
import {Button} from '../ui/Button'
import {Input} from '../ui/Input'
import {SettingsSection} from './SettingsSection'
import {api} from '../../services/api'
import {useAuth} from '../../context/AuthContext'

const EXPERIENCE_OPTIONS = [
    {value: 'JUNIOR', label: 'Entry level (0–2 yrs)'},
    {value: 'MID', label: 'Mid level (2–5 yrs)'},
    {value: 'SENIOR', label: 'Senior (5–8 yrs)'},
    {value: 'LEAD', label: 'Staff / Lead (8+ yrs)'},
]

const TARGET_ROLE_OPTIONS = [
    'Software Engineer', 'Product Manager', 'Data Analyst',
    'Product Designer', 'Engineering Manager', 'Data Scientist',
    'DevOps Engineer', 'Other',
]

export function ProfileTab() {
    const {user, refreshUser} = useAuth()

    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        jobTitle: '',
        company: '',
        location: '',
        experienceLevel: 'MID',
        bio: '',
        website: '',
    })

    // Populate form when user loads / refreshes
    useEffect(() => {
        if (!user) return
        setForm(f => ({
            ...f,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            username: user.username ?? '',
            email: user.email ?? '',
            jobTitle: user.jobTitle ?? '',
            company: user.company ?? '',
            location: user.location ?? '',
            experienceLevel: user.experienceLevel ?? 'MID',
        }))
    }, [user])

    // Track whether identity fields changed so we can show the warning
    const usernameChanged = form.username !== (user?.username ?? '')
    const emailChanged = form.email !== (user?.email ?? '')
    const credentialsChanged = usernameChanged || emailChanged

    const handleSave = async () => {
        setError(null)
        setSaving(true)
        try {
            // Identity fields — sent separately via the unified /update-credentials endpoint
            if (credentialsChanged) {
                await api.updateCredentials({
                    ...(usernameChanged ? {username: form.username} : {}),
                    ...(emailChanged ? {email: form.email} : {}),
                })
            }

            // Profile fields — low-stakes, no uniqueness constraints
            await api.updateProfile({
                firstName: form.firstName || undefined,
                lastName: form.lastName || undefined,
                jobTitle: form.jobTitle || undefined,
                company: form.company || undefined,
                location: form.location || undefined,
                experienceLevel: form.experienceLevel || undefined,
            })

            await refreshUser()
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save changes.')
        } finally {
            setSaving(false)
        }
    }

    const initial = (user?.firstName?.charAt(0) ?? user?.username?.charAt(0) ?? 'U').toUpperCase()

    return (
        <motion.div
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="space-y-4"
        >
            {/* Avatar */}
            <SettingsSection tag="01" title="Avatar" accentCorner="tl">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div
                            className="w-16 h-16 border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
                            <span className="text-xl font-mono font-bold text-blue-700 dark:text-blue-400">
                                {initial}
                            </span>
                        </div>
                        <button
                            type="button"
                            className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                            aria-label="Change avatar"
                        >
                            <Camera className="h-4 w-4 text-white"/>
                        </button>
                    </div>
                    <div>
                        <p className="text-[11px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Profile
                            photo</p>
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mb-3">PNG or JPG, max
                            2 MB</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Upload photo</Button>
                            <Button variant="ghost" size="sm">Remove</Button>
                        </div>
                    </div>
                </div>
            </SettingsSection>

            {/* Identity fields — username & email */}
            <SettingsSection tag="02" title="Account Identity" description="Used for login and notifications"
                             accentCorner="tl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Username"
                        name="username"
                        value={form.username}
                        onChange={(e) => setForm(f => ({...f, username: e.target.value}))}
                        placeholder="janedoe"
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(f => ({...f, email: e.target.value}))}
                        placeholder="you@example.com"
                    />
                </div>

                {/* Warn when either identity field has been modified */}
                {credentialsChanged && (
                    <div
                        className="mt-3 flex items-start gap-2 px-3 py-2.5 border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0"/>
                        <p className="text-[10px] font-mono text-amber-600 dark:text-amber-400 leading-relaxed">
                            {emailChanged && usernameChanged
                                ? 'Username and email are used for login. Both will be updated on save.'
                                : emailChanged
                                    ? 'Email is used for login and notifications. It will be updated on save.'
                                    : 'Username is public-facing and unique. It will be updated on save.'}
                        </p>
                    </div>
                )}
            </SettingsSection>

            {/* Personal info */}
            <SettingsSection tag="03" title="Personal Information" accentCorner="tl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" name="firstName" value={form.firstName}
                           onChange={(e) => setForm(f => ({...f, firstName: e.target.value}))} placeholder="Jane"/>
                    <Input label="Last Name" name="lastName" value={form.lastName}
                           onChange={(e) => setForm(f => ({...f, lastName: e.target.value}))} placeholder="Doe"/>
                    <Input label="Job Title" name="jobTitle" value={form.jobTitle}
                           onChange={(e) => setForm(f => ({...f, jobTitle: e.target.value}))}
                           placeholder="Software Engineer"/>
                    <Input label="Company" name="company" value={form.company}
                           onChange={(e) => setForm(f => ({...f, company: e.target.value}))} placeholder="Acme Corp"/>
                    <Input label="Location" name="location" value={form.location}
                           onChange={(e) => setForm(f => ({...f, location: e.target.value}))}
                           placeholder="San Francisco, CA"/>
                    <Input label="Website" name="website" type="url" value={form.website}
                           onChange={(e) => setForm(f => ({...f, website: e.target.value}))}
                           placeholder="https://yoursite.com"/>
                </div>
                <div className="mt-4">
                    <label
                        className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest font-mono">Bio</label>
                    <textarea
                        value={form.bio}
                        onChange={(e) => setForm(f => ({...f, bio: e.target.value}))}
                        rows={3}
                        placeholder="A short bio visible on your profile…"
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm font-mono text-neutral-900 dark:text-white px-3 py-2 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-150 resize-none rounded-sm"
                        maxLength={200}
                    />
                    <p className="mt-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 text-right">{form.bio.length} /
                        200</p>
                </div>
            </SettingsSection>

            {/* Career focus */}
            <SettingsSection tag="04" title="Career Focus" description="Used to personalise interview questions"
                             accentCorner="tl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest font-mono">Target
                            Role</label>
                        <select
                            value={form.jobTitle}
                            onChange={(e) => setForm(f => ({...f, jobTitle: e.target.value}))}
                            className="w-full h-10 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm font-mono text-neutral-900 dark:text-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 rounded-sm appearance-none cursor-pointer"
                        >
                            {TARGET_ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest font-mono">Experience
                            Level</label>
                        <select
                            value={form.experienceLevel}
                            onChange={(e) => setForm(f => ({...f, experienceLevel: e.target.value}))}
                            className="w-full h-10 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm font-mono text-neutral-900 dark:text-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 rounded-sm appearance-none cursor-pointer"
                        >
                            {EXPERIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>
            </SettingsSection>

            {error && (
                <p className="text-[11px] font-mono text-red-500 border border-red-200 dark:border-red-900/70 bg-red-50/60 dark:bg-red-950/30 px-3 py-2">{error}</p>
            )}

            <div
                className="flex items-center justify-between px-5 py-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">Changes
                    are saved to your account</p>
                <Button variant="secondary" size="md" onClick={handleSave} isLoading={saving}
                        leftIcon={saved ? <Check className="h-3.5 w-3.5"/> : undefined}>
                    {saved ? 'Saved!' : 'Save changes'}
                </Button>
            </div>
        </motion.div>
    )
}