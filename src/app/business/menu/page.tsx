import AddMenuCardWrapper from "@/app/components/menu/AddMenuCardWrapper";
import { Suspense } from "react";
export default async function MenuManage() {
  return (
    <Suspense fallback={<div>Loading Menu... </div>}>
      <AddMenuCardWrapper />
    </Suspense>
  );
}
