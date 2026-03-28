import Flicker from "./aboutItems/Flicker";
import Spotify from "./aboutItems/Spotify";
import SoundCloud from "./aboutItems/SoundCloud";
import Saec from "./aboutItems/Saec";
import Github from "./aboutItems/Github";
import ShopSaec from "./aboutItems/ShopSaec";
import Sasc from "./aboutItems/Sasc";

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
      <div className="absolute bottom-[14%] right-[30%]">
        <Saec />
      </div>
      <div className="absolute -bottom-[10%] left-[8%]">
        <Github />
      </div>
      <div className="absolute bottom-[70%] right-[28%]">
        <ShopSaec />
      </div>
      <div className="absolute -bottom-[20%] right-[25%]">
        <Sasc />
      </div>
    </div>
  );
}
