import { useEffect, useState, useCallback } from "react";
import axios from "../../api/axios.ts";
import AuthContext from "../../context/AuthContext.tsx";
import axiosInstance from "../../api/axios.ts";
import { Link, useNavigate } from "react-router";

export default function AuthProvider({ children }) {
  let [accessToken, setAccessToken] = useState<string | null>(null);
  let [refreshToken, setRefreshToken] = useState<string | null>(null);
  let [userInfo, setUserInfo] = useState<any | null>(null);
  let [userData, setUserData] = useState<any | null>(null);
  let [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Fonction pour vérifier la validité du token
  const checkTokenValidity = useCallback(async (token: string) => {
    try {
      const response = await axiosInstance.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {

      return false;
    }
  }, []);

  // Fonction pour nettoyer les données de session
  const clearSession = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userData");
    setUserInfo(null);
    setUserData(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("userInfo");
      const storedUserData = localStorage.getItem("userData");
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedUser && storedAccessToken) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // Vérifier la validité du token
          const isTokenValid = await checkTokenValidity(storedAccessToken);

          if (isTokenValid) {
            setUserInfo(parsedUser);
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);

            // Charger les données de profil depuis l'API
            try {
              const profileResponse = await axiosInstance.get("/auth/profile", {
                headers: {
                  Authorization: `Bearer ${storedAccessToken}`,
                },
              });
              const profileData = profileResponse.data.result;
              setUserData(profileData);
              localStorage.setItem("userData", JSON.stringify(profileData));

            } catch (error) {

              // Fallback sur les données stockées si disponibles
              if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
              }
            }

          } else {
            clearSession();
          }
        } catch (e) {

          clearSession();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [checkTokenValidity, clearSession]);

  // Vérification périodique de la validité du token (toutes les 30 minutes)
  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(async () => {
      const currentToken = localStorage.getItem("accessToken");
      if (currentToken) {
        const isTokenValid = await checkTokenValidity(currentToken);
        if (!isTokenValid) {

          clearSession();
        }
      }
    }, 24 * 60 * 60 * 1000); // 24 heures

    return () => clearInterval(interval);
  }, [accessToken, checkTokenValidity, clearSession]);

  const login = async (phone, password, navigate) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        username: phone,
        password,
      });


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

        // Charger les données de profil après la connexion
        try {
          const profileResponse = await axiosInstance.get("/auth/profile", {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });
          const profileData = profileResponse.data.result;
          setUserData(profileData);
          localStorage.setItem("userData", JSON.stringify(profileData));

        } catch (error) {

        }



        return {
          success: true,
          result: res.data.result,
        };
      } else {


        return {
          success: false,
          message:
            res.data.message ||
            "La connexion a échoué. Veuillez vérifier vos identifiants.",
        };
      }
    } catch (err: any) {


      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur de connexion. Veuillez vérifier vos identifiants.";

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const authMe = async (id: any) => {
    try {

      const user = await axiosInstance.get(`/auth/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: false,
      });
      const u = user.data.result; // Utiliser result au lieu de data
      setUserData(u);
      localStorage.setItem("userData", JSON.stringify(u));


    } catch (error: any) {

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


    } catch (err: any) {

    }
  };

  const logout = useCallback(() => {
    clearSession();

  }, [clearSession]);

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
