/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file AuthContext.tsx
 * @description Contexto de autenticación para gestionar el estado del usuario y las operaciones
 * de inicio de sesión, cierre de sesión y vinculación/desvinculación de proveedores en Firebase.
 * Proporciona funciones para autenticación con correo/contraseña, Google y Facebook.
 */
import { createContext, useState, useEffect, type ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
  linkWithPopup,
  unlink,
  type AuthError,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase/config";

/**
 * @interface CustomClaims
 * @description Tipo para los custom claims personalizados.
 */
interface CustomClaims {
  direccion?: string;
  fechaNacimiento?: string;
  edad?: number;
}

/**
 * @interface AuthContextType
 * @description Tipo para el contexto de autenticación, define las propiedades y métodos disponibles.
 */
interface AuthContextType {
  user: User | null;
  loginWithEmail: (email: string, password: string) => Promise<string | void>;
  loginWithGoogle: () => Promise<string | void>;
  loginWithFacebook: () => Promise<string | void>;
  logout: () => Promise<void>;
  linkWithEmail: (email: string, password: string) => Promise<string | void>;
  linkGoogle: () => Promise<string | void>;
  linkFacebook: () => Promise<string | void>;
  unlinkProvider: (providerId: string) => Promise<string | void>;
  customClaims?: CustomClaims; // Añadir los claims al contexto
}

/**
 * @constant AuthContext
 * @description Contexto de React para compartir el estado de autenticación.
 */
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * @function translateFirebaseError
 * @description Traduce códigos de error de Firebase a mensajes en español para el usuario.
 * @param {AuthError} error - Error devuelto por Firebase.
 * @returns {string} Mensaje de parte legible para el usuario.
 */
const translateFirebaseError = (error: AuthError): string => {
  switch (error.code) {
    case "auth/account-exists-with-different-credential":
      return "Este correo ya está registrado con otro proveedor. Inicia sesión con ese proveedor y luego vincula el nuevo proveedor desde el panel.";
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";
    case "auth/user-not-found":
      return "No se encontró un usuario con este correo.";
    case "auth/wrong-password":
      return "La contraseña es incorrecta.";
    case "auth/email-already-in-use":
      return "Este correo ya está registrado. Intenta iniciar sesión o usar otro correo.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/popup-closed-by-user":
      return "La ventana de inicio de sesión fue cerrada. Intenta de nuevo.";
    case "auth/requires-recent-login":
      return "Por seguridad, inicia sesión nuevamente antes de realizar esta acción.";
    case "auth/invalid-credential":
      return "Las credenciales proporcionadas no son válidas.";
    default:
      return "Ocurrió un error. Por favor, intenta de nuevo.";
  }
};

/**
 * @function AuthProvider
 * @description Componente proveedor que gestiona el estado de autenticación y proporciona
 * métodos para inicio de sesión, cierre de sesión y vínculo de proveedores.
 * @param {AuthProviderProps} props - Propiedades del componente, incluye los hijos.
 * @returns {JSX.Element} Contexto de autenticación con los hijos renderizados.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<CustomClaims | undefined>(undefined);

  /**
   * @description Escucha cambios en el estado de autenticación y actualiza el usuario y los claims.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const idTokenResult = await currentUser.getIdTokenResult();
        setCustomClaims(idTokenResult.claims as CustomClaims); // Obtener los claims
      } else {
        setCustomClaims(undefined); // Limpiar claims si no hay usuario
      }
    });
    return () => unsubscribe();
  }, []);

  /**
   * @function loginWithEmail
   * @description Inicia sesión con correo y contraseña.
   * @param {string} email - Correo del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<string | void>} Mensaje de error si falla, o void si tiene éxito.
   */
  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      return translateFirebaseError(err);
    }
  };

  /**
   * @function loginWithGoogle
   * @description Inicia sesión con Google mediante una ventana emergente.
   * @returns {Promise<string | void>} Mensaje de error si falla, o void si tiene éxito.
   */
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      return translateFirebaseError(err);
    }
  };

  /**
   * @function loginWithFacebook
   * @description Inicia sesión con Facebook mediante una ventana emergente.
   * @returns {Promise<string | void>} Mensaje de error si falla, o void si tiene éxito.
   */
  const loginWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (err: any) {
      return translateFirebaseError(err);
    }
  };

  /**
   * @function logout
   * @description Cierra la sesión del usuario actual.
   * @returns {Promise<void>} Promesa vacía al completar el cierre de sesión.
   */
  const logout = async () => {
    await signOut(auth);
  };

  /**
   * @function linkWithEmail
   * @description Vincula una cuenta de correo/contraseña al usuario actual.
   * @param {string} email - Correo a vincular.
   * @param {string} password - Contraseña a vincular.
   * @returns {Promise<string | void>} Mensaje de error si falla, o void si tiene éxito.
   */
  const linkWithEmail = async (email: string, password: string) => {
    if (auth.currentUser) {
      try {
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(auth.currentUser, credential);
      } catch (err: any) {
        return translateFirebaseError(err);
      }
    } else {
      return "No hay un usuario autenticado.";
    }
  };

  /**
   * @function linkGoogle
   * @description Vincula una cuenta de Google al usuario actual.
   * @returns {Promise<string | void>} Mensaje de error si falla, o void si tiene éxito.
   */
  const linkGoogle = async () => {
    if (auth.currentUser) {
      try {
        await linkWithPopup(auth.currentUser, googleProvider);
      } catch (err: any) {
        return translateFirebaseError(err);
      }
    } else {
      return "No hay un usuario autenticado.";
    }
  };

  /**
   * @function linkFacebook
   * @description Vincula una cuenta de Facebook al usuario actual.
   * @returns {Promise<string | void>} Mensaje de error si falla, o void si tiene éxito.
   */
  const linkFacebook = async () => {
    if (auth.currentUser) {
      try {
        await linkWithPopup(auth.currentUser, facebookProvider);
      } catch (err: any) {
        return translateFirebaseError(err);
      }
    } else {
      return "No hay un usuario autenticado.";
    }
  };

  /**
   * @function unlinkProvider
   * @description Desvincula un proveedor del usuario actual.
   * @param {string} providerId - ID del proveedor a desvincular (e.g., "password", "google.com").
   * @returns {Promise<string | void>} Mensaje de error si falla, o void si tiene éxito.
   */
  const unlinkProvider = async (providerId: string) => {
    if (auth.currentUser) {
      try {
        await unlink(auth.currentUser, providerId);
      } catch (err: any) {
        return translateFirebaseError(err);
      }
    } else {
      return "No hay un usuario autenticado.";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithEmail,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        linkWithEmail,
        linkGoogle,
        linkFacebook,
        unlinkProvider,
        customClaims, // Exponer los claims al contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};