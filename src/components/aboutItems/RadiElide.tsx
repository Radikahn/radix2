import LinkPreview from "../LinkPreview";

export default function RadiElide() {
  return (
    <LinkPreview
      className=""
      label="Elide MC Feature"
      href="https://www.reddit.com/r/feedthebeast/comments/1sazba3/building_a_toolchain_to_make_development_easy/"
      previewLabel="reddit.com/feedthebeast"
      previewContent={
        <iframe
          src="https://www.redditmedia.com/r/feedthebeast/comments/1sazba3/building_a_toolchain_to_make_development_easy/?ref_source=embed&ref=share&embed=true"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-popups"
          className="flex-1"
        />
      }
      dots={[{ color: "text-orange-500" }]}
    />
  );
}
