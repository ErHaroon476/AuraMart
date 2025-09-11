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
import {
  db,
  auth,
  provider,
  signInWithPopup,
  signOut,
} from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";

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
    return <p className="p-6 text-center text-gray-300">Checking authentication...</p>;

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-950 text-gray-100">
        <p className="text-lg font-medium">🚫 You must be signed in</p>
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/adminhn">
            <button className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold">➕ Add New Product</h1>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg"
        >
          Sign Out
        </button>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-lg mx-auto p-6 border rounded-2xl shadow-md bg-gray-900 border-gray-800"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Title */}
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-600"
          />
        </div>

        {/* Price */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 w-1/3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <input
              type="number"
              placeholder="Actual Price"
              value={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
              className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2 w-1/3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <input
              type="number"
              placeholder="Discounted Price"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2 w-1/3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <input
              type="number"
              placeholder="Discount %"
              value={discountPercent}
              readOnly
              className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start gap-2">
          <FileText className="w-5 h-5 text-gray-400 mt-2" />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-4 py-2"
          />
        </div>

        {/* Specs */}
        <div className="flex items-start gap-2">
          <Boxes className="w-5 h-5 text-gray-400 mt-2" />
          <textarea
            placeholder="Specs (comma separated)"
            value={specs.join(", ")}
            onChange={(e) => setSpecs(e.target.value.split(",").map((s) => s.trim()))}
            className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-4 py-2"
          />
        </div>

        {/* Benefits */}
        <div className="flex items-start gap-2">
          <ListChecks className="w-5 h-5 text-gray-400 mt-2" />
          <textarea
            placeholder="Benefits (comma separated)"
            value={benefits.join(", ")}
            onChange={(e) => setBenefits(e.target.value.split(",").map((b) => b.trim()))}
            className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-4 py-2"
          />
        </div>

        {/* Category */}
        <div>
          <p className="font-medium mb-2">Select Category:</p>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.slug}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.slug)}
                className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition ${
                  category === cat.slug
                    ? "border-indigo-500 bg-gray-800"
                    : "border-gray-700 bg-gray-900"
                }`}
              >
                <img src={cat.img} alt={cat.name} className="w-10 h-10" />
                <p className="text-sm text-gray-200">{cat.name}</p>
                {category === cat.slug && <Check className="w-4 h-4 text-green-500" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setFeatured(!featured)}
        >
          <Star className={`w-5 h-5 ${featured ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
          <span>{featured ? "Featured Product" : "Mark as Featured"}</span>
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-gray-400" />
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="text-gray-300"
          />
        </div>

        {/* Preview Image */}
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-700"
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg shadow disabled:opacity-50"
        >
          <Check className="w-5 h-5" />
          {loading ? "Adding..." : "Add Product"}
        </button>
      </motion.form>
    </div>
  );
}