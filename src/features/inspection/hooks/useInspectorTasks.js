import { useCallback, useEffect, useMemo, useState } from "react";
import { inspectorService } from "../../../services/inspectorService";

export const useInspectorTasks = (params = {}, options = {}) => {
  const { enabled = true } = options;
  const paramsKey = JSON.stringify(params || {});
  const normalizedParams = useMemo(() => params || {}, [paramsKey]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!enabled) return [];

    setLoading(true);
    setError(null);

    try {
      const res = await inspectorService.getTasks(normalizedParams);
      const nextTasks = res?.result || [];
      setTasks(nextTasks);
      return nextTasks;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enabled, normalizedParams]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    fetchTasks().catch(() => null);
  }, [enabled, fetchTasks]);

  return {
    tasks,
    setTasks,
    loading,
    error,
    refetch: fetchTasks,
  };
};
