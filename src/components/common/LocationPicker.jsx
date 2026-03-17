import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MdLocationOn, MdSearch } from "react-icons/md";

// Fix lỗi mất icon marker mặc định của Leaflet trong React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Tọa độ mặc định (Hồ Chí Minh)
const defaultCenter = [10.762622, 106.660172];

const LocationPicker = ({
  onLocationSelect,
  initialAddress,
  initialPosition,
}) => {
  const [position, setPosition] = useState(
    initialPosition?.lat && initialPosition?.lng
      ? [initialPosition.lat, initialPosition.lng]
      : defaultCenter,
  );
  const [address, setAddress] = useState(initialAddress || "");
  const [searchText, setSearchText] = useState("");
  const mapRef = useRef(null);

  // Lắng nghe sự thay đổi của initialPosition (khi Admin mở Modal của 1 giao dịch đã có tọa độ)
  useEffect(() => {
    if (initialPosition?.lat && initialPosition?.lng) {
      const newPos = [initialPosition.lat, initialPosition.lng];
      setPosition(newPos);
      if (mapRef.current) {
        mapRef.current.flyTo(newPos, 15); // Tự động dời tâm bản đồ tới vị trí cũ
      }
    }
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialPosition, initialAddress]);

  // Gọi API miễn phí của Nominatim để lấy tên đường từ Tọa độ
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();
      const foundAddress = data.display_name;
      setAddress(foundAddress);

      if (onLocationSelect) {
        onLocationSelect({ address: foundAddress, lat, lng });
      }
    } catch (error) {
      console.error("Lỗi lấy địa chỉ:", error);
    }
  };

  // Click trên bản đồ để chọn tọa độ mới
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        getAddressFromCoords(lat, lng);
      },
    });
    return null;
  };

  // Tìm kiếm địa chỉ bằng Text
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const newAddress = data[0].display_name;

        setPosition([lat, lng]);
        setAddress(newAddress);

        if (mapRef.current) {
          mapRef.current.flyTo([lat, lng], 15);
        }

        if (onLocationSelect) {
          onLocationSelect({ address: newAddress, lat, lng });
        }
      } else {
        alert("Không tìm thấy địa chỉ này!");
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Thanh Tìm kiếm */}
      <form onSubmit={handleSearch} className="relative z-[400]">
        <MdSearch className="absolute top-3.5 left-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Gõ tên đường, quận, thành phố (VD: Quận 1)..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full pl-10 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bg-zinc-900 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-orange-600 transition-colors"
        >
          Tìm
        </button>
      </form>

      {/* Khung Bản Đồ */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
        <MapContainer
          center={position}
          zoom={13}
          style={{ width: "100%", height: "350px" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents />
          {position && <Marker position={position}></Marker>}
        </MapContainer>
      </div>

      {/* Hiển thị địa chỉ đã chọn cho User thấy */}
      {address && (
        <div className="bg-orange-50 p-3 rounded-lg flex items-start gap-2 border border-orange-100">
          <MdLocationOn className="text-orange-500 mt-0.5 shrink-0" size={20} />
          <p className="text-sm text-gray-800 font-medium leading-relaxed">
            {address}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
