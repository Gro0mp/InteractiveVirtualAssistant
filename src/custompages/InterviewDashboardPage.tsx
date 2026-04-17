import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {motion} from 'framer-motion'
import {DashboardLayout} from '../components/DashboardLayout'
import type {Stat} from '../components/interview-dashboard/InterviewStatsBar'
import {InterviewStatsBar} from '../components/interview-dashboard/InterviewStatsBar'
import type {ScorePoint} from '../components/interview-dashboard/InterviewScoreChart'
import {InterviewScoreChart} from '../components/interview-dashboard/InterviewScoreChart'
import type {Skill} from '../components/interview-dashboard/InterviewSkillsBreakdown'
import {InterviewSkillsBreakdown} from '../components/interview-dashboard/InterviewSkillsBreakdown'
import {InterviewRecentSessions} from '../components/interview-dashboard/InterviewRecentSessions'
import type {Tip} from '../components/interview-dashboard/InterviewTipCard'
import {InterviewTipCard} from '../components/interview-dashboard/InterviewTipCard'
import {InterviewQuickStart} from '../components/interview-dashboard/InterviewQuickStart'

import type {InterviewSessionResponse} from "../services/api"
import {api, type InterviewFeedbackResponse} from '../services/api'

// ─── Mock data (replace with API calls) ────────────────────────────────────────


function buildStatsFromSessionsFeedback(sessions: InterviewFeedbackResponse[]): Stat[] {
    const totalSessions = sessions.length
    const avgScore = sessions.map(s => s.overallScore).reduce((a, b) => a + b, 0) / (totalSessions || 1)
    const completionRate = totalSessions ? (sessions.filter(s => s.completedAt).length / totalSessions) : 0
    const currentStreak = sessions
        .map(s => s.completedAt ? new Date(s.completedAt) : null)
        .filter(d => d)
        .sort((a, b) => b!.getTime() - a!.getTime())
        .reduce((streak, date, i, arr) => {
            if (i === 0) return 1
            const diffDays = (arr[i - 1]!.getTime() - date!.getTime()) / (1000 * 60 * 60 * 24)
            return diffDays <= 1 ? streak + 1 : streak
        }, 0)

    return [
        {
            label: 'Total Sessions',
            value: totalSessions,
            tag: 'sessions',
            sub: 'this month',
        },
        {
            label: 'Avg Score',
            value: Math.round(avgScore),
            tag: '/ 100',
            sub: 'vs last month',
        },
        {
            label: 'Completion Rate',
            value: `${Math.round(completionRate * 100)}%`,
            trend: 'neutral',
            sub: 'of sessions finished',
        },
        {
            label: 'Current Streak',
            value: currentStreak,
            tag: 'days',
            sub: 'keep doing more interviews',
        },
    ]
}

function buildScoreHistoryFromSessionsFeedback(sessions: InterviewFeedbackResponse[]): ScorePoint[] {
    return sessions.filter(s => s.completedAt)
        .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())
        .map(s => ({
            sessionTitle: s.sessionTitle,
            overallScore: s.overallScore,
            completedAt: new Date(s.completedAt!).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        }))
}

function buildSkillsFromSessionsFeedback(sessions: InterviewFeedbackResponse[]): Skill[] {
    const completed = sessions
        .filter((s) => Boolean(s.completedAt))
        .sort(
            (a, b) =>
                new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
        ) // newest first

    // No completed sessions yet -> empty
    if (completed.length === 0) return []

    const latest = completed[0] // most recent session's scores
    const prev = completed[1] // optional

    return [
        {
            label: 'Communication',
            score: latest.communicationScore,
            prevScore: prev?.communicationScore,
        },
        {
            label: 'Technical Depth',
            score: latest.technicalDepthScore,
            prevScore: prev?.technicalDepthScore,
        },
        {
            label: 'Confidence',
            score: latest.confidenceScore,
            prevScore: prev?.confidenceScore,
        },
        {
            label: 'Clarity',
            score: latest.clarityScore,
            prevScore: prev?.clarityScore,
        },
        {
            label: 'Problem Solving',
            score: latest.problemSolvingScore,
            prevScore: prev?.problemSolvingScore,
        },
    ]
}

// 5 tips to make your tip sticky
const TIPS: Tip[] = [
    {
        category: 'Structure',
        headline: 'Use the STAR method for every behavioural question.',
        body: 'Situation → Task → Action → Result. Keep each segment tight. Interviewers lose interest when context outruns impact.',
    },
    {
        category: 'Confidence',
        headline: 'Pause before you answer — it signals calm authority.',
        body: 'A 2-second pause feels natural to the listener and gives you time to structure your response. Most candidates rush and ramble.',
    },
    {
        category: 'Technical',
        headline: 'Think out loud when problem-solving.',
        body: 'Interviewers score your reasoning process, not just the final answer. Narrate your assumptions so they can guide you if you drift.',
    },
    {
        category: 'Negotiation',
        headline: 'Let the employer anchor the compensation first.',
        body: 'If pressed, give a range with your target at the bottom. "I\'m targeting $X–$Y based on my research and experience" keeps you in control.',
    },
    {
        category: 'Closing',
        headline: 'Always end with a prepared, insightful question.',
        body: 'Ask about a real challenge the team is solving or a recent strategic decision. It shows you\'ve done homework and positions you as a peer.',
    },
]

// ─── Page ──────────────────────────────────────────────────────────────────────

export function InterviewDashboardPage() {
    const router = useRouter()
    const [sessions, setSessions] = useState<InterviewSessionResponse[]>([])
    const [feedbackHistory, setFeedbackHistory] = useState<InterviewFeedbackResponse[]>([])

    useEffect(() => {
        api.getInterviewSessions().then(setSessions).catch((err) => {
            console.error('Failed to fetch sessions:', err)
            setSessions([]) // fallback to empty state on error
        })
    }, [])

    useEffect(() => {
        api.getAllInterviewFeedback().then(setFeedbackHistory).catch((err) => {
            console.error('Failed to fetch feedback history:', err)
            setFeedbackHistory([]) // fallback to empty state on error
        })
    }, [])


    const statsHistory = buildStatsFromSessionsFeedback(feedbackHistory)
    const scoreHistory = buildScoreHistoryFromSessionsFeedback(feedbackHistory)
    const skillsHistory = buildSkillsFromSessionsFeedback(feedbackHistory)


    const handleOpenSession = (id: number) => router.push(`/interview/${id}`)
    const handleViewFeedback = (id: number) => router.push(`/interview/${id}/feedback`)
    const handleNewSession = () => router.push('/interview')
    const handleDeleteSession = async (id: number) => {
        await api.deleteInterviewSession(id)
    }

    return (
        <DashboardLayout>
            <div className="relative min-h-full font-mono">
                {/* Grid texture */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <defs>
                        <pattern id="dash-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dash-grid)"
                          className="text-neutral-900 dark:text-white"/>
                </svg>

                {/* Blue ambient glow */}
                <div
                    className="absolute top-0 right-1/4 w-[500px] h-64 bg-blue-400/5 dark:bg-blue-600/8 blur-[100px] pointer-events-none"
                    aria-hidden
                />

                <div className="relative space-y-4 pb-8">
                    {/* ── Page header ── */}
                    <motion.div
                        initial={{opacity: 0, y: -6}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.35}}
                        className="flex items-end justify-between gap-4 pt-1 pb-2 border-b border-neutral-200 dark:border-neutral-800"
                    >
                        <div>
                            <p className="text-[9px] font-mono font-medium text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-1">
                                Interview Practice
                            </p>
                            <h1
                                className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight"
                                style={{fontFamily: "'DM Mono', monospace"}}
                            >
                                Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 pb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>
                            <span
                                className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                                Live data
                            </span>
                        </div>
                    </motion.div>

                    {/* ── Stats bar ── */}
                    <motion.div
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4, delay: 0.05}}
                    >
                        <InterviewStatsBar stats={statsHistory}/>
                    </motion.div>

                    {/* ── Row 2: Score chart + Skills breakdown ── */}
                    <motion.div
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4, delay: 0.1}}
                        className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4"
                    >
                        <InterviewScoreChart data={scoreHistory} averageScore={75}/>
                        <InterviewSkillsBreakdown skills={skillsHistory}/>
                    </motion.div>

                    {/* ── Row 3: Quick start + Tip card ── */}
                    <motion.div
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4, delay: 0.15}}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <InterviewQuickStart
                            onNewSession={handleNewSession}
                            onResumeSession={handleOpenSession}
                            completedThisWeek={4}
                            weeklyGoal={5}
                        />
                        <InterviewTipCard tips={TIPS}/>
                    </motion.div>

                    {/* ── Row 4: Recent sessions table ── */}
                    <motion.div
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4, delay: 0.25}}
                    >
                        <InterviewRecentSessions
                            sessions={sessions}
                            feedbackHistory={feedbackHistory}
                            onViewFeedback={handleViewFeedback}
                            onOpen={handleOpenSession}
                            onDelete={handleDeleteSession}
                        />
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    )
}