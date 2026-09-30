import LinkPreview from "../LinkPreview";

export default function Spotify() {
  return (
    <LinkPreview
      className=""
      label="my Spotify"
      href="https://open.spotify.com/user/22qxrmza63qc2egeimomjv4ny?si=0c66eb0fc9a74259"
      previewLabel="Spotify.com/Radikahn"
      previewContent={
        <iframe
          style={{ borderRadius: 12 }}
          src="https://open.spotify.com/embed/playlist/0vZBwK62NMMIWkbf6RRx5T?utm_source=generator&si=09796ebf83de4022"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="flex-1"
        />
      }
      dots={[{ color: "text-green-500" }]}
    />
  );
}
