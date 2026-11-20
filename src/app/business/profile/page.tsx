"use client";

import { useState } from "react";
import { BusinessType } from "@/generated/prisma/enums";
import ImageUploader from "@/app/components/ImageUploader";
import { updateBusinessInfo } from "@/actions/BusinessInfoAction";

export default function BusinessProfile() {
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  return (
    <div>
      <h2>Profile</h2>
      <form action={updateBusinessInfo}>
        <div>
          <input type="hidden" name="id" />
          <label htmlFor="name">Business Name</label>
          <input type="text" id="name" name="name" className="border" />
        </div>
        <div>
          <label htmlFor="location">Business Location</label>
          <input type="text" id="location" name="location" className="border" />
        </div>
        {/* <div>
          <label htmlFor="opening">Opening Hours</label>
          <input type="text" id="opening" name="opening" className="border" />
        </div> */}
        <div>
          <label htmlFor="number">Business Contact Number</label>
          <input type="text" id="number" name="number" className="border" />
        </div>
        <div>
          <label htmlFor="description">Brand Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className="border"
          />
        </div>
        <div>
          <label htmlFor="type">Type of Business</label>
          <select name="type" id="type">
            <option value="">Select Business Type</option>
            {Object.values(BusinessType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cover">Cover Image</label>
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
        <div>
          <label htmlFor="logo">Logo Image Url</label>
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
        <div>
          <label htmlFor="special">Special Notice</label>
          <textarea name="special" id="special"></textarea>
        </div>
        <div>
          <button type="submit">Save & Update Profile</button>
        </div>
      </form>
    </div>
  );
}
