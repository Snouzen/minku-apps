import BahanRagabClient from "./components/BahanRagabClient";

export const metadata = {
  title: "Bahan Ragab | MINKU",
};

export default function BahanRagabPage() {
  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      <div className="flex items-center justify-between p-6 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bahan Ragab</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Pengolahan dan rekapitulasi data operasional UBI untuk Rapat Gabungan (Ragab).
          </p>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <BahanRagabClient />
      </div>
    </div>
  );
}
