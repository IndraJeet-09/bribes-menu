"use client";

import { useState } from "react";
import { X, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { SERVICES_SEED } from "@/data/services";
import { INDIAN_STATES, PaymentMode, OfficialRole } from "@/types/report";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultServiceId?: string;
}

export function ReportModal({ isOpen, onClose, defaultServiceId }: ReportModalProps) {
  const [serviceId, setServiceId] = useState(defaultServiceId || SERVICES_SEED[0].id);
  const [amount, setAmount] = useState<string>("");
  const [paid, setPaid] = useState<boolean>(true);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("Madhya Pradesh");
  
  // Default incident month to current month YYYY-MM
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [incidentMonth, setIncidentMonth] = useState<string>(currentMonthStr);
  const [officialRole, setOfficialRole] = useState<OfficialRole | "">("Traffic Police");
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg("Please enter a valid amount greater than ₹0.");
      return;
    }

    if (!city.trim() || city.trim().length < 2) {
      setErrorMsg("Please enter a valid city name (at least 2 characters).");
      return;
    }

    if (description.trim() && description.trim().length < 10) {
      setErrorMsg("Description must be at least 10 characters if provided.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        serviceId,
        amount: numericAmount,
        paid,
        paymentMode: paid ? (paymentMode === "not_paid" ? "cash" : paymentMode) : "not_paid",
        city: city.trim(),
        state,
        incidentMonth,
        officialRole: officialRole || undefined,
        description: description.trim() || undefined,
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.details || data.error || "Failed to submit report.");
      } else {
        setSuccessMsg("Report received. Thanks for helping build the dataset!");
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
          setAmount("");
          setDescription("");
          setCity("");
        }, 2200);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              ANONYMOUS SUBMISSION
            </span>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Report an Incident
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:text-foreground hover:bg-neutral-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 font-sans text-xs">
            {/* Situation / Service */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1">
                SITUATION / SERVICE *
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-sans text-sm focus:outline-none focus:border-foreground"
              >
                {SERVICES_SEED.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount & Paid Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1">
                  AMOUNT REQUESTED / PAID (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  required
                  placeholder="e.g. 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-sans text-sm focus:outline-none focus:border-foreground"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1">
                  DID YOU PAY? *
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPaid(true);
                      if (paymentMode === "not_paid") setPaymentMode("cash");
                    }}
                    className={`flex-1 font-mono text-xs py-2 rounded-lg border transition-colors ${
                      paid
                        ? "bg-foreground text-background border-foreground font-semibold"
                        : "bg-background text-muted border-border hover:text-foreground"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaid(false);
                      setPaymentMode("not_paid");
                    }}
                    className={`flex-1 font-mono text-xs py-2 rounded-lg border transition-colors ${
                      !paid
                        ? "bg-foreground text-background border-foreground font-semibold"
                        : "bg-background text-muted border-border hover:text-foreground"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Mode (If paid) */}
            {paid && (
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1">
                  PAYMENT METHOD
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-sans text-sm focus:outline-none focus:border-foreground"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI / QR Code</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="agent">Agent / Liaison</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {/* Location: City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1">
                  CITY *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhopal"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-sans text-sm focus:outline-none focus:border-foreground"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1">
                  STATE / UT *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-sans text-sm focus:outline-none focus:border-foreground"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Month & Official Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1">
                  WHEN DID IT HAPPEN? *
                </label>
                <input
                  type="month"
                  required
                  value={incidentMonth}
                  onChange={(e) => setIncidentMonth(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-sans text-sm focus:outline-none focus:border-foreground"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1">
                  OFFICIAL INVOLVED
                </label>
                <select
                  value={officialRole}
                  onChange={(e) => setOfficialRole(e.target.value as OfficialRole)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-sans text-sm focus:outline-none focus:border-foreground"
                >
                  <option value="Traffic Police">Traffic Police</option>
                  <option value="Police">Police Constable/Station</option>
                  <option value="RTO Official">RTO Official</option>
                  <option value="Municipal Official">Municipal Inspector</option>
                  <option value="Tax Official">Tax Officer</option>
                  <option value="Government Office Staff">Government Office Staff</option>
                  <option value="Agent/Middleman">Agent / Middleman</option>
                  <option value="Other">Other</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>
            </div>

            {/* Optional Description */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1">
                OPTIONAL DETAILS (NO NAMES/PHONES)
              </label>
              <textarea
                rows={3}
                maxLength={500}
                placeholder="Describe what happened without including personal names, phone numbers, or emails..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-3 text-foreground font-sans text-xs focus:outline-none focus:border-foreground"
              />
              <span className="font-mono text-[10px] text-muted block text-right">
                {description.length}/500 chars
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full font-mono text-xs font-semibold py-3 px-4 rounded-xl bg-foreground text-background hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>SUBMITTING REPORT...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>SUBMIT ANONYMOUS REPORT</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
