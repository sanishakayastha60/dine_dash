export default function Home() {
  return (
    <div>
      <main>
        <div className="min-h-screen w-full bg-[#fcfaf7] flex flex-col items-center justify-center">
          <div className="pt-20">
            <div className="relative min-h-[100px]">
              <img
                src="./keema.png"
                alt=""
                className="w-24 absolute top-10 left-[10%] rotate-[-12deg]"
              />
              <img
                src="./momo.png"
                alt=""
                className="w-24 absolute top-2 right-[30%] rotate-[10deg]"
              />
              <img
                src="./tiramisu.png"
                alt=""
                className="w-24 absolute top-15 right-[10%] rotate-[14deg]"
              />
            </div>
            <h1 className="text-5xl font-extrabold text-center leading-tight bg-linear-to-r from-[#F26A2C] to-[#FFf7ef] bg-clip-text text-transparent text-shadow-sm">
              <span className="block">THE FOOD'S</span>{" "}
              <span className="block">AT YOUR SERVICE</span>
            </h1>
            <div className="pt-16 flex gap-4 justify-center">
              <button className="px-8 py-2 bg-[#f26a2c] rounded-2xl">
                Explore Food
              </button>
              <button className="px-8 py-2 bg-[#fff7ef] rounded-2xl">
                Find a Restaurant
              </button>
            </div>
          </div>
        </div>
        <div className="h-70 w-full bg-blue-50"></div>
      </main>
    </div>
  );
}
