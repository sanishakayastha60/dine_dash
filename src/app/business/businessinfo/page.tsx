"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBusinessInfo } from "@/actions/BusinessInfoAction";
import ImageUploader from "@/app/components/ImageUploader";

const initialForm = {
  businessName: "",
  description: "",
  address: "",
  phone: "",
  businessType: "RESTAURANT",
  specialNotice: "",
  coverUrl: "",
  logoUrl: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-black";

const fieldClass = `p-2 bg-[#dcd8cc] rounded-md border-2 border-transparent border-b-2 border-l-2 border-b-black border-l-black transition-all duration-300 ease-in-out focus:border-r-2 focus:border-r-black focus:border-t-2 focus:border-t-black focus:outline-none focus:border-b-0 focus:border-l-0 focus:scale-[1.005] focus:shadow-md`;

const labelClass = `text-[#000033] text-sm font-semibold tracking-wide`;

export default function BusinessInfo() {
  const router = useRouter();

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();

    formData.set("name", form.businessName);
    formData.set("description", form.description);
    formData.set("location", form.address);
    formData.set("type", form.businessType);
    formData.set("number", form.phone);
    formData.set("specialNotice", form.specialNotice);
    formData.set("cover", form.coverUrl);
    formData.set("logo", form.logoUrl);

    startTransition(async () => {
      const result = await createBusinessInfo(formData);

      if (!result?.success) {
        setError(result?.message || "Something went wrong.");
        return;
      }

      setForm(initialForm);
      router.refresh();
      router.push("/business/profile");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-semibold text-lg">Business Information</h2>

      <input
        name="businessName"
        placeholder="Business Name"
        value={form.businessName}
        onChange={handleChange}
        required
        className={inputClass}
      />

      <select
        name="businessType"
        value={form.businessType}
        onChange={handleChange}
        className={inputClass}
      >
        <option value="RESTAURANT">Restaurant</option>
        <option value="CLOUD_KITCHEN">Cloud Kitchen</option>
        <option value="BAKERY">Bakery</option>
        <option value="CAFE">Cafe</option>
        <option value="OTHER">Other</option>
      </select>

      <textarea
        name="description"
        placeholder="Business Description"
        value={form.description}
        onChange={handleChange}
        rows={3}
        className={inputClass}
      />

      <textarea
        name="address"
        placeholder="Business Address"
        value={form.address}
        onChange={handleChange}
        required
        rows={2}
        className={inputClass}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Business Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
        className={inputClass}
      />
      <textarea
        name="specialNotice"
        placeholder="Special Notice (optional)"
        value={form.specialNotice}
        onChange={handleChange}
        rows={2}
        className={inputClass}
      />
      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="cover">
          Cover Image
        </label>
        <ImageUploader onUpload={setCoverImageUrl} />
        {coverImageUrl && (
          <div>
            <img
              src={coverImageUrl}
              alt="CoverPhoto"
              className="w-20 h-20 rounded-xl"
            />
            <input type="text" placeholder={coverImageUrl} />
            <input type="hidden" name="cover" value={coverImageUrl} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="logo">
          Logo Image Url
        </label>
        <ImageUploader onUpload={setLogoImageUrl} />
        {logoImageUrl && (
          <div>
            <img
              src={logoImageUrl}
              alt="Logo"
              className="w-20 h-20 rounded-xl"
            />
            <input type="text" placeholder={logoImageUrl} />
            <input type="hidden" name="logo" value={logoImageUrl} />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {isPending ? "Creating Business..." : "Create Business"}
      </button>
    </form>
  );
}
