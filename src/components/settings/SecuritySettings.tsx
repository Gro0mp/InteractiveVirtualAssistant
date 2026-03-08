import React from 'react'
import { Shield } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
export function SecuritySettings() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Security</h2>
                <p className="text-sm text-slate-500">
                    Manage your password and account security.
                </p>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    Change Password
                </h3>
                <div className="space-y-4 max-w-md">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                    <Button className="mt-2">Update Password</Button>
                </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-xl">
                                Add an extra layer of security to your account by requiring a
                                code from your mobile device when logging in.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                </div>
            </div>
        </div>
    )
}
