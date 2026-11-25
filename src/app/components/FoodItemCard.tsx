export default function FoodItemCard() {
  return (
    <div className="w-64 border-r border-b shadow-sm ">
      <div>
        <img src="/bg.jfif" alt="" className="" />
      </div>
      <div className="p-2">
        <p className="text-sm text-gray-600">Paradise FoodLand</p>
        <h3 className="font-bold">Buff C Momo</h3>
        <p className="text-sm line-clamp-2">
          10 pieces of buff momo smoothered in house made sauces catering sweet
          and spicy tastebuds.
        </p>
        <hr className="" />
        <div className="flex justify-between pt-2 items-center">
          <p>Rs.400</p>
          <button className="bg-red-200 px-2 py-1 rounded-xl">Add</button>
        </div>
      </div>
    </div>
  );
}
// add lai click garda order ko number dekhine garne
