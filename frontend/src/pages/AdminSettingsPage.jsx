import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const SETTINGS_STORAGE_KEY = "aadityas-midway-admin-settings";

const DEFAULT_SETTINGS = {
  restaurantName: "AADITYA MIDWAY & Restaurant",
  tagline: "Good food, Good mood",
  phone: "8435172222",
  location: "Gokuldham, Aaditya Smart City, Kairitaigaon",
  gst: "5",
  defaultPaymentMethod: "Cash on Delivery",
  acceptOrders: true,
};

function AdminSettingsPage() {
  const { user, token } = useAuth();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(
        SETTINGS_STORAGE_KEY
      );

      if (storedSettings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(storedSettings),
        });
      }
    } catch (error) {
      console.error(
        "Failed to load admin settings:",
        error
      );
    }
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to save admin settings:",
        error
      );
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(DEFAULT_SETTINGS)
    );
    setSaved(false);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#173F35]">
          Settings
        </h1>

        <p className="mt-1 text-sm text-[#625F56]">
          Manage your restaurant and admin preferences.
        </p>
      </div>

      {/* Save notification */}
      {saved && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Settings saved successfully.
        </div>
      )}

      <div className="mt-8 space-y-6">
        {/* Admin Profile */}
        <section className="rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35] text-lg font-bold text-white">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-[#173F35]">
                Admin Profile
              </h2>

              <p className="mt-1 text-sm text-[#8A867C]">
                Your authenticated administrator account.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                Name
              </label>

              <input
                type="text"
                value={user?.name || "Admin"}
                disabled
                className="w-full rounded-xl border border-[#E8E1D2] bg-[#FAF6EC] px-4 py-3 text-sm text-[#625F56] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                Email
              </label>

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full rounded-xl border border-[#E8E1D2] bg-[#FAF6EC] px-4 py-3 text-sm text-[#625F56] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                Role
              </label>

              <input
                type="text"
                value={user?.role || "admin"}
                disabled
                className="w-full rounded-xl border border-[#E8E1D2] bg-[#FAF6EC] px-4 py-3 text-sm capitalize text-[#625F56] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                Authentication
              </label>

              <div className="flex h-[46px] items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 text-sm font-medium text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Authenticated
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant Information */}
        <section className="rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#173F35]">
              Restaurant Information
            </h2>

            <p className="mt-1 text-sm text-[#8A867C]">
              Update the information displayed throughout
              the restaurant website.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                Restaurant Name
              </label>

              <input
                type="text"
                name="restaurantName"
                value={settings.restaurantName}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8CFBD] bg-white px-4 py-3 text-sm text-[#24231F] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                Tagline
              </label>

              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8CFBD] bg-white px-4 py-3 text-sm text-[#24231F] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8CFBD] bg-white px-4 py-3 text-sm text-[#24231F] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={settings.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8CFBD] bg-white px-4 py-3 text-sm text-[#24231F] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>
          </div>
        </section>

        {/* Order Settings */}
        <section className="rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#173F35]">
              Order Settings
            </h2>

            <p className="mt-1 text-sm text-[#8A867C]">
              Configure basic ordering preferences.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                GST Rate
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="gst"
                  min="0"
                  max="100"
                  value={settings.gst}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#D8CFBD] bg-white px-4 py-3 pr-12 text-sm text-[#24231F] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#8A867C]">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#625F56]">
                Default Payment Method
              </label>

              <select
                name="defaultPaymentMethod"
                value={settings.defaultPaymentMethod}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8CFBD] bg-white px-4 py-3 text-sm text-[#24231F] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              >
                <option>Cash on Delivery</option>
                <option>Cash</option>
                <option>Online Payment</option>
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#E8E1D2] bg-[#FAF6EC] p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="acceptOrders"
                checked={settings.acceptOrders}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-[#173F35]"
              />

              <div>
                <p className="text-sm font-semibold text-[#173F35]">
                  Accept new orders
                </p>

                <p className="mt-1 text-xs text-[#625F56]">
                  Allow customers to place new orders through
                  the website.
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* System Information */}
        <section className="rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#173F35]">
              System Information
            </h2>

            <p className="mt-1 text-sm text-[#8A867C]">
              Current application and environment information.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-[#E8E1D2] bg-[#FAF6EC] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#8A867C]">
                Environment
              </p>

              <p className="mt-2 font-semibold text-[#173F35]">
                {import.meta.env.MODE || "development"}
              </p>
            </div>

            <div className="rounded-xl border border-[#E8E1D2] bg-[#FAF6EC] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#8A867C]">
                API
              </p>

              <p className="mt-2 font-semibold text-green-700">
                Connected
              </p>

              <p className="mt-1 truncate text-xs text-[#8A867C]">
                {import.meta.env.VITE_API_URL ||
                  "http://localhost:5000"}
              </p>
            </div>

            <div className="rounded-xl border border-[#E8E1D2] bg-[#FAF6EC] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#8A867C]">
                Authentication
              </p>

              <p className="mt-2 font-semibold text-green-700">
                {token ? "Token available" : "Not authenticated"}
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E8E1D2] bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-[#173F35]">
              Save your changes
            </h2>

            <p className="mt-1 text-sm text-[#8A867C]">
              Restaurant settings are saved locally for this
              prototype.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="rounded-xl border border-[#D8CFBD] bg-white px-5 py-3 text-sm font-semibold text-[#625F56] transition hover:bg-[#FAF6EC]"
            >
              Reset
            </button>

            <button
              onClick={handleSave}
              className="rounded-xl bg-[#173F35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0F2D26]"
            >
              Save Changes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminSettingsPage;