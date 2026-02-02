"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Edit, Trash2, ArrowLeft, Star, DollarSign, Tag, Upload, Check } from "lucide-react";
import { auth } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import AdminNavbar from "@/Components/admin/AdminNavbar";

interface Product {
  id: string;
  title: string;
  category: string;
  actualPrice: number;
  discountedPrice: number;
  discountPercent: number;
  description: string;
  specs: string[];
  benefits: string[];
  featured: boolean;
  imageUrl: string;
}

interface ProductFormData {
  title: string;
  category: string;
  actualPrice: number;
  discountedPrice: number;
  discountPercent: number;
  description: string;
  specs: string[];
  benefits: string[];
  featured: boolean;
  imageUrl: string;
  imageFile: File | null;
}

const categories = [
  { name: "Skincare", slug: "skincare" },
  { name: "Facial Care", slug: "facial-care" },
  { name: "Hair Care", slug: "hair-care" },
  { name: "Scents", slug: "perfumes" },
  { name: "Baby Care", slug: "baby-care" },
];

export default function ManageProductsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    category: "skincare",
    actualPrice: 0,
    discountedPrice: 0,
    discountPercent: 0,
    description: "",
    specs: [],
    benefits: [],
    featured: false,
    imageUrl: "",
    imageFile: null,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const router = useRouter();

  // ✅ Auth check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push("/adminhn/auth");
    });
    return () => unsubscribe();
  }, [router]);

  // ✅ Fetch products
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // ✅ Delete product
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  // ✅ Edit product
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product, imageFile: null });
  };

  // ✅ Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, files } = e.target as any;
    let val: any = value;

    if (type === "checkbox") val = checked;
    if (type === "file") val = files[0];

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };

      if (name === "actualPrice" || name === "discountedPrice") {
        const actual = name === "actualPrice" ? Number(value) : prev.actualPrice;
        const discounted = name === "discountedPrice" ? Number(value) : prev.discountedPrice;
        updated.discountPercent = actual && discounted ? Math.round(((actual - discounted) / actual) * 100) : 0;
      }

      if (name === "specs") updated.specs = value.split(",").map((s: string) => s.trim());
      if (name === "benefits") updated.benefits = value.split(",").map((b: string) => b.trim());

      return updated;
    });
  };

  // ✅ Save updates to Firebase
  const handleSave = async () => {
    if (!editingProduct) return;
    let imageUrl = formData.imageUrl;

    if (formData.imageFile) {
      const data = new FormData();
      data.append("file", formData.imageFile);
      data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const file = await res.json();
      imageUrl = file.secure_url;
    }

    await updateDoc(doc(db, "products", editingProduct.id), {
      title: formData.title,
      category: formData.category,
      actualPrice: Number(formData.actualPrice),
      discountedPrice: Number(formData.discountedPrice),
      discountPercent: Number(formData.discountPercent),
      description: formData.description,
      specs: formData.specs,
      benefits: formData.benefits,
      featured: formData.featured,
      imageUrl,
    });

    setEditingProduct(null);
  };

  if (!user)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm text-slate-300">Checking admin authentication...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminNavbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/adminhn")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </button>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            📦 Manage products
          </h1>
        </div>

        {editingProduct ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="text-xl font-semibold text-slate-50">✏️ Edit product</h2>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-emerald-500/60"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-emerald-500/60"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="number"
              name="actualPrice"
              placeholder="Actual Price"
              value={formData.actualPrice}
              onChange={handleChange}
              className="w-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-emerald-500/60"
            />
            <input
              type="number"
              name="discountedPrice"
              placeholder="Discounted Price"
              value={formData.discountedPrice}
              onChange={handleChange}
              className="w-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-emerald-500/60"
            />
          </div>

          <input
            type="text"
            name="discountPercent"
            value={formData.discountPercent}
            readOnly
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-emerald-500/60"
          />

          <textarea
            name="specs"
            placeholder="Specs (comma separated)"
            value={formData.specs.join(", ")}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-emerald-500/60"
          />

          <textarea
            name="benefits"
            placeholder="Benefits (comma separated)"
            value={formData.benefits.join(", ")}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-emerald-500/60"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border border-slate-500"
            />
            <span>Featured</span>
          </div>

          <input
            type="file"
            name="imageFile"
            onChange={handleChange}
            className="text-xs text-slate-300"
          />
          {formData.imageFile ? (
            <img
              src={URL.createObjectURL(formData.imageFile)}
              alt="Preview"
              className="h-32 w-32 rounded-lg object-cover"
            />
        ) : (
            <img src={formData.imageUrl} alt="Current" className="h-32 w-32 rounded-lg object-cover" />
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              <Check className="w-5 h-5" /> Save
            </button>
            <button
              onClick={() => setEditingProduct(null)}
              className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <>
        {/* Category filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedCategory === "all"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCategory === cat.slug
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading products...</p>
        ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products
            .filter((product) =>
              selectedCategory === "all"
                ? true
                : product.category === selectedCategory
            )
            .map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="mb-4 h-32 w-32 rounded-lg object-cover"
              />
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Tag className="h-4 w-4 text-slate-400" /> {product.title}
              </h2>
              <p className="mt-1 text-xs capitalize text-slate-400">
                Category: {product.category}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span className="line-through text-slate-500">
                  Rs. {product.actualPrice}
                </span>
                <span className="font-semibold text-slate-50">
                  Rs. {product.discountedPrice}
                </span>
                <span className="text-xs text-emerald-400">
                  ({product.discountPercent}% off)
                </span>
              </div>
              {product.featured && (
                <div className="mt-2 flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <span className="text-sm">Featured</span>
                </div>
              )}
              <div className="mt-5 flex w-full gap-3">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex flex-1 items-center gap-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-400"
                >
                  <Edit className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex flex-1 items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium hover:bg-red-500"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
