import { getMenuItems } from "@/actions/MenuItemAction";

export default async function MenuList() {
  const result = await getMenuItems();

  if (!result.success) {
    return (
      <p className="text-red-500">{result.message || "Unable to load menu."}</p>
    );
  }

  if (result.menuItems.length === 0) {
    return (
      <div className="border rounded-xl p-10 text-center">
        <h3 className="font-semibold text-lg">No menu items yet</h3>
        <p className="text-gray-500 text-sm mt-2">
          Start adding delicious dishes to your menu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {result.menuItems.map((item) => (
        <div
          key={item.id}
          className="border rounded-xl overflow-hidden bg-white flex"
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-30 h-auto object-cover"
            />
          ) : (
            <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          <div className="p-4 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-lg">{item.name}</h3>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{item.category.name}</span>
              <span>{item.menuSection}</span>
            </div>

            <p className="text-xs text-gray-500">
              Preparation: {item.estimatedTime} minutes
            </p>

            <span className="font-semibold text-green-700 whitespace-nowrap">
              Rs. {item.price}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
