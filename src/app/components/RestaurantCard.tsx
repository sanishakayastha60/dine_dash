export default function RestroCard() {
  return (
    <div className=" p-4 rounded-2xl shadow-sm">
      <div>
        <img src="/bg.jfif" alt="" className="rounded-xl w-64 h-auto" />
      </div>
      <div className="p-2">
        <h3 className="font-bold">Paradise FoodLand</h3>
        <p className="text-gray-700 text-sm">Madhyapur Thimi, Bhaktapur</p>
        <p>Self Pickup</p>
        <p>Dine-In</p>
        <button className="bg-red-300 w-full py-2 rounded-xl mt-2">
          View Restaurant
        </button>
      </div>
    </div>
  );
}
