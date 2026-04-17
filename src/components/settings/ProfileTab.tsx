import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { SettingsSection } from './SettingsSection'
import { api } from '../../services/api.ts'
import { SettingsRow } from './SettingsRow'

type Props = {
    user?: {
        username: string
        email: string
        fullName?: string
        bio?: string
        jobTitle?: string
        location?: string
        website?: string
        avatarInitial?: string
    }
}

export function ProfileTab({ user }: Props) {
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        fullName: user?.fullName ?? '',
        username: user?.username ?? '',
        email: user?.email ?? '',
        bio: user?.bio ?? '',
        jobTitle: user?.jobTitle ?? '',
        location: user?.location ?? '',
        website: user?.website ?? '',
    })

    const handleSave = () => {
        // wire to API

        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const initial = (user?.avatarInitial ?? user?.username?.charAt(0) ?? 'U').toUpperCase()

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Avatar */}
            <SettingsSection tag="01" title="Avatar" accentCorner="tl">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="w-16 h-16 border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
                            <span className="text-xl font-mono font-bold text-blue-700 dark:text-blue-400">
                                {initial}
                            </span>
                        </div>
                        <button
                            type="button"
                            className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                            aria-label="Change avatar"
                        >
                            <Camera className="h-4 w-4 text-white" />
                        </button>
                    </div>
                    <div>
                        <p className="text-[11px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                            Profile photo
                        </p>
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mb-3">
                            PNG or JPG, max 2 MB
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Upload photo</Button>
                            <Button variant="ghost" size="sm">Remove</Button>
                        </div>
                    </div>
                </div>
            </SettingsSection>

            {/* Personal info */}
            <SettingsSection tag="02" title="Personal Information" accentCorner="tl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Full Name"
                        name="fullName"
                        value={form.fullName}
                        onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
                        placeholder="Dennis Wong"
                    />
                    <Input
                        label="Username"
                        name="username"
                        value={form.username}
                        onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                        placeholder="dennisw"
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                    />
                    <Input
                        label="Job Title"
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={(e) => setForm(f => ({ ...f, jobTitle: e.target.value }))}
                        placeholder="Product Manager"
                    />
                    <Input
                        label="Location"
                        name="location"
                        value={form.location}
                        onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="San Francisco, CA"
                    />
                    <Input
                        label="Website"
                        name="website"
                        type="url"
                        value={form.website}
                        onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))}
                        placeholder="https://yoursite.com"
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest font-mono">
                        Bio
                    </label>
                    <textarea
                        value={form.bio}
                        onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                        rows={3}
                        placeholder="A short bio visible on your profile…"
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm font-mono text-neutral-900 dark:text-white px-3 py-2 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-150 resize-none rounded-sm"
                        maxLength={200}
                    />
                    <p className="mt-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 text-right">
                        {form.bio.length} / 200
                    </p>
                </div>
            </SettingsSection>

            {/*/!* Target role *!/*/}
            {/*<SettingsSection tag="03" title="Career Focus" description="Used to personalise interview questions" accentCorner="tl">*/}
            {/*    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}
            {/*        <div>*/}
            {/*            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest font-mono">*/}
            {/*                Target Role*/}
            {/*            </label>*/}
            {/*            <select className="w-full h-10 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm font-mono text-neutral-900 dark:text-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 rounded-sm appearance-none cursor-pointer">*/}
            {/*                <option>Product Manager</option>*/}
            {/*                <option>Software Engineer</option>*/}
            {/*                <option>Data Analyst</option>*/}
            {/*                <option>Product Designer</option>*/}
            {/*                <option>Engineering Manager</option>*/}
            {/*                <option>Other</option>*/}
            {/*            </select>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest font-mono">*/}
            {/*                Experience Level*/}
            {/*            </label>*/}
            {/*            <select className="w-full h-10 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm font-mono text-neutral-900 dark:text-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 rounded-sm appearance-none cursor-pointer">*/}
            {/*                <option>Entry level (0–2 yrs)</option>*/}
            {/*                <option>Mid level (2–5 yrs)</option>*/}
            {/*                <option>Senior (5–8 yrs)</option>*/}
            {/*                <option>Staff / Principal (8+ yrs)</option>*/}
            {/*            </select>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</SettingsSection>*/}

            {/* Save bar */}
            <div className="flex items-center justify-between px-5 py-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                    Changes are saved to your account
                </p>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={handleSave}
                    leftIcon={saved ? <Check className="h-3.5 w-3.5" /> : undefined}
                >
                    {saved ? 'Saved!' : 'Save changes'}
                </Button>
            </div>
        </motion.div>
    )
}