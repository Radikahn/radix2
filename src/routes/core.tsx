import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import MineLayer from "@/components/MineLayer";
import PenguinHideout from "@/components/PenguinHideout";
import "./core.css";

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
    imageCaption: "", // shown under the image; leave empty to hide
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
            className={mining ? "wiki-tab-edit pick-cursor active" : "wiki-tab-edit pick-cursor"}
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
                {infobox.imageCaption && (
                  <div className="wiki-caption">{infobox.imageCaption}</div>
                )}
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
