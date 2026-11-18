import FoodItemCard from "../components/FoodItemCard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
export default function Explore() {
  return (
    <div>
      <div
        className=" relative w-full h-64 bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: "url('/restaurant.jpg')",
        }}
      >
        <div className="bg-white text-black">Back</div>
        <div>4.5</div>
        <div className="absolute bottom-0 flex flex-col">
          <span className="font-bold text-xl">Himalayan Health</span>
          <span className="text-sm">
            {" "}
            <LocationOnIcon /> Thamel, Kathmandu
          </span>
          <span>Nepali</span>
        </div>
      </div>
      <div className="py-8">
        <div>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Search"
          />
        </div>
        <div className="flex gap-2">
          <span>All</span>
          <span>Recommended</span>
        </div>
        <div>
          <FoodItemCard />
          <FoodItemCard />
          <FoodItemCard />
        </div>
      </div>
    </div>
  );
}
