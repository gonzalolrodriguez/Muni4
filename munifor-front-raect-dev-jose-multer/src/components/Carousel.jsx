// Carrousel simple con imágenes y textos, siguiendo el estilo de MuniFor
import { useState, useEffect } from "react";

const slides = [
  {
    img: "../../assets/img/image.jpg",
    title: "Gestión de Reportes",
    desc: "Reporta incidentes y problemas de tu ciudad de manera rápida y sencilla desde cualquier dispositivo.",
  },
  {
    img: "../assets/img/carousel2.jpg",
    title: "Seguimiento de Tareas",
    desc: "Visualiza el avance de las tareas municipales y mantente informado sobre el progreso en tiempo real.",
  },
  {
    img: "../assets/img/carousel3.jpg",
    title: "Participación Ciudadana",
    desc: "Involúcrate en la mejora de tu comunidad y colabora con el municipio para una ciudad mejor.",
  },
];

const statusButtons = [
  { label: "Todos", color: "from-cyan-400 to-cyan-600" },
  { label: "Pendiente", color: "from-yellow-300 to-yellow-500" },
  { label: "En Progreso", color: "from-blue-300 to-blue-600" },
  { label: "Finalizado", color: "from-green-300 to-green-600" },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  // Estado para el botón seleccionado (opcional, si quieres que sean interactivos)
  const [selected, setSelected] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  // Autoavance cada 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-cyan-200 bg-white/10 backdrop-blur-xl"
      style={{
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        border: "1px solid rgba(0, 180, 216, 0.25)",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Botones de estado arriba del carrusel */}
      <div className="flex justify-center gap-4 py-4 bg-transparent z-10">
        {statusButtons.map((btn, i) => (
          <button
            key={btn.label}
            className={`px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-200 border border-white/40 backdrop-blur-md bg-gradient-to-br ${
              btn.color
            } text-cyan-900/90 hover:scale-105 hover:shadow-lg hover:text-white hover:border-cyan-400 ${
              selected === i ? "ring-2 ring-cyan-400" : ""
            }`}
            style={{
              background:
                selected === i
                  ? "linear-gradient(135deg, rgba(0,212,255,0.25) 0%, rgba(255,255,255,0.25) 100%)"
                  : undefined,
              color: selected === i ? "#fff" : undefined,
              fontWeight: selected === i ? 700 : 500,
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
      {/* Contenido del carrusel sin imagen */}
      <div
        className="relative flex flex-col justify-center items-center p-6 min-h-[300px]"
        style={{
          background:
            "linear-gradient(to top, rgba(21,94,117,0.85) 0%, rgba(21,94,117,0.55) 50%, rgba(255,255,255,0.01) 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="rounded-2xl bg-white/80 backdrop-blur-md p-4 shadow-lg max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-cyan-900 drop-shadow mb-2 text-center">
            {slides[current].title}
          </h2>
          <p className="text-cyan-900/90 drop-shadow text-center">
            {slides[current].desc}
          </p>
        </div>
        <div className="flex justify-between w-full absolute bottom-4 left-0 px-6">
          <button
            onClick={prev}
            className="bg-white/60 hover:bg-cyan-600/80 text-cyan-700 hover:text-white rounded-full w-10 h-10 flex items-center justify-center shadow transition border border-cyan-300 backdrop-blur"
            style={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            &#8592;
          </button>
          <button
            onClick={next}
            className="bg-white/60 hover:bg-cyan-600/80 text-cyan-700 hover:text-white rounded-full w-10 h-10 flex items-center justify-center shadow transition border border-cyan-300 backdrop-blur"
            style={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            &#8594;
          </button>
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-cyan-500" : "bg-cyan-200"
            } border border-cyan-700`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
