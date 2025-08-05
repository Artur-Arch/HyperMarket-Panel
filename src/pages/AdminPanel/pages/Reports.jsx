import React, { useState, useEffect } from "react";
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  FileText,
  BarChart3,
  PieChart,
  ShoppingBag,
} from "lucide-react";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const month = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Майь",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const currentMonthName = month[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedReport, setSelectedReport] = useState("sales");
  const [soldProducts, setSoldProducts] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [showFullInventoryValue, setShowFullInventoryValue] = useState(false);
  const [categories, setCategories] = useState([]);

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  // Определение reportTypes
  const reportTypes = [
    { id: "sales", name: "Сотувлар Ҳисоботи", icon: DollarSign },
    { id: "inventory", name: "Инвентар Ҳисоботи", icon: Package },
    { id: "customers", name: "Ходимлар Ҳисоботи", icon: Users },
    { id: "financial", name: "Филиаллар Ҳисоботи", icon: BarChart3 },
  ];

  // Вычисление totalRevenue как суммы (price × quantity) всех проданных товаров
  const totalRevenue = soldProducts.reduce((acc, item) => {
    const price = Number(item.marketPrice) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty; // Учитываем price × quantity
  }, 0);

  // Фильтрация продуктов по выбранному месяцу для monthlyStats и topProducts
  const filteredProducts = soldProducts.filter((item) => {
    if (!item.soldDate) return false;
    const saleMonth = new Date(item.soldDate).toLocaleString("uz-UZ", {
      month: "long",
    });
    return saleMonth.toLowerCase() === selectedMonth.toLowerCase();
  });

  const totalSales = filteredProducts.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0
  );

  const averageOrder =
    totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;

  // Формирование topProducts для выбранного месяца
  const topProducts = [...filteredProducts]
    .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
    .slice(0, 5)
    .map((item) => ({
      name: item.name,
      sales: item.quantity,
      revenue: (item.price || 0) * (item.quantity || 0),
    }));

  const inventoryData = {
    totalProducts: allProducts.length,
    lowStockItems: allProducts.filter((p) => p.quantity > 0 && p.quantity < 5)
      .length,
    outOfStockItems: allProducts.filter((p) => p.quantity === 0).length,
    totalValue: allProducts.reduce(
      (acc, p) => acc + (Number(p.marketPrice) || 0) * Number(p.quantity || 0),
      0
    ),
  };

  const customerData = {
    totalCustomers: 892,
    newCustomers: 45,
    returningCustomers: 567,
    customerGrowth: 8.1,
  };

  useEffect(() => {
    const fetchSoldProducts = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Токен доступа отсутствует");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://suddocs.uz/products", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Маълумотларни олишда хатолик");

        const data = await response.json();
        const sold = data.filter((item) => item.status === "SOLD");
        setAllProducts(data);
        setSoldProducts(sold);

        // Агрегация monthlyStats из soldProducts
        const stats = months.map((month) => {
          const monthProducts = sold.filter((item) => {
            if (!item.soldDate) return false;
            const saleMonth = new Date(item.soldDate).toLocaleString("uz-UZ", {
              month: "long",
            });
            return saleMonth.toLowerCase() === month.toLowerCase();
          });

          const sales = monthProducts.reduce((acc, item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 0;
            return acc + price * qty;
          }, 0);

          const orders = monthProducts.reduce(
            (acc, item) => acc + Number(item.quantity || 0),
            0
          );

          return { month, sales, orders };
        });

        // Загрузка категорий
        try {
          const catResponse = await fetch("https://suddocs.uz/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!catResponse.ok) throw new Error("Категорияларни олишда хатолик");

          const catData = await catResponse.json();
          setCategories(catData);
        } catch (catErr) {
          console.error("Категория хатоси:", catErr);
        }

        setMonthlyStats(stats.filter((stat) => stat.orders > 0));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSoldProducts();
  }, []);

  const StatCard = ({
    title,
    value,
    change,
    isPositive,
    icon: Icon,
    suffix = "",
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value}
            {suffix}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="text-green-500 mr-1" size={16} />
              ) : (
                <TrendingDown className="text-red-500 mr-1" size={16} />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}%
              </span>
              <span className="text-gray-500 text-sm ml-1">
                охирги ойга нисбатан
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="text-blue-600" size={24} />
        </div>
      </div>
    </div>
  );

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Умумий Даромад"
          value={totalRevenue.toLocaleString("uz-UZ")}
          change={0}
          isPositive={true}
          icon={DollarSign}
          suffix=" сўм"
        />
        <StatCard
          title="Жами Сотувлар"
          value={totalSales}
          change={0}
          isPositive={true}
          icon={ShoppingCart}
        />
        <StatCard
          title="Ўртача Буюртма"
          value={averageOrder.toLocaleString("uz-UZ")}
          change={0}
          isPositive={true}
          icon={TrendingUp}
          suffix=" сўм"
        />
        <StatCard
          title="Фаол Мижозлар"
          value={customerData.returningCustomers}
          change={8.1}
          isPositive={true}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ойлик Статистика
          </h3>
          <div className="space-y-4">
            {monthlyStats.length > 0 ? (
              monthlyStats.map((stat) => (
                <div
                  key={stat.month}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{stat.month}</p>
                    <p className="text-sm text-gray-500">
                      {stat.orders} буюртма
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {stat.sales.toLocaleString("uz-UZ")}
                    </p>
                    <p className="text-sm text-gray-500">сўм</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Нет данных о продажах</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Энг Кўп Сотиладиган Маҳсулотлар ({selectedMonth})
          </h3>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border-l-4 border-blue-400 pl-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.sales} дона сотилди
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {product.revenue.toLocaleString("uz-UZ")}
                    </p>
                    <p className="text-sm text-gray-500">сўм</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Нет данных о проданных продуктах за {selectedMonth}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const totalQuantity = allProducts.reduce(
    (acc, p) => acc + (p.quantity || 0),
    0
  );

  const renderInventoryReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Жами Маҳсулотлар"
          value={inventoryData.totalProducts}
          icon={Package}
        />
        <StatCard
          title="Кам Қолган Маҳсулотлар"
          value={inventoryData.lowStockItems}
          icon={TrendingDown}
        />
        <StatCard
          title="Тугаган Маҳсулотлар"
          value={inventoryData.outOfStockItems}
          icon={ShoppingBag}
        />
        <div className="relative">
          <StatCard
            title="Инвентар Қиймати"
            value={
              showFullInventoryValue
                ? inventoryData.totalValue.toLocaleString("uz-UZ")
                : (inventoryData.totalValue / 1_000_000).toFixed(1)
            }
            icon={DollarSign}
            suffix={showFullInventoryValue ? " сўм" : "M сўм"}
          />
          <button
            onClick={() => setShowFullInventoryValue(!showFullInventoryValue)}
            className="absolute top-2 right-2 text-xs text-blue-600 underline hover:text-blue-800"
          >
            {showFullInventoryValue ? "Камроқ" : "Кўпроқ"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Категория Бўйича Тақсимот
        </h3>

        {categories.length === 0 ? (
          <p className="text-gray-500">Категориялар юкланмади</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryQty = (category.products || []).reduce(
                (sum, p) => sum + (p.quantity || 0),
                0
              );
              const percent =
                totalQuantity > 0
                  ? Math.round((categoryQty / totalQuantity) * 100)
                  : 0;

              return (
                <div key={category.id} className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">{category.name}</h4>
                  <p className="text-2xl font-bold text-blue-700">
                    {categoryQty}
                  </p>
                  <p className="text-sm text-blue-600">
                    {percent}% умумий инвентардан
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderCustomersReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Жами Мижозлар"
          value={customerData.totalCustomers}
          change={customerData.customerGrowth}
          isPositive={true}
          icon={Users}
        />
        <StatCard
          title="Янги Мижозлар"
          value={customerData.newCustomers}
          change={12.3}
          isPositive={true}
          icon={TrendingUp}
        />
        <StatCard
          title="Қайтган Мижозлар"
          value={customerData.returningCustomers}
          change={5.7}
          isPositive={true}
          icon={ShoppingBag}
        />
        <StatCard
          title="VIP Мижозлар"
          value={23}
          change={8.9}
          isPositive={true}
          icon={TrendingUp}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Мижозлар Фаоллиги
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Фаол (охирги 30 кун)
              </span>
              <span className="text-sm font-semibold text-green-600">
                567 (64%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: "64%" }}
              ></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Нофаол (30+ кун)
              </span>
              <span className="text-sm font-semibold text-yellow-600">
                325 (36%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: "36%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Умумий Даромад"
          value={(totalRevenue / 1000000).toFixed(1)}
          change={12.5}
          isPositive={true}
          icon={DollarSign}
          suffix="M сўм"
        />
        <StatCard
          title="Фойда"
          value="34.2"
          change={8.3}
          isPositive={true}
          icon={TrendingUp}
          suffix="M сўм"
        />
        <StatCard
          title="Харажатлар"
          value="111.1"
          change={-3.2}
          isPositive={false}
          icon={TrendingDown}
          suffix="M сўм"
        />
        <StatCard
          title="Фойда Улуши"
          value="23.5"
          change={4.1}
          isPositive={true}
          icon={BarChart3}
          suffix="%"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Молиявий Кўрсаткичлар
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Даромад Манбаалари</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Телефон сотувлари</span>
                <span className="text-sm font-semibold text-blue-600">45%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Ноутбук сотувлари</span>
                <span className="text-sm font-semibold text-green-600">
                  32%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium">Аксессуарлар</span>
                <span className="text-sm font-semibold text-purple-600">
                  23%
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Харажат Тақсимоти</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">Ходимлар маоши</span>
                <span className="text-sm font-semibold text-red-600">40%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium">Инвентар харидлари</span>
                <span className="text-sm font-semibold text-orange-600">
                  35%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">Бошқа харажатлар</span>
                <span className="text-sm font-semibold text-yellow-600">
                  25%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case "sales":
        return renderSalesReport();
      case "inventory":
        return renderInventoryReport();
      case "customers":
        return renderCustomersReport();
      case "financial":
        return renderFinancialReport();
      default:
        return renderSalesReport();
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Загрузка данных...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center">
        Ошибка загрузки данных: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Ҳисоботлар ва Таҳлиллар
          </h1>
          <p className="text-gray-500 mt-1">Бизнес кўрсаткичлари ва таҳлили</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Бу ҳафта</option>
            <option value="month">Бу ой</option>
            <option value="quarter">Бу чорак</option>
            <option value="year">Бу йил</option>
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Download size={20} className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`flex items-center p-4 rounded-lg border-2 transition-colors duration-200 ${
                  selectedReport === type.id
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <Icon size={24} className="mr-3" />
                <span className="font-medium">{type.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {renderReportContent()}
    </div>
  );
};

export default Reports;
