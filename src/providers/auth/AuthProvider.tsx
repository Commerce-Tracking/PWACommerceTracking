import { useEffect, useState } from "react";
import axios from "../../api/axios.ts";
import AuthContext from "../../context/AuthContext.tsx";
import axiosInstance from "../../api/axios.ts";
import { Link, useNavigate } from "react-router";

export default function AuthProvider({ children }) {
  let [accessToken, setAccessToken] = useState(null);
  let [refreshToken, setRefreshToken] = useState(null);
  let [userInfo, setUserInfo] = useState(null);
  let [userData, setUserData] = useState(null);
  let [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem("userInfo");
      const storedUserData = localStorage.getItem("userData");
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserInfo(parsedUser);
          // @ts-ignore
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          // @ts-ignore
          setAccessToken(storedAccessToken);
          // @ts-ignore
          setRefreshToken(storedRefreshToken);
        } catch (e) {
          console.error("Impossible de parser userInfo");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("userData");
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phone, password, navigate) => {
    try {
      const res = await axiosInstance.post("/api/auth/login", { username:phone, password });
      console.log("LOGIN DATA: ");
      console.log(res.data);

      // Vérifier si la connexion est réussie selon la nouvelle structure
      if (res.data.success === true) {
        const result = res.data.result;
        const user = result.user;
        const tokens = {
          accessToken: result.access_token,
          refreshToken: result.refresh_token,
        };

        // Vérifier le rôle de l'utilisateur
        const roleId = user.role_id;
        if (roleId !== 4 && roleId !== 5) {
          console.log("Accès refusé : rôle non autorisé");
          return {
            success: false,
            message:
              "Accès refusé. Seuls les chefs d'équipe et superviseurs peuvent accéder à cette application.",
          };
        }

        // Stocker les informations utilisateur avec la nouvelle structure
        setUserInfo(user);
        setRefreshToken(tokens.refreshToken);
        setAccessToken(tokens.accessToken);

        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        localStorage.setItem("userInfo", JSON.stringify(user));

        console.log("Connexion réussie !");
        console.log("Rôle utilisateur:", user.role?.name || `ID: ${roleId}`);
      } else {
        console.log("Connexion échouée !");
      }

      return res.data;
    } catch (err) {
      // @ts-ignore
      console.error("Login error", err.response?.data || err.message);
      return {
        success: false,
        message: "Erreur de connexion. Veuillez vérifier vos identifiants.",
      };
    }
  };

  const authMe = async (id: any) => {
    try {
      console.log("Access Token", accessToken);
      const user = await axiosInstance.get(`/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: false,
      });
      const u = user.data.data;
      setUserData(u);
      localStorage.setItem("userData", JSON.stringify(u));

      console.log("Connecté !");
    } catch (error) {
      // @ts-ignore
      console.error("Error", error.response?.data || error.message);
      // @ts-ignore
      if (error.response?.status === 401) {
        
        navigate("/signin");
      }
    }
  };

  const getUserInfos = async (id: string | number) => {
    try {
      const user = await axiosInstance.get(`/users/${id}`);
      const userInfo = user.data.data;
      setUserInfo(userInfo);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      console.log("Récupérée !");
    } catch (err) {
      // @ts-ignore
      console.error("Error", err.response?.data || err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo"); // 👈 aussi
    setUserInfo(null);
  };

  const refresh = async () => {
    try {
      const res = await axios.post("/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      localStorage.setItem("accessToken", res.data.accessToken);
    } catch (err) {
      logout();
    }
  };

  return (
    // @ts-ignore
    <AuthContext.Provider
      value={{
        userInfo,
        userData,
        accessToken,
        refreshToken,
        login,
        logout,
        authMe,
        getUserInfos,
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
