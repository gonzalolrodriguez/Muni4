// Card informativa para Home, con glassmorphism y el icono arriba del título
const InfoCard = ({ icon, title, desc }) => (
  <div
    className="flex flex-col items-center text-center p-6 rounded-2xl border border-cyan-200 shadow-lg transition hover:scale-105 hover:shadow-2xl"
    style={{
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      border: "1px solid rgba(0, 180, 216, 0.25)",
      background:
        "linear-gradient(135deg, rgba(21,94,117,0.10) 0%, rgba(255,255,255,0.85) 100%)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }}
  >
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100/60 mb-3 shadow-md">
      <span className="text-cyan-600 text-4xl flex items-center justify-center">
        {icon}
      </span>
    </div>
    <h3
      className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-700 via-cyan-500 to-cyan-700 bg-clip-text text-transparent"
      style={{
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {title}
    </h3>
    <p className="text-black text-sm">{desc}</p>
  </div>
);

export default InfoCard;
