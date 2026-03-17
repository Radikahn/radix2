import LinkPreview from "../LinkPreview";

export default function ShopSaec() {
  return (
    <LinkPreview
      className=""
      label="Merch Shop SAEC"
      href="https://shop.we-saec.me"
      previewLabel="shop.we-saec.me"
      previewImage={
        <a
          className="w-full h-full object-cover"
          href="https://shop.we-saec.me"
          target="_blank"
        >
          <img className="w-full h-full object-cover" src="/saecMerch.png" />
        </a>
      }
      dots={[{ color: "text-navy-500" }]}
    />
  );
}
