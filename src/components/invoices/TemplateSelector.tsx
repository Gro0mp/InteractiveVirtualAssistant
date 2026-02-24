import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
const templates = [
    {
        id: 'simple',
        name: 'Simple Clean',
        color: 'bg-slate-100',
        preview: 'border-slate-200',
    },
    {
        id: 'professional',
        name: 'Professional Modern',
        color: 'bg-blue-50',
        preview: 'border-blue-200',
    },
    {
        id: 'blank',
        name: 'Blank Template',
        color: 'bg-violet-50',
        preview: 'border-violet-200',
    },
]
interface TemplateSelectorProps {
    selectedTemplate: string
    onSelect: (id: string) => void
}
export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {templates.map((template) => {
                const isSelected = selectedTemplate === template.id
                return (
                    <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(template.id)}
                        className={`cursor-pointer relative rounded-xl border-2 p-4 transition-all ${
                            isSelected
                                ? 'border-violet-600 ring-2 ring-violet-100'
                                : 'border-slate-200 hover:border-violet-300'
                        }`}
                    >
                        {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center text-white">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                        <div className={`aspect-[3/4] rounded-lg mb-3 ${template.color} border ${template.preview} flex flex-col p-3 gap-2 shadow-sm`}>
                            <div className="h-2 w-1/3 bg-slate-300 rounded opacity-50" />
                            <div className="h-2 w-1/4 bg-slate-300 rounded opacity-30" />
                            <div className="mt-4 space-y-1">
                                <div className="h-1.5 w-full bg-slate-300 rounded opacity-20" />
                                <div className="h-1.5 w-full bg-slate-300 rounded opacity-20" />
                                <div className="h-1.5 w-2/3 bg-slate-300 rounded opacity-20" />
                            </div>
                        </div>
                        <p className={`text-sm font-medium text-center leading-snug min-h-[2.5rem] flex items-center justify-center ${isSelected ? 'text-violet-700' : 'text-slate-600'}`}>
                            {template.name}
                        </p>
                    </motion.div>
                )
            })}
        </div>
    )
}