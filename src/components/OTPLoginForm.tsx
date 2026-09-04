"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Mail, Send, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";
import { useToast } from "./ui/Toast";

export interface OTPLoginFormProps {
  onSuccess: () => void;
}

export function OTPLoginForm({ onSuccess }: OTPLoginFormProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send code");
      }

      setStep("code");
      setSuccess("Code sent! Check your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setSending(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid code");
      }

      setSuccess("Signed in!");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setVerifying(false);
    }
  }

  function goBack() {
    setStep("email");
    setCode("");
    setError(null);
    setSuccess(null);
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        {step === "email" && (
          <div className="text-center">
            <Mail size={28} className="text-accent mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in to Admin</h2>
            <p className="text-sm text-muted mb-6">
              Enter your email to receive a 6-digit code
            </p>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-left">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="makarimsusanto19@gmail.com"
                  required
                  autoComplete="email"
                  disabled={sending}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-red-950/30 border border-red-800 rounded-lg p-3">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-sm text-green-100 bg-green-950/30 border border-green-800 rounded-lg p-3">
                  <CheckCircle size={16} />
                  <span>{success}</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send Code
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {step === "code" && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-accent" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
            <p className="text-sm text-muted mb-6">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-1.5 text-left">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                  disabled={verifying}
                  className="text-center text-2xl tracking-widest font-mono"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-red-950/30 border border-red-800 rounded-lg p-3">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={verifying}>
                {verifying ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={goBack} className="w-full">
                Back to email
              </Button>
            </form>
          </div>
        )}
      </div>
    </Card>
  );
}