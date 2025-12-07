import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  async function requestOtp(e: any) {
    e.preventDefault();
    try {
      await axios.post("/api/auth/request-otp", { phone, username });
      setOtpSent(true);
      alert("OTP sent to WhatsApp.");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  }

  async function verifyOtp(e: any) {
    e.preventDefault();
    try {
      await axios.post("/api/auth/verify-otp", { phone, otp });
      router.push("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 card">
      <h1 className="text-2xl mb-4">Login or Create Account</h1>
      {!otpSent ? (
        <form onSubmit={requestOtp} className="space-y-3">
          <label>WhatsApp Phone e.g. +62... </label>
          <input className="w-full p-2 rounded bg-black bg-opacity-30" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <label>Username</label>
          <input className="w-full p-2 rounded bg-black bg-opacity-30" value={username} onChange={(e)=>setUsername(e.target.value)} />
          <button className="bg-blue-600 px-4 py-2 rounded">Send OTP via WhatsApp</button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-3">
          <label>Enter OTP</label>
          <input className="w-full p-2 rounded bg-black bg-opacity-30" value={otp} onChange={(e)=>setOtp(e.target.value)} />
          <button className="bg-green-600 px-4 py-2 rounded">Verify & Sign In</button>
        </form>
      )}
    </div>
  );
}
