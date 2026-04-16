import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getClients } from "@/services/clients";

const fallbackImages = [
  "https://BeyondPublicityproductions.com/wp-content/uploads/2024/02/1.png",
  "https://BeyondPublicityproductions.com/wp-content/uploads/2024/02/2.png",
  "https://BeyondPublicityproductions.com/wp-content/uploads/2024/02/3.png",
  "https://BeyondPublicityproductions.com/wp-content/uploads/2024/02/1-5.png",
  "https://BeyondPublicityproductions.com/wp-content/uploads/2024/02/3-4.png",
  "https://BeyondPublicityproductions.com/wp-content/uploads/2024/02/2-4.png",
  "https://BeyondPublicityproductions.com/wp-content/uploads/2024/09/Untitled-design-3.png",
];

export default function ScrollingImages() {
  const [logos, setLogos] = useState<{ url: string; name: string }[]>(
    fallbackImages.map((url, i) => ({ url, name: `Client ${i + 1}` }))
  );

  useEffect(() => {
    getClients()
      .then((clients) => {
        if (clients.length > 0) {
          setLogos(clients.map((c) => ({ url: c.logoUrl, name: c.name })));
        }
      })
      .catch(() => {});
  }, []);

  const totalWidth = logos.length * (170 + 80);

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
        <div className="scrolling-content">
          {logos.map((logo, i) => (
            <img src={logo.url} alt={logo.name} key={i} className="scrolling-img" />
          ))}
          {logos.map((logo, i) => (
            <img src={logo.url} alt={logo.name} key={`dup-${i}`} className="scrolling-img" />
          ))}
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
          .scrolling-content {
            display: inline-flex;
            animation: scrollImages 30s linear infinite;
            white-space: nowrap;
            align-items: center;
            height: 100%;
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
          @keyframes scrollImages {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${totalWidth}px); }
          }
        `}
      </style>
    </section>
  );
}
