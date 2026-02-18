"use client";

import { useEffect, useState } from "react";

export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/security/logs")
      .then(res => res.json())
      .then(setLogs);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Security Audit Logs</h1>

      {logs.map((log, index) => (
        <div key={index} className="border p-3 mb-2 rounded">
          <div><strong>Action:</strong> {log.action}</div>
          <div><strong>Email:</strong> {log.email}</div>
          <div><strong>IP:</strong> {log.ipAddress}</div>
          <div><strong>Time:</strong> {new Date(log.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
