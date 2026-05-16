// Framer Code Component — paste into Framer's "Code" component editor
// Fetches CHANGELOG.json from raw GitHub and renders entries.
// v1.5.0

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useState } from "react"

const RAW_URL =
    "https://raw.githubusercontent.com/izored/izored/main/CHANGELOG.json"

const TYPE_CONFIG: Record<string, { color: string; bg: string; emoji: string }> = {
    launch:     { color: "#4ADE80", bg: "#4ADE8022", emoji: "🚀" },
    update:     { color: "#60A5FA", bg: "#60A5FA22", emoji: "✨" },
    fix:        { color: "#FB923C", bg: "#FB923C22", emoji: "🔧" },
    experiment: { color: "#C084FC", bg: "#C084FC22", emoji: "🧪" },
    meta:       { color: "#888888", bg: "#88888822", emoji: "📝" },
}

const DEFAULT_TYPE = { color: "#888888", bg: "#88888822", emoji: "📦" }

type Entry = {
    id: string
    date: string
    version: string | null
    emoji: string | null
    title: string
    description: string
    type: string
    tags: string[]
    project: string | null
    projectUrl: string | null
    releaseUrl: string | null
}

type Props = {
    filterType: string
    filterProject: string
    maxEntries: number
    showDate: boolean
    showType: boolean
    showProject: boolean
    showVersion: boolean
    showEmoji: boolean
    textColor: string
    mutedColor: string
    cardColor: string
    gap: number
    font: string
}

function renderInline(text: string, textColor: string) {
    const segments = text.split("`")
    return segments.map((seg, i) =>
        i % 2 === 1 ? (
            <code
                key={i}
                style={{
                    fontFamily: "monospace",
                    fontSize: "0.92em",
                    background: "rgba(0,0,0,0.06)",
                    borderRadius: 3,
                    padding: "1px 5px",
                    color: textColor,
                }}
            >
                {seg}
            </code>
        ) : (
            <span key={i}>{seg}</span>
        )
    )
}

function renderDescription(raw: string, textColor: string, mutedColor: string) {
    const lines = raw.split("\n")
    const nodes: React.ReactNode[] = []
    let headingCount = 0

    lines.forEach((line, i) => {
        if (!line.trim()) {
            return
        } else if (line.startsWith("## ")) {
            const isFirst = headingCount === 0
            headingCount++
            nodes.push(
                <div
                    key={i}
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: mutedColor,
                        marginTop: isFirst ? 4 : 16,
                        marginBottom: 6,
                        paddingTop: isFirst ? 0 : 12,
                        borderTop: isFirst ? "none" : "1px solid rgba(0,0,0,0.07)",
                    }}
                >
                    {line.replace(/^## /, "")}
                </div>
            )
        } else if (line.startsWith("- ")) {
            nodes.push(
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ color: mutedColor, flexShrink: 0, marginTop: 2, fontSize: 10, opacity: 0.6 }}>–</span>
                    <span style={{ color: mutedColor, fontSize: 12, lineHeight: 1.6 }}>
                        {renderInline(line.replace(/^- /, ""), textColor)}
                    </span>
                </div>
            )
        } else {
            nodes.push(
                <div key={i} style={{ color: mutedColor, fontSize: 12, lineHeight: 1.6 }}>
                    {renderInline(line, textColor)}
                </div>
            )
        }
    })

    return <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>{nodes}</div>
}

export default function ChangelogFeed({
    filterType = "",
    filterProject = "",
    maxEntries = 10,
    showDate = true,
    showType = true,
    showProject = true,
    showVersion = true,
    showEmoji = true,
    textColor = "#111111",
    mutedColor = "#666666",
    cardColor = "rgba(0,0,0,0.04)",
    gap = 20,
    font = "inherit",
}: Props) {
    const [entries, setEntries] = useState<Entry[]>([])
    const [error, setError] = useState(false)

    useEffect(() => {
        fetch(`${RAW_URL}?_=${Date.now()}`)
            .then((r) => r.json())
            .then((data) => setEntries(data.changelog ?? []))
            .catch(() => setError(true))
    }, [])

    const filtered = entries
        .filter((e) => !filterType || e.type === filterType)
        .filter((e) => !filterProject || e.project === filterProject)
        .slice(0, maxEntries)

    if (error) {
        return (
            <div style={{ color: mutedColor, fontFamily: font, fontSize: 13 }}>
                Failed to load changelog.
            </div>
        )
    }

    return (
        <div style={{ position: "relative", fontFamily: font, width: "100%" }}>
            {/* Timeline line */}
            <div style={{
                position: "absolute",
                left: 9,
                top: 20,
                bottom: 20,
                width: 2,
                background: "rgba(0,0,0,0.1)",
                borderRadius: 2,
            }} />

            {filtered.map((entry, idx) => {
                const tc = TYPE_CONFIG[entry.type] ?? DEFAULT_TYPE
                const icon = entry.emoji || tc.emoji

                return (
                    <div
                        key={entry.id}
                        style={{
                            display: "flex",
                            gap: 16,
                            alignItems: "flex-start",
                            marginBottom: idx < filtered.length - 1 ? gap : 0,
                        }}
                    >
                        {/* Dot column */}
                        <div style={{ width: 20, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 16 }}>
                            <div style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: tc.color,
                                boxShadow: `0 0 0 3px ${tc.bg}`,
                                flexShrink: 0,
                            }} />
                        </div>

                        {/* Card */}
                        <div style={{
                            flex: 1,
                            background: cardColor,
                            border: "1px solid rgba(0,0,0,0.07)",
                            borderRadius: 12,
                            padding: "14px 16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}>
                            {/* Meta row */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                {showType && (
                                    <span style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: tc.color,
                                        background: tc.bg,
                                        borderRadius: 4,
                                        padding: "2px 7px",
                                    }}>
                                        {entry.type}
                                    </span>
                                )}
                                {showEmoji && (
                                    <span style={{ fontSize: 15, lineHeight: 1 }}>{icon}</span>
                                )}
                                {showProject && entry.project && (
                                    <a
                                        href={entry.projectUrl ?? undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onMouseEnter={(e) => { e.currentTarget.style.color = tc.color }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = mutedColor }}
                                        style={{ fontSize: 13, color: mutedColor, textDecoration: "none", fontWeight: 700 }}
                                    >
                                        {entry.project}
                                    </a>
                                )}
                                {showVersion && entry.version && (
                                    <a
                                        href={entry.releaseUrl ?? undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: 11, color: mutedColor, textDecoration: "none", opacity: 0.55 }}
                                    >
                                        {entry.version}
                                    </a>
                                )}
                                {showDate && (
                                    <span style={{ fontSize: 10, color: mutedColor, marginLeft: "auto", opacity: 0.55 }}>
                                        {entry.date}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <a
                                href={entry.releaseUrl ?? entry.projectUrl ?? undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 15, fontWeight: 700, color: textColor, lineHeight: 1.3, textDecoration: "none" }}
                            >
                                {entry.title}
                            </a>

                            {/* Description */}
                            {renderDescription(entry.description, textColor, mutedColor)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

addPropertyControls(ChangelogFeed, {
    filterType:    { type: ControlType.String,  title: "Filter type",    defaultValue: "", placeholder: "launch / update / fix / meta" },
    filterProject: { type: ControlType.String,  title: "Filter project", defaultValue: "", placeholder: "OpenMemo" },
    maxEntries:    { type: ControlType.Number,  title: "Max entries",    defaultValue: 10, min: 1, max: 50, step: 1 },
    showDate:      { type: ControlType.Boolean, title: "Show date",      defaultValue: true },
    showType:      { type: ControlType.Boolean, title: "Show type pill", defaultValue: true },
    showProject:   { type: ControlType.Boolean, title: "Show project",   defaultValue: true },
    showVersion:   { type: ControlType.Boolean, title: "Show version",   defaultValue: true },
    showEmoji:     { type: ControlType.Boolean, title: "Show emoji",     defaultValue: true },
    textColor:     { type: ControlType.Color,   title: "Text color",     defaultValue: "#111111" },
    mutedColor:    { type: ControlType.Color,   title: "Muted color",    defaultValue: "#666666" },
    cardColor:     { type: ControlType.Color,   title: "Card color",     defaultValue: "rgba(0,0,0,0.04)" },
    gap:           { type: ControlType.Number,  title: "Gap",            defaultValue: 20, min: 8, max: 64, step: 4 },
    font:          { type: ControlType.String,  title: "Font family",    defaultValue: "inherit" },
})
