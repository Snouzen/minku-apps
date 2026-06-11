"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AutoLogout({ timeoutMinutes = 30 }: { timeoutMinutes?: number }) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    
    const logoutUser = () => {
      localStorage.removeItem("currentUser");
      Swal.fire({
        icon: "warning",
        title: "Sesi Berakhir",
        text: "Anda telah AFK (tidak aktif) terlalu lama. Silakan login kembali untuk keamanan.",
        confirmButtonColor: "#1A237E",
        confirmButtonText: "Ke Halaman Login"
      }).then(() => {
        router.push("/login");
      });
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logoutUser, timeoutMinutes * 60 * 1000);
    };

    // Start timer initially
    resetTimer();

    // Reset on any user interaction
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router, timeoutMinutes]);

  return null; // This component doesn't render anything visibly
}
