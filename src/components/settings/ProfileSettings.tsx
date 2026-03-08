import React from 'react'
import { Camera } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface ProfileProps {
    username?: string
    email?: string
}

export function ProfileSettings(
    props: ProfileProps
) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Profile Settings
                </h2>
                <p className="text-sm text-slate-500">
                    Manage your personal information and preferences.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    Personal Information
                </h3>

                <div className="flex flex-col sm:flex-row gap-8 mb-8">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-2xl font-bold overflow-hidden group">
                            SC
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Change Avatar
                        </Button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <Input
                                label="Username"
                                type="username"
                                defaultValue={props.username}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Input
                                label="Email Address"
                                type="email"
                                defaultValue={props.email}
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    )
}
