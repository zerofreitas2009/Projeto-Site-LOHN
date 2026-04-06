const images = [
  {
    src: "https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=1200&q=80",
    alt: "Detalhe de mesa de trabalho",
  },
  {
    src: "https://images.unsplash.com/photo-1528747045269-390fe33c19a1?auto=format&fit=crop&w=1200&q=80",
    alt: "Ambiente profissional",
  },
  {
    src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    alt: "Reunião",
  },
  {
    src: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=1200&q=80",
    alt: "Detalhe de documentos",
  },
  {
    src: "https://images.unsplash.com/photo-1555375771-14b2a63968a9?auto=format&fit=crop&w=1200&q=80",
    alt: "Biblioteca",
  },
  {
    src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    alt: "Símbolo de justiça",
  },
];

export default function GallerySection() {
  return (
    <section id="galeria" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        {/* Galeria */}
        <p className="text-xs font-medium tracking-[0.22em] text-gold/80">GALERIA</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gold sm:text-3xl">
          Visual moderno
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-200/90">
          Imagens ilustrativas (placeholders de alta qualidade) para compor o layout.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <figure
              key={img.src}
              className="group overflow-hidden rounded-xl border border-gold/10 bg-neutral-950/40"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-56 w-full object-cover opacity-85 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
              />
              <div className="border-t border-gold/10 p-4">
                <figcaption className="text-xs text-neutral-300">{img.alt}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
