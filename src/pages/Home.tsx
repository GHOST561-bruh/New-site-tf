import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/providers/trpc";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  PartyPopper,
  User,
  Phone,
  Building2,
  Hash,
  Sparkles,
  Crown,
  CheckCircle2,
  Loader2,
  Ticket,
  AlertTriangle,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentNumber, setDepartmentNumber] = useState("");
  const [error, setError] = useState("");

  const { data: availability } = trpc.registration.getAvailability.useQuery(
    undefined,
    { refetchInterval: 5000 }
  );

  const isFull = availability?.isFull ?? false;
  const remaining = availability?.remaining ?? 80;
  const reserved = availability?.reserved ?? 0;

  const registerMutation = trpc.registration.register.useMutation({
    onSuccess: (data) => {
      navigate("/success", {
        state: {
          uniqueCode: data.uniqueCode,
          fullName: data.fullName,
          phone: data.phone,
          department: data.department,
          departmentNumber: data.departmentNumber,
        },
      });
    },
    onError: (err) => {
      if (err.message === "SEATS_FULL") {
        setError("عذراً، انتهت جميع المقاعد (80/80)");
      } else {
        setError(err.message || "حدث خطأ أثناء التسجيل");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull) return;
    setError("");

    if (!fullName.trim() || !phone.trim() || !department.trim() || !departmentNumber.trim()) {
      setError("جميع الحقول مطلوبة");
      return;
    }

    registerMutation.mutate({
      fullName: fullName.trim(),
      phone: phone.trim(),
      department: department.trim(),
      departmentNumber: departmentNumber.trim(),
    });
  };

  const seatProgress = ((reserved ?? 0) / 80) * 100;
  const progressColor =
    seatProgress >= 90 ? "bg-red-500" : seatProgress >= 70 ? "bg-amber-500" : "bg-emerald-500";
  const isLow = remaining <= 10;

  return (
    <div className="min-h-screen relative" dir="rtl">
      <AnimatedBackground />

      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <Crown className="w-6 h-6 text-amber-400" />
            <span className="text-lg font-bold text-gradient">نادي رحيق الثقافة</span>
          </motion.div>
          <motion.button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-amber-400 hover:bg-amber-400/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Crown className="w-4 h-4" />
            <span>لوحة التحكم</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block"
            >
              <PartyPopper className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            </motion.div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            <span className="text-gradient">حفلة نهاية السنة</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            سجل الآن حضورك لحفلة نهاية السنة الاحتفالية. احجز مكانك وكن جزءاً من
            لحظات لا تُنسى مع زملائك وأصدقائك.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <motion.div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-amber-400 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>تجربة فريدة</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-purple-400 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تسجيل فوري</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-amber-400 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Hash className="w-4 h-4" />
              <span>كود تأكيد فريد</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Seats Progress Bar */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Ticket className={`w-5 h-5 ${isLow ? "text-red-400" : "text-emerald-400"}`} />
                <span className="text-sm font-medium text-gray-300">المقاعد المتاحة</span>
              </div>
              <span className={`text-sm font-bold ${isLow ? "text-red-400" : "text-emerald-400"}`}>
                {remaining} / 80
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-3">
              <motion.div
                className={`h-full rounded-full ${progressColor} ${isLow ? "shadow-lg shadow-red-500/30" : ""}`}
                initial={{ width: 0 }}
                animate={{ width: `${seatProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{reserved} محجوز</span>
              <span className="text-xs text-gray-500">الحد: 80</span>
            </div>

            {isLow && remaining > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-amber-400 text-xs">
                  بقيت {remaining} مقاعد فقط! سارع بالتسجيل قبل انتهاء المقاعد.
                </span>
              </motion.div>
            )}

            {isFull && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-xs font-bold">
                  عذراً، انتهت جميع المقاعد! لا يمكن التسجيل حالياً.
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Registration Form */}
      <section className="relative z-10 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg mx-auto"
        >
          <div className={`glass rounded-3xl p-6 sm:p-10 ${isFull ? "" : "glow-gold"}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">سجل حضورك</h2>
              <p className="text-gray-400 text-sm">
                {isFull ? "انتهت المقاعد" : "املأ البيانات التالية للتسجيل في الحفل"}
              </p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm text-gray-300 mb-2 font-medium">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    disabled={isFull}
                    className="w-full pr-10 pl-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all disabled:opacity-50"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm text-gray-300 mb-2 font-medium">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="أدخل رقم هاتفك"
                    disabled={isFull}
                    className="w-full pr-10 pl-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all disabled:opacity-50"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm text-gray-300 mb-2 font-medium">
                  القسم
                </label>
                <div className="relative">
                  <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="أدخل اسم القسم"
                    disabled={isFull}
                    className="w-full pr-10 pl-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all disabled:opacity-50"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm text-gray-300 mb-2 font-medium">
                  الرقم في القسم
                </label>
                <div className="relative">
                  <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={departmentNumber}
                    onChange={(e) => setDepartmentNumber(e.target.value)}
                    placeholder="أدخل رقمك في القسم"
                    disabled={isFull}
                    className="w-full pr-10 pl-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all disabled:opacity-50"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={registerMutation.isPending || isFull}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  isFull
                    ? "bg-gray-500/20 text-gray-400 shadow-none border border-gray-500/20"
                    : "bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 shadow-amber-500/25 hover:shadow-amber-500/40"
                }`}
                whileHover={isFull ? {} : { scale: 1.02, y: -2 }}
                whileTap={isFull ? {} : { scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري التسجيل...</span>
                  </>
                ) : isFull ? (
                  <>
                    <AlertTriangle className="w-5 h-5" />
                    <span>انتهت المقاعد</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>تسجيل الحضور</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">
            كيف يعمل النظام
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <User className="w-8 h-8" />,
                title: "سجل بياناتك",
                desc: "أدخل اسمك ورقم هاتفك وقسمك ورقمك في القسم",
                color: "text-amber-400",
                bg: "from-amber-500/20 to-yellow-500/10",
              },
              {
                icon: <Hash className="w-8 h-8" />,
                title: "احصل على كودك",
                desc: "بعد التسجيل، سيظهر لك كود فريد خاص بك",
                color: "text-purple-400",
                bg: "from-purple-500/20 to-fuchsia-500/10",
              },
              {
                icon: <CheckCircle2 className="w-8 h-8" />,
                title: "حضر الحفل",
                desc: "أعطِ الكود للمسؤول عند وصولك للحفل للتأكد",
                color: "text-emerald-400",
                bg: "from-emerald-500/20 to-teal-500/10",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className={`glass rounded-2xl p-6 text-center bg-gradient-to-b ${step.bg} border-white/10`}
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 ${step.color}`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Admin CTA */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="glass rounded-2xl p-8 glow-purple">
            <Crown className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">مسؤول الحفل؟</h3>
            <p className="text-gray-400 text-sm mb-6">
              ادخل إلى لوحة التحكم لمعرفة عدد المسجلين والتحقق من أكواد الحضور
            </p>
            <motion.button
              onClick={() => navigate("/admin")}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown className="w-4 h-4" />
              <span>لوحة التحكم</span>
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          نادي رحيق الثقافة © 2026 - جميع الحقوق محفوظة
        </motion.p>
      </footer>
    </div>
  );
}
