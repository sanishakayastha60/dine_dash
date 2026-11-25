import AddMenuCardWrapper from "@/app/components/menu/AddMenuCardWrapper";
import { Suspense } from "react";
export default async function MenuManage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-sm text-gray-500">
            Manage your restaurant dishes and prices.
          </p>
        </div>
      </div>
      <Suspense fallback={<div>Loading Menu... </div>}>
        <AddMenuCardWrapper />
      </Suspense>
    </div>
  );
}
