"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Edit, Trash2, ArrowLeft, Star, DollarSign, Tag, Upload, Check } from "lucide-react";
import { auth, signOut } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";

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
  { name: "Parlour Items", slug: "parlour-items" },
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

  const router = useRouter();

  // ✅ Auth check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push("/login");
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

  if (!user) return <div className="p-10 text-center">Checking auth...</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-950 text-white">
      <button
        onClick={() => router.push("/adminhn")}
        className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Manage Products</h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {editingProduct ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 p-6 rounded-2xl max-w-lg mx-auto space-y-4"
        >
          <h2 className="text-xl font-bold">✏️ Edit Product</h2>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
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
              className="w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
            <input
              type="number"
              name="discountedPrice"
              placeholder="Discounted Price"
              value={formData.discountedPrice}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
          </div>

          <input
            type="text"
            name="discountPercent"
            value={formData.discountPercent}
            readOnly
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-300"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
          />

          <textarea
            name="specs"
            placeholder="Specs (comma separated)"
            value={formData.specs.join(", ")}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
          />

          <textarea
            name="benefits"
            placeholder="Benefits (comma separated)"
            value={formData.benefits.join(", ")}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span>Featured</span>
          </div>

          <input type="file" name="imageFile" onChange={handleChange} />
          {formData.imageFile ? (
            <img
              src={URL.createObjectURL(formData.imageFile)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          ) : (
            <img src={formData.imageUrl} alt="Current" className="w-32 h-32 object-cover rounded-lg" />
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Save
            </button>
            <button
              onClick={() => setEditingProduct(null)}
              className="flex-1 bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 p-5 rounded-2xl shadow-lg flex flex-col items-center"
            >
              <img src={product.imageUrl} alt={product.title} className="w-32 h-32 object-cover rounded-lg mb-4" />
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" /> {product.title}
              </h2>
              <p className="text-sm text-gray-400 capitalize">Category: {product.category}</p>
              <div className="flex items-center gap-2 mt-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="line-through text-gray-500">Rs. {product.actualPrice}</span>
                <span className="text-white font-bold">Rs. {product.discountedPrice}</span>
                <span className="text-green-400 text-sm">({product.discountPercent}% off)</span>
              </div>
              {product.featured && (
                <div className="flex items-center gap-1 mt-2 text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span className="text-sm">Featured</span>
                </div>
              )}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-lg text-sm"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
