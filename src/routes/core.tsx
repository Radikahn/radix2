import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import MineLayer, { pickCursorCss } from "@/components/MineLayer";
import PenguinHideout from "@/components/PenguinHideout";

// ---------------------------------------------------------------------------
// Fill-in template. Everything on the page is driven by the data below.
// Anything wrapped in <Fill> renders as a highlighted placeholder so it's easy
// to spot what still needs writing — swap it for real text when you're ready.
// ---------------------------------------------------------------------------

type Reference = { id: string; text: string; href: string };

const references: Reference[] = [
  { id: "github", text: "Radikahn on GitHub", href: "https://github.com/Radikahn" },
  { id: "blog", text: "blog.radikahn.com", href: "https://blog.radikahn.com" },
  { id: "flickr", text: "Flickr", href: "https://www.flickr.com/photos/201140708@N05/" },
  { id: "soundcloud", text: "radikahn on SoundCloud", href: "https://soundcloud.com/radi-kahn" },
  { id: "corsair", text: "Career", href: "https://corsair.com" },
  {
    id: "elide",
    text: "\"Building a toolchain to make development easy\", r/feedthebeast",
    href: "https://www.reddit.com/r/feedthebeast/comments/1sazba3/building_a_toolchain_to_make_development_easy/",
  },
  { id: "saec", text: "SJSU SAEC", href: "https://we-saec.me/dash" },
  { id: "sasc", text: "SJSU Actuary Club", href: "https://spartanactuaries.org" },
];

const profile = {
  name: "Radi",
  shortDescription: "thanks for checking me out  >_<",
  infobox: {
    image: "/mrFox.jpg", // e.g. "/me.jpg" (put the file in public/)
    rows: [
      ["Education", <>SJSU Data Science, 2026</>],
      ["Interests", "Cars, software, photography, and music"],
      ["Website", <span className="flex flex-col"><a href="/">radikahn.com</a> (you are here now)</span>],
    ] as [string, ReactNode][],
  },
  lead: (
    <>
      Hi I am <b>Radi</b> and I'm <Fill>trying to be</Fill> a software developer.
      In the day time I work to build cool stuff at <a href="https://corsair.com" target="_blank">Corsair</a> and in the night I am a professional tinkerer.
      I am attempting to get better at sharing a lot of the things I build and work on in my <a href="https://blog.radikahn.com" target="_blank">blog.</a>
    </>
  ),
  sections: [
    {
      title: "Education",
      body: (
        <p>
          I currently attend SJSU for Data Science, I am the VP of
          SJSU SAEC<Cite id="saec" /> and the Spartan
          Actuaries Club<Cite id="sasc" />.{" "}
        </p>
      ),
    },
    {
      title: "Career",
      body: (
        <>
          <p>
            Right now I build things at Corsair.<Cite id="corsair" />{" "}
            Mostly specialized in internal tooling and ai customer assistance software
          </p>
          <h3>Previous Career</h3>
          <ul>
            <li>
              <b>Elide</b> - a runtime, compiler and toolchain for JavaScript, TypeScript, Python, Java and Kotlin.
              I specialized in developing Elide's polyglot capabilities to allow for Minecraft mod development in Python.
              I also worked on Elide premium's payment and license verification system.{" "}
            </li>
            <li>
              <b>radix2</b> - the site you see now.{" "}
            </li>
            <li>
              <b>SJSU SAEC</b> - VP of one of the largest SJSU recognized clubs on campus. I built the main <a href="https://we-saec.me/dash" target="_blank">SAEC website</a> and <a href="https://shop.we-saec.me" target="_blank">shop</a>{" "}
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Interests",
      body: (
        <>
          <h3>Software</h3>
          <p>
            Most of my code lives on GitHub.<Cite id="github" /> {" "} I hate all languages equally {"<3"}
          </p>
          <h3>Photography</h3>
          <p>
            I take photos and put the ones I like on Flickr. I shoot on a Sony A6700{" "}
          </p>
          <h3>Music</h3>
          <p>
            I listen to anything and everything (except country).
            I make music too (rarely), and post it on SoundCloud.<Cite id="soundcloud" />{" "}
          </p>
        </>
      ),
    },
    {
      title: "Personal life",
      body: (
        <p>
          I keep a blog where I dump my thoughts and whatever I'm into at the
          moment.
        </p>
      ),
    },
    {
      title: "See also",
      body: (
        <ul>
          <li><a href="https://nixos.org" target="_blank" rel="noreferrer">NixOS</a></li>
          <li><a href="https://speedcenter.io" target="_blank" rel="noreferrer">SpeedCenter</a></li>
          <li><a href="https://open.spotify.com/user/22qxrmza63qc2egeimomjv4ny?si=dd9585316d2e448d" target="_blank" rel="noreferrer">Spotify</a></li>

        </ul>
      ),
    },
  ],
};

// ---------------------------------------------------------------------------

function Fill({ children }: { children: ReactNode }) {
  return <span className="wiki-fill">[{children}]</span>;
}

function Cite({ id }: { id: string }) {
  const n = references.findIndex((r) => r.id === id) + 1;
  return (
    <sup className="wiki-cite">
      <a href={`#cite-${id}`}>[{n}]</a>
    </sup>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const allSections = [
  ...profile.sections,
  {
    title: "References",
    body: (
      <ol className="wiki-refs">
        {references.map((r) => (
          <li key={r.id} id={`cite-${r.id}`}>
            <a href={r.href} target="_blank" rel="noreferrer">
              {r.text}
            </a>
          </li>
        ))}
      </ol>
    ),
  },
];

export default function CorePage() {
  const { infobox } = profile;

  const year = new Date().getFullYear();

  // "Edit" hands you a pickaxe: the page turns into blocks you can mine out.
  const rootRef = useRef<HTMLDivElement>(null);
  const [mining, setMining] = useState(false);

  useEffect(() => {
    if (!mining) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMining(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mining]);

  return (
    <div className="wiki" ref={rootRef}>
      <style>{wikiCss}</style>

      <div className="wiki-page">
        <Link to="/" className="wiki-back" aria-label="Back to the main page">
          <span className="arrow">&larr;</span> back to radix2
        </Link>
        <div className="wiki-tabs">
          <span className="active">Article</span>
          <span>Talk</span>
          <span className="spacer" />
          <span className={mining ? undefined : "active"}>Read</span>
          <button
            type="button"
            className={mining ? "wiki-tab-edit active" : "wiki-tab-edit"}
            aria-pressed={mining}
            title={mining ? "Put the pick away (Esc)" : "Hold the mouse down to mine the page"}
            onClick={() => setMining((m) => !m)}
          >
            Edit
          </button>
          <span>View history</span>
        </div>

        <h1 className="wiki-title">{profile.name}</h1>
        <div className="wiki-tagline">From radix2, the free encyclopedia</div>

        <table className="wiki-infobox">
          <tbody>
            <tr>
              <th colSpan={2} className="wiki-infobox-name">
                <PenguinHideout name={profile.name} />
              </th>
            </tr>
            <tr>
              <td colSpan={2} className="wiki-infobox-image">
                {infobox.image ? (
                  <img src={infobox.image} alt={profile.name} />
                ) : (
                  <div className="wiki-image-placeholder">no image</div>
                )}
                <div className="wiki-caption">{infobox.imageCaption}</div>
              </td>
            </tr>
            {infobox.rows.map(([label, value]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="wiki-short">{profile.shortDescription}</p>
        <p>{profile.lead}</p>

        <nav className="wiki-toc">
          <div className="wiki-toc-title">Contents</div>
          <ol>
            {allSections.map((s, i) => (
              <li key={s.title}>
                <a href={`#${slug(s.title)}`}>
                  <span className="num">{i + 1}</span> {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {allSections.map((s) => (
          <section key={s.title}>
            <h2 id={slug(s.title)}>
              {s.title}
              <span className="wiki-edit">
                [<a href="#">edit</a>]
              </span>
            </h2>
            {s.body}
          </section>
        ))}

        <div className="wiki-footer">
          This page was last edited on {year}. Text is available under
          the "do whatever" license; additional terms may apply.
        </div>
      </div>

      {mining && <MineLayer rootRef={rootRef} />}
    </div>
  );
}

const wikiCss = `
.wiki {
  position: relative;
  min-height: 100vh;
  background: #fff;
  color: #202122;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}
.wiki-page { max-width: 960px; margin: 0 auto; padding: 16px 16px 48px; }
.wiki a { color: #0645ad; text-decoration: none; }
.wiki a:hover { text-decoration: underline; }
.wiki p { margin: 0.5em 0; }
.wiki ul { list-style: disc; padding-left: 1.6em; margin: 0.3em 0; }
.wiki ol { list-style: decimal; padding-left: 2em; margin: 0.3em 0; }

.wiki-back {
  display: inline-flex; align-items: center; gap: 6px; margin-bottom: 12px;
  padding: 3px 10px; border: 1px solid #a2a9b1; background: #fff;
  font-size: 12px; letter-spacing: 0.02em; color: #202122 !important;
  transition: background 150ms, color 150ms, border-color 150ms;
}
.wiki-back:hover { background: #202122; border-color: #202122; color: #fff !important; text-decoration: none !important; }
.wiki-back .arrow { display: inline-block; transition: transform 150ms; }
.wiki-back:hover .arrow { transform: translateX(-3px); }
.wiki-back:focus-visible { outline: 2px solid #0645ad; outline-offset: 2px; }
/* Above the mine layer so Edit can always be clicked to stop mining. */
.wiki-tabs { position: relative; z-index: 3; display: flex; gap: 2px; border-bottom: 1px solid #a7d7f9; font-size: 13px; }
.wiki-tabs > * { padding: 4px 10px; color: #0645ad; cursor: default; }
.wiki-tabs button { font: inherit; background: none; border: 0; }
.wiki-tabs .active { color: #202122; border: 1px solid #a7d7f9; border-bottom-color: #fff; margin-bottom: -1px; background: #fff; }
.wiki-tabs .spacer { flex: 1; padding: 0; }
.wiki-tabs .wiki-tab-edit { ${pickCursorCss} }
.wiki-tabs .wiki-tab-edit:hover { text-decoration: underline; }
.wiki-tabs .wiki-tab-edit:focus-visible { outline: 2px solid #0645ad; outline-offset: -2px; }

.wiki-title, .wiki h2 {
  font-family: 'Linux Libertine', Georgia, Times, serif;
  font-weight: normal;
  border-bottom: 1px solid #a2a9b1;
}
.wiki-title { font-size: 28.8px; margin-top: 16px; line-height: 1.3; }
.wiki-tagline { font-size: 12.7px; color: #54595d; margin-bottom: 12px; }
.wiki h2 { font-size: 21px; margin: 1em 0 0.25em; clear: none; }
.wiki h3 { font-size: 15px; font-weight: bold; margin: 0.8em 0 0.2em; }
.wiki-edit { font-family: Arial, sans-serif; font-size: 13px; color: #54595d; margin-left: 8px; }
.wiki-short { font-style: italic; color: #54595d; font-size: 13px; }

.wiki-infobox {
  float: right; clear: right; width: 22em; margin: 0 0 1em 1.4em;
  border: 1px solid #a2a9b1; background: #f8f9fa; font-size: 12.5px;
  border-collapse: separate; border-spacing: 3px; line-height: 1.5;
}
.wiki-infobox th, .wiki-infobox td { padding: 2px 4px; vertical-align: top; text-align: left; }
.wiki-infobox th[scope=row] { width: 38%; }
.wiki-infobox-name { text-align: center !important; font-size: 16px; padding: 0 !important; }
.wiki-infobox-image { text-align: center !important; }
.wiki-infobox-image img { max-width: 100%; margin: 0 auto; }
.wiki-image-placeholder {
  height: 180px; display: flex; align-items: center; justify-content: center;
  border: 1px dashed #a2a9b1; color: #72777d; background: #fff;
}
.wiki-caption { font-size: 12px; padding-top: 2px; }

.wiki-toc {
  display: inline-block; border: 1px solid #a2a9b1; background: #f8f9fa;
  padding: 7px 14px 7px 10px; margin: 0.5em 0; font-size: 13px;
}
.wiki-toc-title { font-weight: bold; text-align: center; }
.wiki-toc ol { list-style: none; padding-left: 0; }
.wiki-toc .num { color: #202122; padding-right: 4px; }

.wiki-cite { font-size: 10px; line-height: 1; }
.wiki-refs { font-size: 12.5px; }
.wiki-fill { background: #fef6e7; color: #ac6600; font-style: italic; }
.wiki-footer {
  clear: both; margin-top: 32px; padding-top: 8px;
  border-top: 1px solid #a2a9b1; font-size: 11px; color: #54595d;
}

@media (max-width: 640px) {
  .wiki-infobox { float: none; width: 100%; margin: 0 0 1em; }
}
`;
