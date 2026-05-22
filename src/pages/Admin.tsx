import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/providers/trpc";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Crown,
  ArrowLeft,
  Users,
  Search,
  Eye,
  EyeOff,
  UserCheck,
  Hash,
  Phone,
  Building2,
  AlertCircle,
  Loader2,
  X,
  Ticket,
} from "lucide-react";

const ADMIN_PIN = "2026";

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [lookupResult, setLookupResult] = useState<{
    id: number;
    fullName: string;
    phone: string;
    department: string;
    departmentNumber: string;
    uniqueCode: string;
    createdAt: Date;
  } | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [showLookup, setShowLookup] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false);

  const { data: stats, isLoading: statsLoading } =
    trpc.registration.getStats.useQuery(undefined, {
      enabled: isAuthenticated,
      refetchInterval: 10000,
    });

  const { data: availability } = trpc.registration.getAvailability.useQuery(
    undefined,
    { enabled: isAuthenticated, refetchInterval: 10000 }
  );

  const { data: lookupData, isFetching: lookupFetching } =
    trpc.registration.lookupByCode.useQuery(
      { code: searchCode.trim() },
      { enabled: triggerSearch && searchCode.trim().length > 0 }
    );

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setPinError(false);

    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }

    if (index === 3 && value) {
      const enteredPin = [...newPin.slice(0, 3), value].join("");
      if (enteredPin === ADMIN_PIN) {
        setIsAuthenticated(true);
      } else {
        setPinError(true);
        setPin(["", "", "", ""]);
        document.getElementById("pin-0")?.focus();
      }
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setLookupError("");
    setLookupResult(null);
    setTriggerSearch(false);
    setTimeout(() => setTriggerSearch(true), 10);
  };

  // Handle lookup result
  if (triggerSearch && !lookupFetching && lookupData !== undefined) {
    setTriggerSearch(false);
    if (lookupData) {
      setLookupResult(lookupData as typeof lookupResult);
      setLookupError("");
    } else {
      setLookupResult(null);
      setLookupError("لم يتم العثور على هذا الكود");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative" dir="rtl">
        <AnimatedBackground />
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 glass"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>رجوع</span>
            </button>
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-bold text-gradient">نادي رحيق الثقافة</span>
            </div>
          </div>
        </motion.nav>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-sm w-full"
          >
            <div className="glass rounded-3xl p-8 glow-purple">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <Crown className="w-8 h-8 text-purple-400" />
              </motion.div>

              <h1 className="text-xl font-bold text-center text-white mb-2">
                لوحة التحكم
              </h1>
              <p className="text-gray-400 text-sm text-center mb-8">
                أدخل الرقم السري للدخول
              </p>

              <AnimatePresence>
                {pinError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>رمز خاطئ، حاول مرة أخرى</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-center gap-3" dir="ltr">
                {pin.map((digit, i) => (
                  <motion.input
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    className="w-14 h-16 text-center text-2xl font-bold rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" dir="rtl">
      <AnimatedBackground />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>رجوع</span>
          </button>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <span className="text-lg font-bold text-gradient">نادي رحيق الثقافة</span>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-black text-gradient mb-2">لوحة التحكم</h1>
            <p className="text-gray-400">إدارة الحفل والمسجلين</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 glow-gold"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">إجمالي المسجلين</p>
                  <motion.p
                    key={stats?.totalCount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-black text-gradient"
                  >
                    {statsLoading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                    ) : (
                      stats?.totalCount || 0
                    )}
                  </motion.p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-amber-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 glow-purple"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">المقاعد المتاحة</p>
                  <p className={`text-2xl font-bold ${(availability?.remaining ?? 80) <= 10 ? "text-red-400" : "text-emerald-400"}`}>
                    {availability?.remaining ?? 80} <span className="text-sm text-gray-400 font-normal">/ 80</span>
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <Ticket className="w-7 h-7 text-purple-400" />
                </div>
              </div>
              {/* Mini Progress */}
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    ((availability?.reserved ?? 0) / 80) * 100 >= 90 ? "bg-red-500" : ((availability?.reserved ?? 0) / 80) * 100 >= 70 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${((availability?.reserved ?? 0) / 80) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">حالة التسجيل</p>
                  <p className={`text-2xl font-bold ${availability?.isFull ? "text-red-400" : "text-emerald-400"}`}>
                    {availability?.isFull ? "مكتمل" : "مفتوح"}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <UserCheck className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Code Lookup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <button
              onClick={() => setShowLookup(!showLookup)}
              className="w-full glass rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Search className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-white">التحقق من كود الحضور</h3>
                  <p className="text-gray-400 text-sm">ابحث عن كود للتحقق من هوية الشخص</p>
                </div>
              </div>
              {showLookup ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {showLookup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-2xl p-6 mt-4">
                    <form onSubmit={handleLookup} className="flex gap-3">
                      <input
                        type="text"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                        placeholder="أدخل كود الحضور"
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        dir="ltr"
                      />
                      <motion.button
                        type="submit"
                        disabled={lookupFetching}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 font-bold disabled:opacity-60"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {lookupFetching ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Search className="w-5 h-5" />
                        )}
                      </motion.button>
                    </form>

                    <AnimatePresence>
                      {lookupError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center flex items-center justify-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {lookupError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {lookupResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="mt-4 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-5 h-5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">تم التحقق</span>
                            </div>
                            <button
                              onClick={() => {
                                setLookupResult(null);
                                setSearchCode("");
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Hash className="w-4 h-4 text-amber-400" />
                              <span className="text-gray-400 text-sm">الكود:</span>
                              <span className="text-white font-bold font-mono" dir="ltr">
                                {lookupResult.uniqueCode}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Users className="w-4 h-4 text-purple-400" />
                              <span className="text-gray-400 text-sm">الاسم:</span>
                              <span className="text-white font-bold">
                                {lookupResult.fullName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-emerald-400" />
                              <span className="text-gray-400 text-sm">الهاتف:</span>
                              <span className="text-white font-bold" dir="ltr">
                                {lookupResult.phone}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Building2 className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-400 text-sm">القسم:</span>
                              <span className="text-white font-bold">
                                {lookupResult.department}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Hash className="w-4 h-4 text-pink-400" />
                              <span className="text-gray-400 text-sm">الرقم في القسم:</span>
                              <span className="text-white font-bold">
                                {lookupResult.departmentNumber}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Registrations Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">قائمة المسجلين</h2>
              <span className="text-sm text-gray-400">
                {stats?.totalCount || 0} مسجل
              </span>
            </div>

            {statsLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
              </div>
            ) : stats?.registrations && stats.registrations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-5 py-4 text-right text-sm font-medium text-gray-400">
                        #
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-medium text-gray-400">
                        الاسم
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-medium text-gray-400">
                        الهاتف
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-medium text-gray-400">
                        القسم
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-medium text-gray-400">
                        الرقم
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-medium text-gray-400">
                        الكود
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.registrations.map((reg, i) => (
                      <motion.tr
                        key={reg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                        <td className="px-5 py-4 text-sm text-white font-medium">
                          {reg.fullName}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-300" dir="ltr">
                          {reg.phone}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-300">
                          {reg.department}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-300">
                          {reg.departmentNumber}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-mono font-bold">
                            {reg.uniqueCode}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>لا يوجد مسجلين بعد</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
