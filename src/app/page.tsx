import Navbar from "./components/Navbar";
import Category from "./components/Category";
import RestroCard from "./components/RestaurantCard";
import FoodItemCard from "./components/FoodItemCard";
import Footer from "./components/Footer";
const categories = [
  {
    id: 1,
    name: "Momo",
    url: "/momo2.jfif",
  },
  {
    id: 2,
    name: "Thakali Khana",
    url: "/khana.jfif",
  },
  {
    id: 3,
    name: "Noodles",
    url: "/noodles.jfif",
  },
  {
    id: 4,
    name: "Newari Khaja Set",
    url: "/khaja.jfif",
  },
  {
    id: 5,
    name: "Pizza",
    url: "/pizza.jfif",
  },
  {
    id: 6,
    name: "Keema Noodles",
    url: "",
  },
  {
    id: 7,
    name: "Tea",
    url: "",
  },
  {
    id: 8,
    name: "Sekuwa",
    url: "",
  },
  {
    id: 9,
    name: "Biryani",
    url: "",
  },
  {
    id: 10,
    name: "Desserts",
    url: "",
  },
];

export default function Home() {
  return (
    <div>
      <main className="relative h-screen w-full bg-[url('/backgroundTable.png')] bg-cover bg-center bg-no-repeat px-8 px-16">
        <div className="flex items-center min-h-screen">
          <div className="flex-1">
            <h1 className="text-white font-bold text-6xl">
              Food at your pace.Dine In or Out at your Comfort
            </h1>
            <input
              type="text"
              placeholder="Search Food or Restaurant"
              className="bg-white py-4 px-4 rounded-xl"
            />
          </div>
          <div className="relative flex-1">
            <img src="thakali_khana.png" alt="" className="absolute" />
            <img src="/momo.png" alt="" className="absolute" />
            <img src="/omelet.png" alt="" className="absolute" />
          </div>
        </div>
      </main>
      <section className="pt-8 px-4 md:pt-16 md:px-8">
        <div>
          <h2 className="text-center font-bold pb-4 text-3xl">
            Choose a Category
          </h2>
          <div className="flex gap-6 flex-wrap w-full border-box items-center justify-center justify-between">
            {categories.map((category) => (
              <Category
                key={category.id}
                name={category.name}
                url={category.url}
              />
            ))}
          </div>
          <button className="bg-red-200 rounded-xl px-4 py-2 ">
            View More
          </button>
        </div>
      </section>
      <section className="pt-8 px-4 md:pt-16 md:px-8">
        <h2 className="text-center font-bold pb-4 text-3xl">
          Explore the Restaurants
        </h2>
        <div className="flex justify-between gap-6 flex-wrap">
          <RestroCard />
          <RestroCard />
          <RestroCard />
          <RestroCard />
        </div>
        <button className="bg-red-200 rounded-xl px-4 py-2 ">View More</button>
      </section>
      <section className="pt-8 px-4 md:pt-16 md:px-8">
        <h2 className="text-center font-bold pb-4 text-3xl">
          Popular Food Items
        </h2>
        <div className="flex flex-wrap justify-between gap-6">
          <FoodItemCard />
          <FoodItemCard />
          <FoodItemCard />
          <FoodItemCard />
          <FoodItemCard />
        </div>
        <button className="bg-red-200 rounded-xl px-4 py-2 ">View More</button>
      </section>
      <section className="py-8 px-4 md:py-16 md:px-8">
        <div className="w-full bg-black text-white py-8 px-4 flex flex-col justify-between items-center rounded-xl md:flex-row">
          <h2 className="font-bold text-4xl">Grow With Us.</h2>
          <button className="bg-red-200 p-4 rounded-xl mt-4 md:mt-0">
            Register Your Business
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
