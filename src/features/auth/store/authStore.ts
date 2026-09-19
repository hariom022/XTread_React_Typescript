// import { create } from "zustand";

// import authService from "../services/authService";
// import moduleService from "../../modules/services/moduleService";
// import type { User, ModulePermission } from "../types/authTypes";
// import type { ModuleItem } from "../../modules/types/moduleTypes";

// interface AuthState {
//   token: string | null;

//   user: User | null;

//   modules: ModulePermission[];

//   moduleTree: ModuleItem[];

//   isAuthenticated: boolean;

//   isLoading: boolean;

//   /**
//    * Login user
//    */
//   login: (userName: string, password: string) => Promise<void>;

//   /**
//    * Restore authentication
//    * when application starts.
//    */
//   initializeAuth: () => Promise<void>;

//   /**
//    * Set authentication data
//    */
//   setAuth: (token: string, user: User, modules: ModulePermission[]) => void;

//   /**
//    * Update user
//    */
//   setUser: (user: User) => void;

//   /**
//    * Update modules
//    */
//   setModules: (modules: ModulePermission[]) => void;
//   setModuleTree:(modules: ModuleItem[]) => void;   
//   /**
//    * Logout
//    */
//   logout: () => void;

//   /**
//    * Check module access
//    */
//   hasModule: (moduleCode: string) => boolean;
// }

// export const useAuthStore = create<AuthState>((set, get) => ({
//   /**
//    * Restore token from browser
//    */
//   token: localStorage.getItem("token"),

//   /**
//    * User will be loaded from /auth/me
//    */
//   user: null,

//   /**
//    * Modules will be loaded from
//    * /auth/my-permissions
//    */
//   modules: [],

//   moduleTree: [],
//   /**
//    * If token exists,
//    * application will try to restore user.
//    */
//   isAuthenticated: !!localStorage.getItem("token"),

//   isLoading: false,

//   /**
//    * ========================================
//    * LOGIN
//    * ========================================
//    *
//    * Flow:
//    *
//    * 1. POST /api/auth/login
//    * 2. Save JWT
//    * 3. GET /api/auth/me
//    * 4. GET /api/auth/my-permissions
//    * 5. Store everything in Zustand
//    */
//   login: async (emailOrUserName, password) => {
//     set({
//       isLoading: true,
//     });

//     try {
//       /**
//        * STEP 1
//        *
//        * Call Login API
//        */
//       const loginResponse = await authService.login({
//         emailOrUserName,
//         password,
//       });

//       /**
//        * STEP 2
//        *
//        * Save JWT immediately.
//        *
//        * The next APIs need this token.
//        */
//       localStorage.setItem("token", loginResponse.token);

//       /**
//        * STEP 3
//        *
//        * Get logged-in user
//        */
//       const user = await authService.getMe();

//       /**
//        * STEP 4
//        *
//        * Get modules assigned
//        * to user's role
//        */
//       const permissionResponse = await authService.getMyPermission();

//       console.log("My Permissions API Response:", permissionResponse);

//       const modules = permissionResponse?.data.modules ?? [];

//       const moduleTreeResponse = await moduleService.getModuleTree();

//       console.log("Module Tree API Response:", moduleTreeResponse);

//       const moduleTree = moduleTreeResponse?.data?.modules ?? [];

//       console.log("Module Tree loaded:", moduleTree);

//       set({
//         token: loginResponse.token,

//         user,

//         modules,
//         moduleTree,

//         isAuthenticated: true,

//         isLoading: false,
//       });
//     } catch (error) {
//       /**
//        * Login failed.
//        *
//        * Clear everything.
//        */
//       localStorage.removeItem("token");

//       set({
//         token: null,

//         user: null,

//         modules: [],

//         isAuthenticated: false,

//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   /**
//    * ========================================
//    * INITIALIZE AUTH
//    * ========================================
//    *
//    * Called when React application starts.
//    *
//    * If token doesn't exist:
//    *
//    *     Don't call any API.
//    *
//    * If token exists:
//    *
//    *     GET /auth/me
//    *     GET /auth/my-permissions
//    */
//   initializeAuth: async () => {
//     const token = localStorage.getItem("token");

//     /**
//      * No token.
//      *
//      * User must login.
//      */
//     if (!token) {
//       set({
//         token: null,

//         user: null,

//         modules: [],

//         isAuthenticated: false,

//         isLoading: false,
//       });

//       return;
//     }

//     /**
//      * Token exists.
//      *
//      * Restore authentication.
//      */
//     set({
//       isLoading: true,
//     });

//     try {
//       /**
//        * GET /api/auth/me
//        */
//       const user = await authService.getMe();

//       /**
//        * GET /api/auth/my-permissions
//        */
//       const permissionResponse = await authService.getMyPermission();

//       console.log("Restored permissions:", permissionResponse);

//       const modules = permissionResponse?.data?.modules ?? [];

//       const moduleTreeResponse = await moduleService.getModuleTree();

//       console.log("Restored module tree:", moduleTreeResponse);

//       const moduleTree = moduleTreeResponse?.data?.modules ?? [];

//       set({
//         token,

//         user,

//         modules,

//         moduleTree,

//         isAuthenticated: true,

//         isLoading: false,
//       });
//     } catch (error) {
//       console.error("Authentication initialization failed:", error);

//       /**
//        * Invalid/expired token
//        */
//       localStorage.removeItem("token");

//       set({
//         token: null,

//         user: null,

//         modules: [],

//         isAuthenticated: false,

//         isLoading: false,
//       });
//     }
//   },

//   /**
//    * ========================================
//    * SET AUTH
//    * ========================================
//    */
//   setAuth: (token, user, modules) => {
//     localStorage.setItem("token", token);

//     set({
//       token,

//       user,

//       modules,

//       isAuthenticated: true,

//       isLoading: false,
//     });
//   },

//   /**
//    * ========================================
//    * SET USER
//    * ========================================
//    */
//   setUser: (user) => {
//     set({
//       user,
//     });
//   },

//   /**
//    * ========================================
//    * SET MODULES
//    * ========================================
//    */
//   setModules: (modules) => {
//     set({
//       modules,
//     });
//   },
// setModuleTree: (modules) => {
//   set({
//     moduleTree: modules,
//   });
// },
//   /**
//    * ========================================
//    * LOGOUT
//    * ========================================
//    */
//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("last_activity");

//     set({
//       token: null,

//       user: null,

//       modules: [],
//       moduleTree: [],

//       isAuthenticated: false,

//       isLoading: false,
//     });
//   },

//   /**
//    * ========================================
//    * CHECK MODULE ACCESS
//    * ========================================
//    */
//   hasModule: (moduleCode) => {
//     const { user, modules } = get();

//     /**
//      * Super Admin has access to everything.
//      */
//     if (user?.isSuperAdmin) {
//       return true;
//     }

//     /**
//      * If modules is undefined/null,
//      * treat it as an empty array.
//      */
//     return (modules ?? []).some((module) => module.moduleCode === moduleCode);
//   },
  
// }));

import { create } from "zustand";

import authService from "../services/authService";
import moduleService from "../../modules/services/moduleService";
import type { User, ModulePermission } from "../types/authTypes";
import type { ModuleItem } from "../../modules/types/moduleTypes";
import api from "../../../shared/services/api"; // <-- 1. IMPORT API FOR BACKEND LOGOUT

interface AuthState {
  token: string | null;

  user: User | null;

  modules: ModulePermission[];

  moduleTree: ModuleItem[];

  isAuthenticated: boolean;

  isLoading: boolean;

  /**
   * Login user
   */
  login: (userName: string, password: string) => Promise<void>;

  /**
   * Restore authentication
   * when application starts.
   */
  initializeAuth: () => Promise<void>;

  /**
   * Set authentication data
   */
  setAuth: (token: string, user: User, modules: ModulePermission[]) => void;

  /**
   * Update user
   */
  setUser: (user: User) => void;

  /**
   * Update modules
   */
  setModules: (modules: ModulePermission[]) => void;
  setModuleTree: (modules: ModuleItem[]) => void;
  /**
   * Logout
   */
  logout: () => Promise<void>;

  /**
   * Check module access
   */
  hasModule: (moduleCode: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  /**
   * Restore token from browser
   */
  token: localStorage.getItem("token"),

  /**
   * User will be loaded from /auth/me
   */
  user: null,

  /**
   * Modules will be loaded from
   * /auth/my-permissions
   */
  modules: [],

  moduleTree: [],

  /**
   * If token exists,
   * application will try to restore user.
   */
  isAuthenticated: !!localStorage.getItem("token"),

  isLoading: false,

  /**
   * ========================================
   * LOGIN
   * ========================================
   */
  login: async (emailOrUserName, password) => {
    set({
      isLoading: true,
    });

    try {
      /**
       * STEP 1: Call Login API
       */
      const loginResponse = await authService.login({
        emailOrUserName,
        password,
      });

      /**
       * STEP 2: Save JWT & Refresh Token immediately.
       */
      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("refreshToken", loginResponse.refreshToken); // <-- 2. STORE REFRESH TOKEN
      localStorage.setItem("last_activity", Date.now().toString());     // <-- 3. INITIALIZE ACTIVITY TIMER

      /**
       * STEP 3: Get logged-in user
       */
      const user = await authService.getMe();

      /**
       * STEP 4: Get modules assigned to user's role
       */
      const permissionResponse = await authService.getMyPermission();
      const modules = permissionResponse?.data?.modules ?? [];

      const moduleTreeResponse = await moduleService.getModuleTree();
      const moduleTree = moduleTreeResponse?.data?.modules ?? [];

      set({
        token: loginResponse.token,
        user,
        modules,
        moduleTree,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      /**
       * Login failed. Clear all tokens and timestamps.
       */
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");  // <-- CLEAR REFRESH TOKEN
      localStorage.removeItem("last_activity");

      set({
        token: null,
        user: null,
        modules: [],
        moduleTree: [],
        isAuthenticated: false,
        isLoading: false,
      });

      throw error;
    }
  },

  /**
   * ========================================
   * INITIALIZE AUTH
   * ========================================
   */
  initializeAuth: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({
        token: null,
        user: null,
        modules: [],
        moduleTree: [],
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    set({
      isLoading: true,
    });

    try {
      const user = await authService.getMe();
      const permissionResponse = await authService.getMyPermission();
      const modules = permissionResponse?.data?.modules ?? [];

      const moduleTreeResponse = await moduleService.getModuleTree();
      const moduleTree = moduleTreeResponse?.data?.modules ?? [];

      set({
        token,
        user,
        modules,
        moduleTree,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Authentication initialization failed:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");  // <-- CLEAR REFRESH TOKEN
      localStorage.removeItem("last_activity");

      set({
        token: null,
        user: null,
        modules: [],
        moduleTree: [],
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * ========================================
   * SET AUTH
   * ========================================
   */
  setAuth: (token, user, modules) => {
    localStorage.setItem("token", token);

    set({
      token,
      user,
      modules,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  /**
   * ========================================
   * SET USER
   * ========================================
   */
  setUser: (user) => {
    set({
      user,
    });
  },

  /**
   * ========================================
   * SET MODULES
   * ========================================
   */
  setModules: (modules) => {
    set({
      modules,
    });
  },

  setModuleTree: (modules) => {
    set({
      moduleTree: modules,
    });
  },

  /**
   * ========================================
   * LOGOUT
   * ========================================
   */
  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    // Tell backend to revoke the refresh token and blacklist access token JTI
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout API failed (proceeding with local cleanup):", err);
    } finally {
      // Always remove local tokens regardless of whether the network succeeded
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");  // <-- CLEAR REFRESH TOKEN
      localStorage.removeItem("user");
      localStorage.removeItem("last_activity");

      set({
        token: null,
        user: null,
        modules: [],
        moduleTree: [],
        isAuthenticated: false,
        isLoading: false,
      });

      window.location.href = "/login";
    }
  },

  /**
   * ========================================
   * CHECK MODULE ACCESS
   * ========================================
   */
  hasModule: (moduleCode) => {
    const { user, modules } = get();

    if (user?.isSuperAdmin) {
      return true;
    }

    return (modules ?? []).some((module) => module.moduleCode === moduleCode);
  },
}));