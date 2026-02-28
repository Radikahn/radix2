export default function SoundCloudEmbed() {
    return (
        <div className="absolute top-126 right-45 z-10 pointer-events-auto w-80">
            <iframe
                width="100%"
                height="300"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2147966751&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
            ></iframe>
            <div
                style={{
                    fontSize: "10px",
                    color: "#cccccc",
                    lineBreak: "anywhere",
                    wordBreak: "normal",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    fontFamily:
                        "Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif",
                    fontWeight: 100,
                }}
            >
                <a
                    href="https://soundcloud.com/2hollis"
                    title="2hollis"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#cccccc", textDecoration: "none" }}
                >
                    2hollis
                </a>
                {" · "}
                <a
                    href="https://soundcloud.com/2hollis/fly"
                    title="fly"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#cccccc", textDecoration: "none" }}
                >
                    fly
                </a>
            </div>
        </div>
    );
}
