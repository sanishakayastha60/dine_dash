"use client";
import { useState, useTransition } from "react";
import { updateBusinessVerification } from "@/actions/BusinessInfoAction";

type Business = {
  id: string;
  name: string;
  address: string;
  phoneNumber: string | null;
  businessType: string;
  description: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  isVerified: boolean | false;
};

export default function BusinessTable({
  businesses,
}: {
  businesses: Business[];
}) {
  const [isPending, startTransition] = useTransition();
  const [businessList, setBusinessList] = useState(businesses);

  const handleVerification = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await updateBusinessVerification(id, !currentStatus);

      if (result.success) {
        setBusinessList((prev) =>
          prev.map((business) =>
            business.id === id
              ? { ...business, isVerified: business.isVerified }
              : business,
          ),
        );
      } else {
        alert(result.message);
      }
    });
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">Business Name</th>
            <th className="border p-3">Owner</th>
            <th className="border p-3">Email</th>
            <th className="border p-3">Phone</th>
            <th className="border p-3">Address</th>
            <th className="border p-3">Business Type</th>
            <th className="border p-3">Verification Status</th>
            <th className="border p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {businessList.map((business) => (
            <tr key={business.id}>
              <td className="border p-3">{business.name}</td>
              <td className="border p-3">{business.user.name || "N/A"}</td>
              <td className="border p-3">{business.user.email || "N/A"}</td>
              <td className="border p-3">{business.phoneNumber || "N/A"}</td>
              <td className="border p-3">{business.address}</td>
              <td className="border p-3">{business.businessType}</td>
              <td className="border-p-3">
                {" "}
                {business.isVerified ? "Verified" : "Not Verified"}{" "}
              </td>
              <td className="border p-3">
                <button
                  disabled={isPending}
                  onClick={() =>
                    handleVerification(business.id, business.isVerified)
                  }
                  className={`px-3 py-2 rounded text-white disabled:opacity-50 ${
                    business.isVerified
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {business.isVerified ? "Unverify" : "Verify"}
                </button>
              </td>
            </tr>
          ))}

          {businessList.length === 0 && (
            <tr>
              <td colSpan={6} className="p-5 text-center">
                No businesses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
