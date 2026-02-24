import React from 'react'
import { motion } from 'framer-motion'
import {
    Sparkles,
    FileText,
    Languages,
    Wand2,
    List,
    Search,
    ArrowRight,
} from 'lucide-react'
import { Button } from '../ui/Button'

const tools = [
    {
        id: 'summarize',
        icon: List,
        title: 'Summarize',
        description: 'Generate a concise summary of the document.',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        id: 'rewrite',
        icon: Wand2,
        title: 'Rewrite & Improve',
        description: 'Enhance clarity, tone, and readability.',
        color: 'text-violet-600',
        bg: 'bg-violet-50',
    },
    {
        id: 'grammar',
        icon: FileText,
        title: 'Fix Grammar',
        description: 'Correct spelling and grammatical errors.',
        color: 'text-green-600',
        bg: 'bg-green-50',
    },
    {
        id: 'translate',
        icon: Languages,
        title: 'Translate',
        description: 'Translate content to another language.',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
    },
    {
        id: 'extract',
        icon: Search,
        title: 'Extract Data',
        description: 'Pull key information and data points.',
        color: 'text-cyan-600',
        bg: 'bg-cyan-50',
    },
]
export function EditorSidebar() {
    return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center space-x-2 mb-1">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    <h2 className="font-bold text-slate-900">AI Assistant</h2>
                </div>
                <p className="text-sm text-slate-500">
                    Select an action to apply to your document.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {tools.map((tool, index) => (
                    <motion.button
                        key={tool.id}
                        initial={{
                            opacity: 0,
                            x: 20,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            delay: index * 0.1,
                        }}
                        className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all group"
                    >
                        <div className="flex items-start space-x-3">
                            <div
                                className={`p-2 rounded-lg ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}
                            >
                                <tool.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-slate-900 group-hover:text-violet-700 transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {tool.description}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Custom Command
                </label>
                <div className="space-y-3">
          <textarea
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none h-24"
              placeholder="Ask IVA to do something specific..."
          />
                    <Button
                        className="w-full"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                        Run Command
                    </Button>
                </div>
            </div>
        </div>
    )
}
