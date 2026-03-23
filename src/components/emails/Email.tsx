import React from "react"

interface EmailProps {
    subject: string
    sender: string
    recipient: string
    body: string
    timestamp: string
}

export function Email(props: EmailProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{props.subject}</h2>
            <p className="text-sm text-slate-500 mb-4">
                From: {props.sender} | To: {props.recipient} | Sent: {new Date(props.timestamp).toLocaleString()}
            </p>
            <div className="text-slate-700 whitespace-pre-wrap">{props.body}</div>
        </div>
    )
}