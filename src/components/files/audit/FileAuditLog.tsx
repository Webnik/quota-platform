import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  action_type: string;
  action_timestamp: string;
  shared_by: { full_name: string } | null;
  shared_with: { full_name: string } | null;
}

interface FileAuditLogProps {
  fileId: string;
}

export const FileAuditLog = ({ fileId }: FileAuditLogProps) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('file_sharing_audit_logs')
          .select(`
            *,
            shared_by:profiles!file_sharing_audit_logs_shared_by_fkey(full_name),
            shared_with:profiles!file_sharing_audit_logs_shared_with_fkey(full_name)
          `)
          .eq('file_id', fileId)
          .order('action_timestamp', { ascending: false });

        if (error) throw error;
        setLogs(data || []);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [fileId]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading audit logs...</div>;
  }

  if (logs.length === 0) {
    return <div className="text-sm text-muted-foreground">No audit logs found</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">File Sharing History</h3>
      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-lg border p-4 text-sm"
          >
            <p className="font-medium">
              {log.action_type}
            </p>
            <p className="text-muted-foreground">
              {log.shared_by?.full_name} shared with {log.shared_with?.full_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(log.action_timestamp), "PPpp")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};