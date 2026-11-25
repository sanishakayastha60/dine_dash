"use client";

import { useEffect, useState, useTransition } from "react";
import { BusinessType } from "@/generated/prisma/enums";
import ImageUploader from "@/app/components/ImageUploader";
import { getBusinessInfo } from "@/actions/BusinessInfoAction";
import { updateBusinessInfo } from "@/actions/BusinessInfoAction";

const fieldClass = `p-2 bg-[#dcd8cc] rounded-md border-2 border-transparent border-b-2 border-l-2 border-b-black border-l-black transition-all duration-300 ease-in-out focus:border-r-2 focus:border-r-black focus:border-t-2 focus:border-t-black focus:outline-none focus:border-b-0 focus:border-l-0 focus:scale-[1.005] focus:shadow-md`;

const labelClass = `text-[#000033] text-sm font-semibold tracking-wide`;

const initialForm = {
  id: "",
  name: "",
  location: "",
  number: "",
  type: "",
  description: "",
  special: "",
};

export default function ProfileForm() {
  const [form, setForm] = useState(initialForm);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const result = await getBusinessInfo();

        if (result.success && result.business) {
          const business = result.business;

          setForm({
            id: business.id,
            name: business.name || "",
            location: business.address || "",
            number: business.phoneNumber || "",
            type: business.businessType || "",
            description: business.description || "",
            special: business.specialNotice || "",
          });

          setCoverImageUrl(business.coverUrl || "");
          setLogoImageUrl(business.logoUrl || "");
        } else {
          setError(result.message || "Unable to load business information");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load business information");
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateBusinessInfo(formData);

      if (!result?.success) {
        setError(result?.message || "Failed to update business");
        return;
      }

      setMessage("Business profile updated successfully!");
    });
  };

  if (loading) {
    return <div className="p-8">Loading business information...</div>;
  }

  return (
    <div className="bg-[#E3DFD3] min-h-screen w-full p-4 md:px-8">
      <h2 className="text-3xl uppercase font-bold text-[#872408] pt-6">
        Business Profile
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 py-4 md:grid md:grid-cols-2 md:gap-8"
      >
        <input type="hidden" name="id" value={form.id} />

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="name">
            Business Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={fieldClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="location">
            Business Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className={fieldClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="number">
            Business Contact Number
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={form.number}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="type">
            Type of Business
          </label>
          <select
            name="type"
            id="type"
            value={form.type}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="">Select Business Type</option>
            {Object.values(BusinessType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="description">
            Brand Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="special">
            Special Notice
          </label>
          <textarea
            rows={4}
            name="specialNotice"
            id="special"
            value={form.special}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>

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
                className="w-20 h-20 rounded-xl object-cover"
              />
              <input type="hidden" name="cover" value={coverImageUrl} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="logo">
            Logo Image
          </label>
          <ImageUploader onUpload={setLogoImageUrl} />

          {logoImageUrl && (
            <div>
              <img
                src={logoImageUrl}
                alt="Logo"
                className="w-20 h-20 rounded-xl object-cover"
              />
              <input type="hidden" name="logo" value={logoImageUrl} />
            </div>
          )}
        </div>

        {error && <p className="text-red-600 text-sm md:col-span-2">{error}</p>}

        {message && (
          <p className="text-green-700 text-sm md:col-span-2">{message}</p>
        )}

        <div className="w-full flex justify-center md:col-start-2 md:justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#8D2831] rounded-md px-4 text-white p-2 text-center focus:bg-[#632223] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save & Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
