import LinkPreview from "../LinkPreview";

export default function Sasc() {
  return (
    <LinkPreview
      className=""
      label="SJSU Actuary Club"
      href="https://spartanactuaries.org"
      previewLabel="spartanactuaries.org"
      previewImage={
        <a
          className="w-full h-full object-cover"
          href="https://spartanactuaries.org"
          target="_blank"
        >
          <img className="w-full h-full object-cover" src="/sasc.png" />
        </a>
      }
      dots={[{ color: "text-navy-300" }]}
    />
  );
}
