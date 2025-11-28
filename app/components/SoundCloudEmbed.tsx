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
  const params = new URLSearchParams({
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

  const embedUrl = `https://w.soundcloud.com/player/?${params.toString()}`;

  return (
    <iframe
      width={width}
      height={height}
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      src={embedUrl}
    />
  );
}
