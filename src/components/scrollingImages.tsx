import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getClients } from "@/services/clients";

export default function ScrollingImages() {
  const [logos, setLogos] = useState<{ url: string; name: string }[]>([]);

  useEffect(() => {
    getClients()
      .then((clients) => {
        setLogos(clients.map((c) => ({ url: c.logoUrl, name: c.name })));
      })
      .catch(() => {});
  }, []);

  if (logos.length === 0) return null;

  const itemWidth = 150 + 80;
  const setWidth = logos.length * itemWidth;
  const seamless = logos.length >= 3;
  const MIN_SEAMLESS_WIDTH = 2800;
  const copies = seamless ? Math.max(2, Math.ceil(MIN_SEAMLESS_WIDTH / setWidth)) : 1;

  return (
    <section className="py-16 bg-[#0a0a0a] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#ffffff]" />
          <span className="text-white text-xs tracking-[0.4em] uppercase font-light">Trusted By</span>
          <div className="h-px w-12 bg-[#ffffff]" />
        </div>
        <h3 className="font-inter text-lg md:text-2xl text-white font-bold">
          Our <span className="text-white">Clients</span>
        </h3>
      </motion.div>

      <div className="scrolling-container">
        <div className={seamless ? "scrolling-content-seamless" : "scrolling-content-gap"}>
          {Array.from({ length: copies }).flatMap((_, copyIdx) =>
            logos.map((logo, i) => (
              <img
                src={logo.url}
                alt={logo.name}
                key={`c${copyIdx}-${i}`}
                className="scrolling-img"
              />
            )),
          )}
        </div>
      </div>

      <style>
        {`
          .scrolling-container {
            overflow: hidden;
            width: 100%;
            height: 200px;
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          .scrolling-content-seamless,
          .scrolling-content-gap {
            display: inline-flex;
            white-space: nowrap;
            align-items: center;
            height: 100%;
          }
          .scrolling-content-seamless {
            animation: scrollSeamless 30s linear infinite;
          }
          .scrolling-content-gap {
            animation: scrollWithGap 18s linear infinite;
          }
          .scrolling-img {
            margin-right: 80px;
            width: 150px;
            border-radius: 12px;
            transition: transform 0.3s ease, opacity 0.3s ease;
            opacity: 0.6;
            object-fit: contain;
          }
          .scrolling-img:hover {
            transform: scale(1.15);
            opacity: 1;
          }
          @keyframes scrollSeamless {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${setWidth}px); }
          }
          @keyframes scrollWithGap {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-${setWidth}px); }
          }
        `}
      </style>
    </section>
  );
}
