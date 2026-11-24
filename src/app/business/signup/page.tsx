"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

const initialForm = {
  ownerName: "",
  email: "",
  phone: "",
  password: "",
};

export default function BusinessSignupPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/business-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // automatic sign in : login garepaxi
      const result = await signIn("business-credentials", {
        identifier: form.phone.trim(),
        password: form.password,
        redirect: false,
      });
      if (!result || result.error) {
        setError(
          "Account created successfully but automatic login failed. Please log In",
        );
        router.push("/business/login");
        return;
      }
      // successfully logged in user le automatic login bhako
      router.push("/business/businessinfo");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black focus:ring-1 focus:ring-black";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-center text-3xl font-bold">
          Register Your Business
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Create your business account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <h2 className="font-semibold text-lg">Owner Information</h2>

          <input
            name="ownerName"
            placeholder="Owner Name"
            value={form.ownerName}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address (optional)"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <input
            name="password"
            type="password"
            placeholder="Password (minimum 8 characters)"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
            className={inputClass}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black p-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Business"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have a business account?{" "}
          <Link
            href="/business/login"
            className="font-semibold text-black hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
