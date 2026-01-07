interface YouTubeEmbedProps {
  videoId: string;
  width?: string;
  height?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export default function YouTubeEmbed({
  videoId,
  width = "100%",
  height = "300",
  autoPlay = false,
  showControls = true,
}: YouTubeEmbedProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&controls=${showControls ? 1 : 0}`;

  return (
    <iframe
      width={width}
      height={height}
      src={embedUrl}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
