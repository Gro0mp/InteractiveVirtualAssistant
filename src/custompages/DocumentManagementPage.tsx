import React from 'react'
import { DashboardLayout } from "../components/DashboardLayout.tsx";
import { DocumentUploadArea } from '../components/documents/DocumentUploadArea'
import { motion } from 'framer-motion'

export function DocumentManagementPage() {
    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-8rem)] -m-4 sm:-m-6 lg:-m-8 font-[Manrope]">
                {/* Main Content Area */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden flex flex-col">
                    <div className="mb-6">
                        <motion.h1
                            initial={{
                                opacity: 0,
                                y: -10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="text-2xl font-bold text-slate-900"
                        >
                            Document Editor
                        </motion.h1>
                        <motion.p
                            initial={{
                                opacity: 0,
                                y: -10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.1,
                            }}
                            className="text-slate-600"
                        >
                            Upload a document to analyze, edit, or summarize with AI.
                        </motion.p>
                    </div>

                    <div className="flex-1 min-h-0">
                        <DocumentUploadArea />
                    </div>
                </div>

                {/* Right Sidebar */}
                {/*<motion.div*/}
                {/*    initial={{*/}
                {/*        opacity: 0,*/}
                {/*        x: 20,*/}
                {/*    }}*/}
                {/*    animate={{*/}
                {/*        opacity: 1,*/}
                {/*        x: 0,*/}
                {/*    }}*/}
                {/*    transition={{*/}
                {/*        delay: 0.2,*/}
                {/*    }}*/}
                {/*    className="hidden lg:block h-full border-l border-slate-200"*/}
                {/*>*/}
                {/*    <EditorSidebar />*/}
                {/*</motion.div>*/}
            </div>
        </DashboardLayout>
    )
}
