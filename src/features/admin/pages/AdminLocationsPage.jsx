import React, { useState } from "react";
import {
  MdAdd,
  MdLocationOn,
  MdEdit,
  MdDelete,
  MdMap,
  MdCheckCircle,
  MdCancel,
  MdSearch,
  MdClose,
  MdSave,
  MdPhone,
  MdPerson,
  MdStore,
} from "react-icons/md";

const MOCK_LOCATIONS = [
  {
    id: 1,
    name: "Trạm OldBike Đống Đa",
    address: "123 Xã Đàn, P. Phương Liên, Q. Đống Đa, Hà Nội",
    mapLink: "https://goo.gl/maps/example1",
    status: "active",
    manager: "Nguyễn Văn Quản Lý",
    phone: "0912 345 678",
  },
  {
    id: 2,
    name: "Trạm OldBike Quận 1",
    address: "45 Lê Thánh Tôn, P. Bến Nghé, Q.1, TP. HCM",
    mapLink: "https://goo.gl/maps/example2",
    status: "active",
    manager: "Trần Thị Trưởng Trạm",
    phone: "0909 123 456",
  },
  {
    id: 3,
    name: "Trạm OldBike Đà Nẵng",
    address: "88 Bạch Đằng, Q. Hải Châu, Đà Nẵng",
    mapLink: "https://goo.gl/maps/example3",
    status: "maintenance",
    manager: "Lê Văn Miền Trung",
    phone: "0988 777 666",
  },
];

const AdminLocationsPage = () => {
  const [locations, setLocations] = useState(MOCK_LOCATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mapLink: "",
    manager: "",
    phone: "",
    status: "active",
  });

  // --- HANDLERS ---
  const handleOpenModal = (location = null) => {
    if (location) {
      setEditingLocation(location);
      setFormData(location);
    } else {
      setEditingLocation(null);
      setFormData({
        name: "",
        address: "",
        mapLink: "",
        manager: "",
        phone: "",
        status: "active",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingLocation) {
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === editingLocation.id ? { ...formData, id: loc.id } : loc,
        ),
      );
    } else {
      const newId = locations.length + 1;
      setLocations((prev) => [...prev, { ...formData, id: newId }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Xác nhận xóa địa điểm này?")) {
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    }
  };

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Hệ thống Trạm
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý các điểm giao dịch trực tiếp trên toàn quốc
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl shadow-gray-200 transform hover:-translate-y-1"
        >
          <MdAdd size={20} /> Thêm trạm mới
        </button>
      </div>

      {/* --- SEARCH --- */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center">
        <div className="pl-4 text-gray-400">
          <MdSearch size={24} />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm địa chỉ, tên trạm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 font-medium"
        />
      </div>

      {/* --- GRID LOCATIONS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => (
          <div
            key={loc.id}
            className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col"
          >
            {/* Header Card */}
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MdStore size={24} />
              </div>
              {loc.status === "active" ? (
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
                  Hoạt động
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                  Bảo trì
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {loc.name}
              </h3>
              <a
                href={loc.mapLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1 mb-4"
              >
                <MdMap /> Xem chỉ đường
              </a>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                  <MdLocationOn className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium leading-snug">
                    {loc.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shrink-0">
                      <MdPerson size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Quản lý
                      </p>
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {loc.manager}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shrink-0">
                      <MdPhone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Hotline
                      </p>
                      <p className="text-xs font-bold text-gray-900">
                        {loc.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions (Hiện khi hover) */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => handleOpenModal(loc)}
                className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <MdEdit size={16} /> Sửa
              </button>
              <button
                onClick={() => handleDelete(loc.id)}
                className="p-2 bg-white border border-gray-200 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingLocation ? "Cập nhật thông tin" : "Thêm trạm mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <MdClose size={24} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                    Tên trạm
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-medium text-gray-900"
                    placeholder="VD: Trạm Cầu Giấy"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                    Địa chỉ chi tiết
                  </label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-medium text-gray-900 resize-none"
                    placeholder="Số nhà, đường, phường..."
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                      Quản lý
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-medium text-gray-900"
                      placeholder="Tên quản lý"
                      value={formData.manager}
                      onChange={(e) =>
                        setFormData({ ...formData, manager: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                      Hotline
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-medium text-gray-900"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                    Google Maps Link
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-medium text-blue-600"
                    placeholder="https://maps.google.com/..."
                    value={formData.mapLink}
                    onChange={(e) =>
                      setFormData({ ...formData, mapLink: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="text-sm font-bold text-gray-700">
                    Trạng thái trạm:
                  </label>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, status: "active" })
                      }
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${formData.status === "active" ? "bg-white shadow-sm text-green-600" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Hoạt động
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, status: "maintenance" })
                      }
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${formData.status === "maintenance" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Bảo trì
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-black shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MdSave size={20} /> Lưu trạm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLocationsPage;
