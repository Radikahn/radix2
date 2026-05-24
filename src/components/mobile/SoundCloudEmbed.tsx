export default function SoundCloudEmbed() {
  return (
    <div className="w-64 mx-auto">
      <span className="font-jetbrains-mono text-sm">been listening to:</span>
      <iframe
        width="100%"
        height="200"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1685851236&color=%2388acb4&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
      />
    </div>
  );
}
