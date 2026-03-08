import React, { useState } from 'react'
import { Button } from '../ui/Button'
interface ToggleProps {
    label: string
    description: string
    defaultChecked?: boolean
}
function Toggle({ label, description, defaultChecked = false }: ToggleProps) {
    const [checked, setChecked] = useState(defaultChecked)
    return (
        <div className="flex items-start justify-between py-4">
            <div>
                <h4 className="text-sm font-medium text-slate-900">{label}</h4>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            <button
                type="button"
                onClick={() => setChecked(!checked)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${checked ? 'bg-violet-600' : 'bg-slate-200'}`}
            >
        <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
            </button>
        </div>
    )
}
export function NotificationSettings() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Notifications</h2>
                <p className="text-sm text-slate-500">
                    Choose how and when you want to be notified.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Email Notifications
                    </h3>
                    <p className="text-sm text-slate-500">
                        Receive updates directly to your inbox.
                    </p>
                </div>
                <div className="p-6 divide-y divide-slate-100">
                    <Toggle
                        label="Daily Summary"
                        description="Get a daily digest of tasks completed and upcoming schedule."
                        defaultChecked={true}
                    />
                    <Toggle
                        label="Task Updates"
                        description="Receive an email when IVA completes a major task."
                        defaultChecked={true}
                    />
                    <Toggle
                        label="New Messages"
                        description="Get notified when you receive a new message or mention."
                        defaultChecked={false}
                    />
                    <Toggle
                        label="Marketing & Updates"
                        description="Receive news about product updates and new features."
                        defaultChecked={false}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Push Notifications
                    </h3>
                    <p className="text-sm text-slate-500">
                        Receive alerts on your device.
                    </p>
                </div>
                <div className="p-6 divide-y divide-slate-100">
                    <Toggle
                        label="Meeting Reminders"
                        description="Get notified 10 minutes before a scheduled meeting."
                        defaultChecked={true}
                    />
                    <Toggle
                        label="Urgent Tasks"
                        description="Receive alerts for high-priority tasks that need your attention."
                        defaultChecked={true}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Preferences</Button>
            </div>
        </div>
    )
}
