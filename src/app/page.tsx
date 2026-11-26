import Link from "next/link";

import Navbar from "./components/Navbar";
import Category from "./components/Category";
import RestroCard from "./components/RestaurantCard";
import FoodItemCard from "./components/FoodItemCard";
import Footer from "./components/Footer";
import { getLandingPageMenuItems } from "@/actions/MenuItemAction";
import { getPublicBusinessInfo } from "@/actions/BusinessInfoAction";
import { Suspense } from "react";
import Skeleton from "./components/Skeleton";
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
    url: "/pizza.jfif",
  },
  {
    id: 7,
    name: "Tea",
    url: "/pizza.jfif",
  },
  {
    id: 8,
    name: "Sekuwa",
    url: "/pizza.jfif",
  },
  {
    id: 9,
    name: "Biryani",
    url: "/pizza.jfif",
  },
  {
    id: 10,
    name: "Desserts",
    url: "/pizza.jfif",
  },
];

async function MenuItemSection() {
  const result = await getLandingPageMenuItems();
  return (
    <div>
      {result.success && result.menuItems.length > 0 ? (
        <div className="flex flex-wrap justify-center md:justify-between gap-6">
          {result.menuItems.map((item) => (
            <FoodItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              imageUrl={item.imageUrl}
              restaurantName={item.business.name}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No food items available yet.
        </p>
      )}
    </div>
  );
}
async function BusinessSection() {
  const result = await getPublicBusinessInfo();

  const businesses = result.businesses;

  if (!businesses.length) {
    return <p className="text-gray-500">No businesses available.</p>;
  }

  return (
    <div className="flex flex-wrap gap-5">
      {businesses.map((business) => (
        <RestroCard
          key={business.id}
          id={business.id}
          name={business.name}
          description={business.description}
          address={business.address}
          businessType={business.businessType}
          coverUrl={business.coverUrl}
          logoUrl={business.logoUrl}
        />
      ))}
    </div>
  );
}

export default async function Home() {
  return (
    <div>
      <Navbar />
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
        <Suspense fallback={<Skeleton />}>
          <BusinessSection />
        </Suspense>
        <div className="flex flex-col items-center mt-8">
          <Link
            href="/allBusiness"
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
          >
            View More Businesses
          </Link>
        </div>
      </section>
      <section className="pt-8 px-4 md:pt-16 md:px-8">
        <h2 className="text-center font-bold pb-4 text-3xl">
          Popular Food Items
        </h2>
        <Suspense
          fallback={
            <div>
              <Skeleton />
            </div>
          }
        >
          <MenuItemSection />
        </Suspense>
        <div className="flex flex-col items-center mt-8">
          <Link
            href="/allFoodItem"
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
          >
            View More Food Items
          </Link>
        </div>
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
