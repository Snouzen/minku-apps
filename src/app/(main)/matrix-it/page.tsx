import React from "react";
import MatrixItClient from "../../component/matrixItClient";

export default function MatrixItPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#1A237E] tracking-tight">Matrix IT</h1>
        <p className="text-gray-500 mt-2 font-medium">Monitoring Kegiatan, Task, dan Sub Task IT.</p>
      </div>
      <MatrixItClient />
    </div>
  );
}
