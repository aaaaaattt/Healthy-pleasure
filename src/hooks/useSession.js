import { useState, useEffect } from "react";

function useSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 세션 정보를 초기화하거나 로드하는 로직을 작성
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
  }, []);

  const login = (userId) => {
    // 로그인 처리 로직
    const newSession = { userId };
    localStorage.setItem("session", JSON.stringify(newSession));
    setSession(newSession);
  };

  const logout = () => {
    // 로그아웃 처리 로직
    localStorage.removeItem("session");
    setSession(null);
  };

  return { session, login, logout };
}

export default useSession;
