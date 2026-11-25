"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "../ImageUploader";
import { createMenuItem } from "@/actions/MenuItemAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenuSection } from "@/generated/prisma/enums";

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
};

const labelField = "text-xs pb-1";
const inputField =
  "rounded-md p-2 bg-white focus:outline-none focus:shadow-sm border";

export default function AddMenuCard({ categories }: Props) {
  const router = useRouter();

  const [foodImage, setFoodImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    formData.set("foodCategory", String(formData.get("categoryId") || ""));
    formData.set("dishImage", foodImage);

    try {
      const result = await createMenuItem(formData);

      if (!result) {
        setMessage("Something went wrong. Please try again.");
        return;
      }

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setMessage(result.message);
      setFoodImage("");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Menu creation failed:", error);
      setMessage("Failed to create menu item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline">Add Menu Item</Button>}
      />

      <DialogContent className="sm:max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle>Introduce a New Dish</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-3" action={handleSubmit}>
          <div className="flex flex-col">
            <label className={labelField}>Dish Name</label>
            <input name="name" type="text" required className={inputField} />
          </div>

          <div className="flex flex-col">
            <label className={labelField}>Dish Description</label>
            <textarea name="description" rows={3} className={inputField} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className={labelField}>Price</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                className={inputField}
              />
            </div>

            <div className="flex flex-col">
              <label className={labelField}>Est. Preparation Time (mins)</label>
              <input
                name="estimatedTime"
                type="number"
                min="1"
                required
                className={inputField}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className={labelField}>Menu Section</label>
              <select
                name="menuSection"
                required
                className={inputField}
                defaultValue=""
              >
                <option value="" disabled>
                  Select Menu Section
                </option>

                {Object.values(MenuSection).map((section) => (
                  <option value={section} key={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className={labelField}>Food Category</label>
              <select
                name="categoryId"
                required
                className={inputField}
                defaultValue=""
              >
                <option value="" disabled>
                  Select Category
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelField}>Image of the Dish</label>

            <ImageUploader onUpload={setFoodImage} />

            {foodImage && (
              <div className="mt-2">
                <img
                  src={foodImage}
                  alt="Dish"
                  className="w-20 h-20 object-cover"
                />
              </div>
            )}

            <input type="hidden" name="imageUrl" value={foodImage} />
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
