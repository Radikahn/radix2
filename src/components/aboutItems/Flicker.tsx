import LinkPreview from "../LinkPreview";

export default function Flicker() {
  return (
    <LinkPreview
      className=""
      label="my Flickr"
      href="https://www.flickr.com/photos/201140708@N05/"
      previewLabel="flickr.com/radikahn"
      previewContent={
        <a
          data-flickr-embed="true"
          href="https://www.flickr.com/photos/201140708@N05"
          className="flex-1 overflow-hidden"
        >
          <img
            src="https://live.staticflickr.com/65535/55120338310_e866da3397_h.jpg"
            width="100%"
            height="100%"
            alt=""
            className="w-full h-full object-cover"
          />
        </a>
      }
      dots={[
        { color: "text-blue-700", className: "py-4" },
        { color: "text-pink-500" },
      ]}
    />
  );
}
