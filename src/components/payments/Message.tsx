import React from 'react'

export function Message ({ message } : { message : string }) {
    return (
        <section>
            <p>{message}</p>
        </section>
    );
}