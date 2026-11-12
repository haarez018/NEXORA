"use client";
export default function ErrorBoundary({reset}:{reset:()=>void}){return <div className="center-state"><p className="eyebrow">WORKSPACE UNAVAILABLE</p><h1>We couldn’t load this view.</h1><p>Try again. If the issue persists, check server configuration and database connectivity.</p><button className="button button-primary" onClick={reset}>Try again</button></div>;}
