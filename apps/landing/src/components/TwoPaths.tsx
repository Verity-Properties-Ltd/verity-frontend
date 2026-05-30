"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

const useInView = (threshold = 0.1) => {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])
    return { ref, visible }
}

export default function TwoPaths() {
    const { ref, visible } = useInView()

    return (
        <>
            <section id="two-paths" ref={ref} className="relative bg-white overflow-hidden">

                {/* Background grid */}
                <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <pattern id="tp-grid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
                            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(30,34,96,0.05)" strokeWidth="0.7" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#tp-grid)" />
                </svg>

                <div className="relative z-10 max-w-[1320px] mx-auto px-0 sm:px-12 md:px-16 lg:px-24 py-28 md:py-36">

                    {/* ── Eyebrow ── */}
                    <div className={`flex items-center gap-4 mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                        <span className="block w-7 h-px bg-[var(--gold)] flex-shrink-0" />
                        <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: "var(--navy)" }}>
                            Two paths · Choose your starting point
                        </span>
                    </div>

                    {/* ── Cards Grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* ── CARD I: BUYERS ── */}
                        <div className={`relative flex flex-col border border-[var(--navy)]/12 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

                            {/* Top bar with label */}
                            <div className="flex items-center justify-between px-10 md:px-14 pt-10 md:pt-12 pb-8 border-b border-[var(--navy)]/08">
                                <div className="flex items-center gap-3">
                                    <span className="block w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "var(--navy)" }}>
                                        For Buyers
                                    </span>
                                </div>
                                <span style={{ fontFamily: "var(--f-serif)", fontSize: 13, fontStyle: "italic", color: "var(--gold)" }}>
                                    i.
                                </span>
                            </div>

                            {/* Main content */}
                            <div className="flex flex-col flex-1 px-10 md:px-14 pt-10 pb-12 md:pb-14">

                                {/* Large serif numeral — decorative */}
                                {/* <div
                                    className="select-none leading-none mb-8"
                                    style={{
                                        fontFamily: "var(--f-serif)",
                                        fontSize: "clamp(80px, 10vw, 130px)",
                                        fontWeight: 400,
                                        fontStyle: "italic",
                                        color: "rgba(30,34,96,0.05)",
                                        lineHeight: 1,
                                        marginLeft: "-4px",
                                    }}
                                >
                                    01
                                </div> */}

                                <h2 style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--navy)" }} className="mb-3">
                                    Buying property in Lagos,
                                </h2>
                                <h2 style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, fontStyle: "italic", color: "var(--gold)" }} className="mb-10">
                                    at home or abroad?
                                </h2>

                                <p style={{ fontFamily: "var(--f-sans)", fontSize: 15.5, lineHeight: 1.8, color: "var(--slate)", fontWeight: 400 }} className="flex-1 mb-12">
                                    Forged documents. The same plot sold to two buyers. Lawyers
                                    who can&apos;t access the registry. We&apos;re building
                                    independent property verification you can trust before you
                                    wire money. Join the waitlist — first cohort gets priority access.
                                </p>

                                {/* CTA button */}
                                <Link
                                    href="#form-section"
                                    className="tp-cta-light group self-start flex items-center gap-3 px-6 py-3.5 border border-[var(--navy)] transition-all duration-200"
                                    style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.20em", textTransform: "uppercase" as const, color: "var(--cream)", backgroundColor: "var(--navy)" }}
                                >
                                    Join the buyer waitlist
                                    <span className="tp-arrow transition-transform duration-200">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* ── CARD II: DEVELOPERS ── */}
                        <div className={`relative flex flex-col bg-[var(--navy)] border border-[var(--navy)] transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

                            {/* Subtle radial glow */}
                            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(201,169,97,0.08) 0%, transparent 60%)" }} />

                            {/* Inner grid */}
                            <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none">
                                <defs>
                                    <pattern id="dev-grid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
                                        <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(201,169,97,0.06)" strokeWidth="0.7" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#dev-grid)" />
                            </svg>

                            {/* Top bar with label */}
                            <div className="relative z-10 flex items-center justify-between px-10 md:px-14 pt-10 md:pt-12 pb-8 border-b border-[var(--gold)]/12">
                                <div className="flex items-center gap-3">
                                    <span className="block w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "var(--gold)" }}>
                                        For Developers
                                    </span>
                                </div>
                                <span style={{ fontFamily: "var(--f-serif)", fontSize: 13, fontStyle: "italic", color: "rgba(201,169,97,0.5)" }}>
                                    ii.
                                </span>
                            </div>

                            {/* Main content */}
                            <div className="relative z-10 flex flex-col flex-1 px-10 md:px-14 pt-10 pb-12 md:pb-14">

                                {/* Large serif numeral — decorative */}
                                {/* <div
                                    className="select-none leading-none mb-8"
                                    style={{
                                        fontFamily: "var(--f-serif)",
                                        fontSize: "clamp(80px, 10vw, 130px)",
                                        fontWeight: 400,
                                        fontStyle: "italic",
                                        color: "rgba(201,169,97,0.07)",
                                        lineHeight: 1,
                                        marginLeft: "-4px",
                                    }}
                                >
                                    02
                                </div> */}

                                <h2 style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--cream)" }} className="mb-3">
                                    Active portfolio,
                                </h2>
                                <h2 style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, fontStyle: "italic", color: "var(--gold)" }} className="mb-10">
                                    buyers who hesitate?
                                </h2>

                                <p style={{ fontFamily: "var(--f-sans)", fontSize: 15.5, lineHeight: 1.8, color: "rgba(245,242,237,0.72)", fontWeight: 400 }} className="flex-1 mb-12">
                                    Our Founding 50 program is admitting Lagos developers now.
                                    Verified portfolio inventory, Founding Partner badge on every
                                    certificate, priority access to the Bank API and Marketplace
                                    when they launch. Limited cohort.
                                </p>

                                {/* CTA button */}
                                <Link
                                    href="#form-section"
                                    className="tp-cta-dark group self-start flex items-center gap-3 px-6 py-3.5 border border-[var(--gold)] transition-all duration-200"
                                    style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.20em", textTransform: "uppercase" as const, color: "var(--navy)", backgroundColor: "var(--gold)" }}
                                >
                                    Apply for Founding 50
                                    <span className="tp-arrow transition-transform duration-200">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <style>{`
                .tp-cta-light:hover { background-color: var(--navy-deep) !important; border-color: var(--navy-deep) !important; }
                .tp-cta-dark:hover { background-color: var(--gold-deep) !important; border-color: var(--gold-deep) !important; }
                .tp-cta-light:hover .tp-arrow,
                .tp-cta-dark:hover .tp-arrow { transform: translateX(4px); }
            `}</style>
        </>
    )
}