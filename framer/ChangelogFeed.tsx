// Framer Code Component — paste into Framer's "Code" component editor
// Fetches CHANGELOG.json from raw GitHub and renders entries.
// Supports filtering by type and project.

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useState } from "react"

const RAW_URL =
    "https://raw.githubusercontent.com/izored/izored/main/CHANGELOG.json"

type Entry = {
    id: string
    date: string
    version: string | null
    title: string
    description: string
    type: string
    tags: string[]
    project: string | null
    projectUrl: string | null
}

type Props = {
    filterType: string
    filterProject: string
    maxEntries: number
    showDate: boolean
    showType: boolean
    showProject: boolean
    accentColor: string
    textColor: string
    mutedColor: string
    gap: number
    font: string
}

export default function ChangelogFeed({
    filterType = "",
    filterProject = "",
    maxEntries = 10,
    showDate = true,
    showType = true,
    showProject = true,
    accentColor = "#FFB800",
    textColor = "#ffffff",
    mutedColor = "#888888",
    gap = 24,
    font = "inherit",
}: Props) {
    const [entries, setEntries] = useState<Entry[]>([])
    const [error, setError] = useState(false)

    useEffect(() => {
        fetch(RAW_URL)
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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap,
                fontFamily: font,
                width: "100%",
            }}
        >
            {filtered.map((entry) => (
                <div
                    key={entry.id}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                        }}
                    >
                        {showType && (
                            <span
                                style={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: accentColor,
                                    background: accentColor + "22",
                                    borderRadius: 4,
                                    padding: "2px 7px",
                                }}
                            >
                                {entry.type}
                            </span>
                        )}
                        {showProject && entry.project && (
                            entry.projectUrl ? (
                                <a
                                    href={entry.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: 10,
                                        color: mutedColor,
                                        textDecoration: "none",
                                    }}
                                >
                                    {entry.project}
                                </a>
                            ) : (
                                <span
                                    style={{ fontSize: 10, color: mutedColor }}
                                >
                                    {entry.project}
                                </span>
                            )
                        )}
                        {entry.version && (
                            <span
                                style={{ fontSize: 10, color: mutedColor }}
                            >
                                {entry.version}
                            </span>
                        )}
                        {showDate && (
                            <span
                                style={{
                                    fontSize: 10,
                                    color: mutedColor,
                                    marginLeft: "auto",
                                }}
                            >
                                {entry.date}
                            </span>
                        )}
                    </div>
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: textColor,
                            lineHeight: 1.3,
                        }}
                    >
                        {entry.title}
                    </div>
                    <div
                        style={{
                            fontSize: 13,
                            color: mutedColor,
                            lineHeight: 1.6,
                        }}
                    >
                        {entry.description}
                    </div>
                </div>
            ))}
        </div>
    )
}

addPropertyControls(ChangelogFeed, {
    filterType: {
        type: ControlType.String,
        title: "Filter type",
        defaultValue: "",
        placeholder: "launch / update / fix / meta",
    },
    filterProject: {
        type: ControlType.String,
        title: "Filter project",
        defaultValue: "",
        placeholder: "OpenMemo",
    },
    maxEntries: {
        type: ControlType.Number,
        title: "Max entries",
        defaultValue: 10,
        min: 1,
        max: 50,
        step: 1,
    },
    showDate: {
        type: ControlType.Boolean,
        title: "Show date",
        defaultValue: true,
    },
    showType: {
        type: ControlType.Boolean,
        title: "Show type badge",
        defaultValue: true,
    },
    showProject: {
        type: ControlType.Boolean,
        title: "Show project",
        defaultValue: true,
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent color",
        defaultValue: "#FFB800",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text color",
        defaultValue: "#ffffff",
    },
    mutedColor: {
        type: ControlType.Color,
        title: "Muted color",
        defaultValue: "#888888",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 24,
        min: 8,
        max: 64,
        step: 4,
    },
    font: {
        type: ControlType.String,
        title: "Font family",
        defaultValue: "inherit",
    },
})
