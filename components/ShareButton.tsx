"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const shareData = {
      title: `${title} | The Unofficial Fine Menu`,
      text: `Check out reported amounts for "${title}" on The Unofficial Fine Menu.`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or failed
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded border border-border bg-surface hover:bg-neutral-100 text-foreground transition-all duration-150 active:scale-95"
      aria-label="Share this offence"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span>COPIED LINK</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-muted" />
          <span>SHARE</span>
        </>
      )}
    </button>
  );
}
