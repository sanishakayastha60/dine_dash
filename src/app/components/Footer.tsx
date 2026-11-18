export default function Footer() {
  return (
    <div className="bg-black text-white px-12 pt-8 pb-4">
      <div className="flex flex-col gap-4 md:flex-row justify-between pb-8">
        <div className="">
          <h2 className="font-bold">Dine_Dash</h2>
          <p className="text-sm text-gray-200">Food at your service.</p>
        </div>
        <div className="">
          <h4 className="font-bold">Explore</h4>
          <p className="text-sm text-gray-200">Restaurants</p>
          <p className="text-sm text-gray-200">Food Categories</p>
        </div>
        <div className="">
          <h4 className="font-bold">Business</h4>
          <p className="text-sm text-gray-200">Register your business</p>
          <p className="text-sm text-gray-200">Business dashboard</p>
        </div>
        <div className="">
          <h4 className="font-bold">Contact</h4>
          <p className="text-sm text-gray-200">dinedash@gmail.com</p>
          <p className="text-sm text-gray-200">+9779808402565</p>
        </div>
      </div>
      <hr />
      <div className="text-sm text-gray-300 flex  flex-col md:flex-row justify-between">
        <p>&copy; 2026 DineDash. All Rights reserved.</p>
        <p>Privacy Policy.Terms of Service.Refund Policy</p>
      </div>
    </div>
  );
}
