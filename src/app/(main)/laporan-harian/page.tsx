import LaporanHarianClient from "./components/LaporanHarianClient";

export const metadata = {
  title: "Laporan Harian | MINKU",
};

export default function LaporanHarianPage() {
  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      <div className="flex items-center justify-between p-6 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Laporan Harian</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Upload dan kelola data laporan harian dari file Excel.</p>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <LaporanHarianClient />
      </div>
    </div>
  );
}
