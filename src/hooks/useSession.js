import { useState, useEffect } from "react";

function useSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 세션 정보를 초기화하거나 로드하는 로직
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      console.log("Stored session found:", storedSession);
      setSession(JSON.parse(storedSession));
    } else {
      console.log("No stored session found.");
    }
  }, []);

  const login = (userId) => {
    // 로그인 처리 로직
    const newSession = { userId };
    console.log("Logging in, setting session:", newSession);
    localStorage.setItem("session", JSON.stringify(newSession));
    setSession(newSession);
  };

  const logout = () => {
    // 로그아웃 처리 로직
    console.log("Logging out, removing session.");
    localStorage.removeItem("session");
    setSession(null);
  };

  useEffect(() => {
    console.log("Session updated:", session);
  }, [session]);

  return { session, login, logout };
}

export default useSession;
