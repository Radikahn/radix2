"use client";
import { useEffect, useState } from "react";

interface SoundCloudEmbedProps {
    trackUrl: string;
    width?: string;
    height?: string;
    color?: string;
    autoPlay?: boolean;
    hideRelated?: boolean;
    showComments?: boolean;
    showUser?: boolean;
    showReposts?: boolean;
    showTeaser?: boolean;
    visual?: boolean;
}

export default function SoundCloudEmbed({
    trackUrl,
    width = "100%",
    height = "300",
    color = "#ff5500",
    autoPlay = false,
    hideRelated = false,
    showComments = true,
    showUser = true,
    showReposts = false,
    showTeaser = true,
    visual = true,
}: SoundCloudEmbedProps) {
    const [embedHtml, setEmbedHtml] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmbed = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use our backend proxy to get the oEmbed data
                const params = new URLSearchParams({
                    url: trackUrl,
                    maxwidth:
                        typeof width === "string" && width.includes("%")
                            ? "100%"
                            : width.toString(),
                    maxheight: height,
                    color: color.replace("#", ""),
                    auto_play: autoPlay.toString(),
                    show_comments: showComments.toString(),
                });

                const response = await fetch(
                    `/api/soundcloud/oembed?${params.toString()}`,
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch embed: ${response.status}`,
                    );
                }

                const data = await response.json();

                if (data.html) {
                    setEmbedHtml(data.html);
                } else {
                    throw new Error("No embed HTML returned");
                }
            } catch (err) {
                console.error("SoundCloud embed error:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load SoundCloud embed",
                );

                // Fallback to direct iframe embed
                const fallbackParams = new URLSearchParams({
                    url: trackUrl,
                    color: color,
                    auto_play: autoPlay.toString(),
                    hide_related: hideRelated.toString(),
                    show_comments: showComments.toString(),
                    show_user: showUser.toString(),
                    show_reposts: showReposts.toString(),
                    show_teaser: showTeaser.toString(),
                    visual: visual.toString(),
                });

                const fallbackEmbedUrl = `https://w.soundcloud.com/player/?${fallbackParams.toString()}`;
                setEmbedHtml(
                    `<iframe width="${width}" height="${height}" scrolling="no" frameborder="no" allow="autoplay" src="${fallbackEmbedUrl}"></iframe>`,
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmbed();
    }, [
        trackUrl,
        width,
        height,
        color,
        autoPlay,
        hideRelated,
        showComments,
        showUser,
        showReposts,
        showTeaser,
        visual,
    ]);

    if (loading) {
        return (
            <div
                style={{ width, height }}
                className="flex items-center justify-center bg-gray-100 rounded"
            >
                <span className="text-gray-600">
                    Loading SoundCloud player...
                </span>
            </div>
        );
    }

    return (
        <div
            dangerouslySetInnerHTML={{ __html: embedHtml }}
            style={{ width, height }}
        />
    );
}
