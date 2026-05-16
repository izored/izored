// Framer Code Component — paste into Framer's "Code" component editor
// Fetches CHANGELOG.json from raw GitHub and renders entries.

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
    gap: number
    font: string
}

// Renders inline backtick code spans
function renderInline(text: string, textColor: string) {
    const segments = text.split("`")
    return segments.map((seg, i) =>
        i % 2 === 1 ? (
            <code
                key={i}
                style={{
                    fontFamily: "monospace",
                    fontSize: "0.92em",
                    background: "rgba(255,255,255,0.08)",
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

// Parses description markdown into React nodes
function renderDescription(raw: string, textColor: string, mutedColor: string) {
    const lines = raw.split("\n")
    const nodes: React.ReactNode[] = []

    lines.forEach((line, i) => {
        if (!line.trim()) {
            nodes.push(<div key={i} style={{ height: 4 }} />)
        } else if (line.startsWith("## ")) {
            nodes.push(
                <div
                    key={i}
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: mutedColor,
                        marginTop: i === 0 ? 0 : 8,
                        marginBottom: 2,
                    }}
                >
                    {line.replace(/^## /, "")}
                </div>
            )
        } else if (line.startsWith("- ")) {
            nodes.push(
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ color: mutedColor, flexShrink: 0, marginTop: 1, fontSize: 11 }}>–</span>
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

    return <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{nodes}</div>
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
    textColor = "#ffffff",
    mutedColor = "#888888",
    gap = 24,
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
        <div style={{ display: "flex", flexDirection: "column", gap, fontFamily: font, width: "100%" }}>
            {filtered.map((entry) => {
                const tc = TYPE_CONFIG[entry.type] ?? DEFAULT_TYPE
                const icon = entry.emoji || tc.emoji

                return (
                    <div key={entry.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {showEmoji && (
                            <div style={{ fontSize: 20, lineHeight: 1, marginTop: 2, flexShrink: 0, width: 28, textAlign: "center" }}>
                                {icon}
                            </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
                            {/* Meta row */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                {showType && (
                                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: tc.color, background: tc.bg, borderRadius: 4, padding: "2px 7px" }}>
                                        {entry.type}
                                    </span>
                                )}
                                {showProject && entry.project && (
                                    <a
                                        href={entry.projectUrl ?? undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onMouseEnter={(e) => { e.currentTarget.style.color = tc.color; e.currentTarget.style.textDecoration = "underline" }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = mutedColor; e.currentTarget.style.textDecoration = "none" }}
                                        style={{ fontSize: 11, color: mutedColor, textDecoration: "none", fontWeight: 500 }}
                                    >
                                        {entry.project}
                                    </a>
                                )}
                                {showVersion && entry.version && (
                                    <a href={entry.releaseUrl ?? undefined} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: mutedColor, textDecoration: "none", opacity: 0.7 }}>
                                        {entry.version}
                                    </a>
                                )}
                                {showDate && (
                                    <span style={{ fontSize: 10, color: mutedColor, marginLeft: "auto", opacity: 0.7 }}>
                                        {entry.date}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <a
                                href={entry.releaseUrl ?? entry.projectUrl ?? undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 15, fontWeight: 600, color: textColor, lineHeight: 1.3, textDecoration: "none" }}
                            >
                                {entry.title}
                            </a>

                            {/* Description — parsed markdown */}
                            {renderDescription(entry.description, textColor, mutedColor)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

addPropertyControls(ChangelogFeed, {
    filterType: { type: ControlType.String, title: "Filter type", defaultValue: "", placeholder: "launch / update / fix / meta" },
    filterProject: { type: ControlType.String, title: "Filter project", defaultValue: "", placeholder: "OpenMemo" },
    maxEntries: { type: ControlType.Number, title: "Max entries", defaultValue: 10, min: 1, max: 50, step: 1 },
    showDate: { type: ControlType.Boolean, title: "Show date", defaultValue: true },
    showType: { type: ControlType.Boolean, title: "Show type pill", defaultValue: true },
    showProject: { type: ControlType.Boolean, title: "Show project", defaultValue: true },
    showVersion: { type: ControlType.Boolean, title: "Show version", defaultValue: true },
    showEmoji: { type: ControlType.Boolean, title: "Show emoji icon", defaultValue: true },
    textColor: { type: ControlType.Color, title: "Text color", defaultValue: "#ffffff" },
    mutedColor: { type: ControlType.Color, title: "Muted color", defaultValue: "#888888" },
    gap: { type: ControlType.Number, title: "Gap", defaultValue: 24, min: 8, max: 64, step: 4 },
    font: { type: ControlType.String, title: "Font family", defaultValue: "inherit" },
})
