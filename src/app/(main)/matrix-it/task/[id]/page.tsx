import React, { Suspense } from "react";
import TaskDetailClient from "./components/TaskDetailClient";

export default async function TaskDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const taskId = parseInt(id, 10);

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="text-center py-10 text-gray-400">Memuat...</div>}>
        <TaskDetailClient taskId={taskId} />
      </Suspense>
    </div>
  );
}
