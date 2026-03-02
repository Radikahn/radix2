import LinkPreview from "../LinkPreview";

export default function SoundCloud({ className }: { className?: string }) {
  return (
    <LinkPreview
      className={className}
      label="my SoundCloud"
      href="https://soundcloud.com/radi-kahn"
      previewLabel="soundcloud.com/radi-kahn"
      previewUrl="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/radi-kahn&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false"
      dots={[{ color: "text-orange-500" }]}
    />
  );
}
