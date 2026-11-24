<<<<<<< Updated upstream
"use client";
=======
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/app/components/ProfileForm";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
>>>>>>> Stashed changes

import { useState } from "react";
import { BusinessType } from "@/generated/prisma/enums";
import ImageUploader from "@/app/components/ImageUploader";
import { updateBusinessInfo } from "@/actions/BusinessInfoAction";

const fieldClass = `p-2 bg-[#dcd8cc] rounded-md border-2 border-transparent border-b-2 border-l-2 border-b-black border-l-black transition-all duration-300 ease-in-out focus:border-r-2 focus:border-r-black focus:border-t-2 focus:border-t-black focus:outline-none focus:border-b-0 focus:border-l-0 focus:scale-[1.005] focus:shadow-md`;

const labelClass = `text-[#000033] text-sm font-semibold tracking-wide`;

export default function BusinessProfile() {
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  return (
    <div className="bg-[#E3DFD3] min-h-screen w-full p-4 md:px-8">
      <h2 className="text-3xl uppercase font-bold text-[#872408] pt-6">
        Business Profile
      </h2>
      <form
        action={updateBusinessInfo}
        className="flex flex-col gap-4 py-4 md:grid md:grid-cols-2 md:gap-8"
      >
        <input type="hidden" name="id" />
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="name">
            Business Name
          </label>
          <input type="text" id="name" name="name" className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="location">
            Business Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className={fieldClass}
          />
        </div>
        {/* <div>
          <label className={labelClass} htmlFor="opening">Opening Hours</label>
          <input type="text" id="opening" name="opening" className="border" />
        </div> */}
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="tel">
            Business Contact Number
          </label>
          <input type="text" id="number" name="number" className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="type">
            Type of Business
          </label>
          <select name="type" id="type" className={fieldClass}>
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
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="special">
            Special Notice
          </label>
          <textarea
            rows={4}
            name="special"
            id="special"
            className={fieldClass}
          ></textarea>
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
        <div className="w-full flex justify-center md:col-start-2 md:justify-end">
          <button
            type="submit"
            className="bg-[#8D2831] rounded-md px-4 text-white p-2 text-center focus:bg-[#632223]"
          >
            Save & Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
<<<<<<< Updated upstream
=======

async function DashboardContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/business/login");
  }

  if (session.user.role !== "BUSINESS") {
    redirect("/");
  }
  const business = await prisma.businessInfo.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      isVerfied: true,
    },
  });

  if (!business) {
    redirect("/business/businessinfo");
  }

  if (!business.isVerfied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold">Verification Pending</h1>

          <p className="mt-3 text-gray-600">
            Your business, <strong>{business.name}</strong>, has been registered
            successfully.
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Our team is reviewing your business information. You will be able to
            access your business dashboard once your business has been verified.
          </p>
        </div>
      </div>
    );
  }

  return <ProfileForm />;
}
>>>>>>> Stashed changes
