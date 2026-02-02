"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Tag,
  DollarSign,
  FileText,
  Boxes,
  ListChecks,
  Upload, 
  Star,
  Check,
  ArrowLeft,
} from "lucide-react";
import { db, auth, provider, signInWithPopup } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import AdminNavbar from "@/Components/admin/AdminNavbar";

const categories = [
  { name: "Skincare", slug: "skincare", img: "/skincare.png" },
  { name: "Facial Care", slug: "facial-care", img: "/facialcare.png" },
  { name: "Hair Care", slug: "hair-care", img: "/haircare.png" },
  { name: "Scents", slug: "perfumes", img: "/perfume.png" },
  { name: "Baby Care", slug: "baby-care", img: "/babycare.jpeg" },
];

export default function AddProductPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [category, setCategory] = useState("skincare");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Auto calculate discount %
  useEffect(() => {
    if (!actualPrice) {
      setDiscountPercent(0);
      return;
    }
    const actual = Number(actualPrice);
    const discounted = discountedPrice ? Number(discountedPrice) : actual;
    const percent = Math.round(((actual - discounted) / actual) * 100);
    setDiscountPercent(percent);
  }, [actualPrice, discountedPrice]);

  // ✅ Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!preset || !cloudName) throw new Error("Cloudinary ENV missing");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  // ✅ Submit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !actualPrice || !description || !imageFile) {
      alert("⚠️ Please fill all required fields and upload an image");
      return;
    }
    setLoading(true);

    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);
      const actual = Number(actualPrice);
      const discounted = discountedPrice ? Number(discountedPrice) : actual;

      await addDoc(collection(db, "products"), {
        title,
        category,
        actualPrice: actual,
        discountedPrice: discounted,
        discountPercent,
        description,
        specs,
        benefits,
        featured,
        imageUrl,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || null,
      });

      alert("✅ Product added successfully!");

      // Reset form
      setTitle("");
      setActualPrice("");
      setDiscountedPrice("");
      setDiscountPercent(0);
      setDescription("");
      setSpecs([]);
      setBenefits([]);
      setCategory("skincare");
      setFeatured(false);
      setImageFile(null);
      const fileInput = document.getElementById("imageInput") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <p className="text-sm text-slate-300">Checking authentication...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
        <p className="text-lg font-medium">🚫 You must be signed in</p>
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-emerald-500"
        >
          Sign in with Google
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminNavbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/adminhn">
              <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100">
                <ArrowLeft className="h-4 w-4" /> Back to orders
              </button>
            </Link>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              ➕ Add new product
            </h1>
          </div>
        </div>

        <motion.form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Title */}
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
        </div>

        {/* Price */}
        <div className="flex gap-3">
          <div className="flex w-1/3 items-center gap-2">
            <DollarSign className="h-5 w-5 text-slate-400" />
            <input
              type="number"
              placeholder="Actual Price"
              value={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
            />
          </div>
          <div className="flex w-1/3 items-center gap-2">
            <DollarSign className="h-5 w-5 text-slate-400" />
            <input
              type="number"
              placeholder="Discounted Price"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
            />
          </div>
          <div className="flex w-1/3 items-center gap-2">
            <DollarSign className="h-5 w-5 text-slate-400" />
            <input
              type="number"
              placeholder="Discount %"
              value={discountPercent}
              readOnly
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start gap-2">
          <FileText className="mt-2 h-5 w-5 text-slate-400" />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
          />
        </div>

        {/* Specs */}
        <div className="flex items-start gap-2">
          <Boxes className="mt-2 h-5 w-5 text-slate-400" />
          <textarea
            placeholder="Specs (comma separated)"
            value={specs.join(", ")}
            onChange={(e) => setSpecs(e.target.value.split(",").map((s) => s.trim()))}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
          />
        </div>

        {/* Benefits */}
        <div className="flex items-start gap-2">
          <ListChecks className="mt-2 h-5 w-5 text-slate-400" />
          <textarea
            placeholder="Benefits (comma separated)"
            value={benefits.join(", ")}
            onChange={(e) => setBenefits(e.target.value.split(",").map((b) => b.trim()))}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
          />
        </div>

        {/* Category */}
        <div>
          <p className="mb-2 text-sm font-medium text-slate-100">Select category</p>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.slug}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCategory(cat.slug)}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 text-xs transition ${
                  category === cat.slug
                    ? "border-emerald-500 bg-slate-900"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                <img src={cat.img} alt={cat.name} className="h-10 w-10 rounded-full border border-slate-700" />
                <p className="text-xs text-slate-200">{cat.name}</p>
                {category === cat.slug && <Check className="h-4 w-4 text-emerald-400" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div
          className="flex cursor-pointer items-center gap-2 text-sm"
          onClick={() => setFeatured(!featured)}
        >
          <Star
            className={`h-5 w-5 ${
              featured ? "fill-yellow-400 text-yellow-400" : "text-slate-400"
            }`}
          />
          <span>{featured ? "Featured product" : "Mark as featured"}</span>
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Upload className="h-5 w-5 text-slate-400" />
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="text-xs text-slate-300"
          />
        </div>

        {/* Preview Image */}
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="h-32 w-32 rounded-lg border border-slate-700 object-cover"
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-emerald-500 disabled:opacity-60"
        >
          <Check className="h-5 w-5" />
          {loading ? "Adding..." : "Add product"}
        </button>
        </motion.form>
      </div>
    </div>
  );
}