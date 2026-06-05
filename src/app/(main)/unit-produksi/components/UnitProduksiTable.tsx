import React from "react";
import { ChevronDown, ChevronRight, Building2, MapPin, Pencil, Trash2 } from "lucide-react";
import Button from "../../../component/ui/Button";

interface UnitProduksiTableProps {
  loading: boolean;
  groupedData: any[];
  expandedRegionals: string[];
  toggleAccordion: (namaRegional: string) => void;
  openEditModal: (item: any) => void;
  handleDelete: (id: string) => void;
}

export default function UnitProduksiTable({
  loading,
  groupedData,
  expandedRegionals,
  toggleAccordion,
  openEditModal,
  handleDelete
}: UnitProduksiTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-10 text-center text-gray-400 shadow-sm border border-gray-100">
        Loading data...
      </div>
    );
  }

  if (groupedData.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-10 text-center text-gray-400 shadow-sm border border-gray-100">
        Tidak ada data ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedData.map((group: any) => {
        const isExpanded = expandedRegionals.includes(group.namaRegional);
        const regionalItem = group.rootItem;

        return (
          <div key={group.namaRegional} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
            {/* Accordion Header */}
            <div 
              className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${isExpanded ? "bg-blue-50/50" : "hover:bg-gray-50/50"}`}
              onClick={() => toggleAccordion(group.namaRegional)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors ${isExpanded ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <div>
                  <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                    <Building2 size={20} className="text-[#1A237E]" />
                    {group.namaRegional}
                  </h3>
                  {group.kodeRegional && (
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                      KODE: {group.kodeRegional}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions for Regional */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {regionalItem && (
                  <>
                    <Button variant="icon-orange" icon={Pencil} title="Edit Regional" onClick={() => openEditModal(regionalItem)} />
                    <Button variant="icon-red" icon={Trash2} title="Hapus Regional" onClick={() => handleDelete(regionalItem.idRegional)} />
                  </>
                )}
              </div>
            </div>

            {/* Accordion Body (Sites) */}
            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <div className="p-6 pt-0 bg-blue-50/50">
                  <div className="mt-4 pt-4 border-t border-blue-100/50">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-4 ml-2">
                      Daftar Site Area
                    </p>
                    {group.sites.length === 0 ? (
                      <div className="text-sm text-gray-400 italic ml-2">Belum ada site area terdaftar di regional ini.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.sites.map((site: any) => (
                          <div key={site.idRegional} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-blue-100 group flex flex-col justify-between">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                  <MapPin size={18} className="text-[#1A237E]" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800">{site.siteArea}</h4>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 flex-1 mb-4 line-clamp-2">
                              {site.alamat || "Alamat belum diatur"}
                            </p>
                            <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="icon-orange" icon={Pencil} title="Edit Site" onClick={() => openEditModal(site)} />
                              <Button variant="icon-red" icon={Trash2} title="Hapus Site" onClick={() => handleDelete(site.idRegional)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
