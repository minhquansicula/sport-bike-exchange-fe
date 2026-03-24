import { useCallback, useEffect, useState } from "react";
import { inspectorService } from "../../../services/inspectorService";

export const useReservationInspectionReport = (
  reservationId,
  options = {}
) => {
  const { enabled = true } = options;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && reservationId));
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    if (!enabled || !reservationId) return null;

    setLoading(true);
    setError(null);

    try {
      const res = await inspectorService.getReservationInspectionReport(
        reservationId
      );
      const nextReport = res?.result || res;
      setReport(nextReport);
      return nextReport;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enabled, reservationId]);

  useEffect(() => {
    if (!enabled || !reservationId) {
      setLoading(false);
      setReport(null);
      setError(null);
      return;
    }

    fetchReport().catch(() => null);
  }, [enabled, reservationId, fetchReport]);

  return {
    report,
    setReport,
    loading,
    error,
    refetch: fetchReport,
  };
};
