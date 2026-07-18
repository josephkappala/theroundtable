"use client";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CopyButton({ label, onCopy, disabled }: { label: string; onCopy: () => void | Promise<void>; disabled?: boolean }) {
  return <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={() => void onCopy()}><Copy className="h-3.5 w-3.5" /> {label}</Button>;
}
