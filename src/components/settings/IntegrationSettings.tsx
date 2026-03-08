import React from 'react'
import { Check, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
const integrations = [
    {
        id: 'slack',
        name: 'Slack',
        description: 'Send notifications and updates to Slack channels.',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
        connected: false,
    },
    {
        id: 'google-calender',
        name: 'Google Calendar',
        description: 'Sync your schedule and let IVA manage your meetings.',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
        connected: false,
    },
    {
        id: 'gmail',
        name: 'Notion',
        description: 'Export summaries and notes directly to Notion pages.',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
        connected: false,
    },
    {
        id: 'github',
        name: 'GitHub',
        description: 'Track issues and pull requests automatically.',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
        connected: false,
    },
]
export function IntegrationSettings() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Integrations</h2>
                <p className="text-sm text-slate-500">
                    Connect IVA with your favorite tools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                    <div
                        key={integration.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                                <img
                                    src={integration.icon}
                                    alt={integration.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            {integration.connected ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="w-3 h-3 mr-1" /> Connected
                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  Not Connected
                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {integration.name}
                        </h3>
                        <p className="text-sm text-slate-500 mb-6 flex-1">
                            {integration.description}
                        </p>

                        {integration.connected ? (
                            <Button
                                variant="outline"
                                className="w-full text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                            >
                                Disconnect
                            </Button>
                        ) : (
                            <Button
                                variant="secondary"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                                leftIcon={<Plus className="w-4 h-4" />}
                            >
                                Connect
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
