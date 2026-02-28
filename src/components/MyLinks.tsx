import Flicker from "./aboutItems/Flicker";
import Spotify from "./aboutItems/Spotify";
import SoundCloud from "./aboutItems/SoundCloud";

export default function MyLinks() {
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute top-[5%] left-[8%]">
        <Flicker />
      </div>
      <div className="absolute top-[35%] right-[10%]">
        <SoundCloud />
      </div>
      <div className="absolute bottom-[50%] left-[25%]">
        <Spotify />
      </div>
    </div>
  );
}
