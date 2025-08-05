import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, Scan, RotateCcw } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DefectiveManagement = () => {
  const [products, setProducts] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [returnBarcodeInput, setReturnBarcodeInput] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!token) return toast.error("Token topilmadi!");

    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("https://suddocs.uz/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://suddocs.uz/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        toast.error("Xatolik yuz berdi: " + err.message);
      }
    };

    fetchData();
  }, []);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return alert("Token topilmadi!");

    axios
      .get("https://suddocs.uz/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => alert("Xatolik yuz berdi: " + err.message));
  }, []);

  const updateProductStatus = async (barcode, status) => {
    const product = products.find((p) => p.barcode === barcode.trim());
    if (!product) return toast.error("Mahsulot topilmadi!");
    if (product.status === status)
      return toast.warning(`Bu mahsulot allaqachon ${status} deb belgilangan!`);

    try {
      await axios.put(
        `https://suddocs.uz/products/${product.id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(
        products.map((p) => (p.id === product.id ? { ...p, status } : p))
      );

      if (status === "DEFECTIVE") {
        setBarcodeInput("");
        toast.success(`${product.name} brak deb belgilandi!`);
      } else if (status === "RETURNED") {
        setReturnBarcodeInput("");
        toast.success(`${product.name} qaytarilgan deb belgilandi!`);
      }
    } catch (err) {
      toast.error("Statusni o`zgartirishda xatolik: " + err.message);
    }
  };

  const restoreProduct = async (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      await axios.put(
        `https://suddocs.uz/products/${product.id}`,
        { status: "active" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, status: "active" } : p
        )
      );
      toast.success(`${product.name} qayta faollashtirildi!`);
    } catch (err) {
      toast.error("Qayta faollashtirishda xatolik: " + err.message);
    }
  };

  const defectiveProducts = products.filter((p) => p.status === "DEFECTIVE");
  const returnedProducts = products.filter((p) => p.status === "RETURNED");

  return (
    <div style={{ marginLeft: "255px" }} className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Brak va Qaytarilgan Mahsulotlar
          </h1>
          <p className="text-gray-600 mt-1">
            Mahsulotlarni brak yoki qaytarilgan deb belgilash
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brak */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Brak Mahsulot
              </h2>
              <p className="text-gray-600 text-sm">
                Barcode orqali brak deb belgilash
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Barcode kiriting..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  updateProductStatus(barcodeInput, "DEFECTIVE")
                }
              />
            </div>
            <button
              onClick={() => updateProductStatus(barcodeInput, "DEFECTIVE")}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Brak deb belgilash</span>
            </button>
          </div>
        </div>

        {/* Qaytarilgan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <RotateCcw className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Qaytarilgan Mahsulot
              </h2>
              <p className="text-gray-600 text-sm">
                Barcode orqali qaytarilgan deb belgilash
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={returnBarcodeInput}
                onChange={(e) => setReturnBarcodeInput(e.target.value)}
                placeholder="Barcode kiriting..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  updateProductStatus(returnBarcodeInput, "RETURNED")
                }
              />
            </div>
            <button
              onClick={() =>
                updateProductStatus(returnBarcodeInput, "RETURNED")
              }
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Qaytarilgan deb belgilash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Brak List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Brak Mahsulotlar ({defectiveProducts.length})
          </h2>
        </div>
        <div className="p-6">
          {defectiveProducts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Brak mahsulotlar yo'q</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-red-700">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-red-700">
                      Название
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-red-700">
                      Категория
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-red-700">
                      Филиал
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-red-700">
                      Штрихкод
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {defectiveProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {product.id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td>
                        {categories.find(
                          (cat) => String(cat.id) === String(product.categoryId)
                        )?.name || "Неизвестно"}
                      </td>

                      <td className="px-4 py-2 text-sm text-gray-900">
                        {product.branch?.name || "No'malum"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {product.barcode}
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <button
                          onClick={() => restoreProduct(product.id)}
                          className="text-[#1178f8] hover:text-[#0f6ae5] text-sm font-medium"
                        >
                          Восстановить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Returned List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Qaytarilgan Mahsulotlar ({returnedProducts.length})
          </h2>
        </div>
        <div className="p-6">
          {returnedProducts.length === 0 ? (
            <div className="text-center py-8">
              <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Qaytarilgan mahsulotlar yo'q</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-orange-700">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-orange-700">
                      Название
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-orange-700">
                      Категория
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-orange-700">
                      Филиал
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-orange-700">
                      Штрихкод
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {returnedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {product.id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {categories.find((c) => String(c.id) === String(product.categoryId))?.name || "Неизвестно"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {product.branch?.name || "No'malum"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {product.barcode || "—"}
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <button
                          onClick={() => restoreProduct(product.id)}
                          className="text-[#1178f8] hover:text-[#0f6ae5] text-sm font-medium"
                        >
                          Восстановить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefectiveManagement;
