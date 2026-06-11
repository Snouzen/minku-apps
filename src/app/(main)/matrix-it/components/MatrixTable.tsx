import React from "react";
import { ChevronDown, ChevronRight, Folder, FolderOpen, Pencil, Trash2, Plus, ArrowRight } from "lucide-react";
import Button from "../../../component/ui/Button";
import Link from "next/link";

interface MatrixTableProps {
  data: any[];
  loading: boolean;
  expandedKegiatan: number[];
  expandedTasks: number[];
  toggleKegiatan: (id: number) => void;
  toggleTask: (id: number) => void;
  openAddKegiatan: () => void;
  openEditKegiatan: (item: any) => void;
  openAddTask: (kegiatanId: number) => void;
  openEditTask: (item: any) => void;
  handleDelete: (type: "KEGIATAN" | "TASK", id: number) => void;
}

export default function MatrixTable({
  data, loading, expandedKegiatan, expandedTasks,
  toggleKegiatan, toggleTask,
  openAddKegiatan, openEditKegiatan,
  openAddTask, openEditTask,
  handleDelete
}: MatrixTableProps) {

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat data...</div>;



  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#1A237E]">Daftar Kegiatan</h2>
        <Button onClick={openAddKegiatan} icon={Plus} label="Tambah Kegiatan" />
      </div>

      <div className="space-y-4">
        {data.length === 0 && <div className="text-center text-gray-500 py-4">Belum ada data kegiatan.</div>}
        
        {data.map((kegiatan) => (
          <div key={kegiatan.id} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            {/* KEGIATAN LEVEL */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleKegiatan(kegiatan.id)}
            >
              <div className="flex items-center gap-3">
                {expandedKegiatan.includes(kegiatan.id) ? <FolderOpen className="text-[#1A237E]" size={24} /> : <Folder className="text-[#1A237E]" size={24} />}
                <h3 className="font-bold text-gray-800 text-lg">{kegiatan.namaKegiatan}</h3>
                <span className="bg-[#1A237E]/10 text-[#1A237E] text-xs px-2 py-1 rounded-full font-bold">
                  {kegiatan.tasks.length} Tasks
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); openAddTask(kegiatan.id); }} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-semibold flex items-center gap-1">
                  <Plus size={16} /> Task
                </button>
                <button onClick={(e) => { e.stopPropagation(); openEditKegiatan(kegiatan); }} className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-white"><Pencil size={18} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete("KEGIATAN", kegiatan.id); }} className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-white"><Trash2 size={18} /></button>
                {expandedKegiatan.includes(kegiatan.id) ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
              </div>
            </div>

            {/* TASK LEVEL */}
            {expandedKegiatan.includes(kegiatan.id) && (
              <div className="bg-white border-t border-gray-200">
                {kegiatan.tasks.length === 0 && <div className="p-4 text-center text-sm text-gray-500">Belum ada task.</div>}
                
                {kegiatan.tasks.map((task: any) => (
                  <div key={task.id} className="border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between p-3 pl-12 hover:bg-orange-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <ChevronRight size={18} className="text-orange-300" />
                        <h4 className="font-semibold text-gray-700">{task.namaTask}</h4>
                        <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {task.subTasks.length} Sub-Tasks
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/matrix-it/task/${task.id}`}
                          className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-200 font-bold flex items-center gap-1 transition-all"
                        >
                          Lihat Detail <ArrowRight size={14} />
                        </Link>
                        <button onClick={(e) => { e.stopPropagation(); openEditTask(task); }} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white"><Pencil size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete("TASK", task.id); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
