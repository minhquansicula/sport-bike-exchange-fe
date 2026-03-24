import { useCallback, useEffect, useState } from "react";
import { inspectorService } from "../../../services/inspectorService";

export const useInspectorTaskDetail = (taskId, options = {}) => {
  const { enabled = true } = options;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && taskId));
  const [error, setError] = useState(null);

  const fetchTask = useCallback(async () => {
    if (!enabled || !taskId) return null;

    setLoading(true);
    setError(null);

    try {
      const res = await inspectorService.getTaskById(taskId);
      const nextTask = res?.result || null;
      setTask(nextTask);
      return nextTask;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enabled, taskId]);

  useEffect(() => {
    if (!enabled || !taskId) {
      setLoading(false);
      setTask(null);
      return;
    }

    fetchTask().catch(() => null);
  }, [enabled, taskId, fetchTask]);

  return {
    task,
    setTask,
    loading,
    error,
    refetch: fetchTask,
  };
};
