import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type { User } from "@/types/user";

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

type UserAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_SELECTED_USER"; payload: User | null }
  | { type: "ADD_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "DELETE_USER"; payload: string };

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_USERS":
      return { ...state, users: action.payload, loading: false, error: null };
    case "SET_SELECTED_USER":
      return { ...state, selectedUser: action.payload };
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.payload],
        loading: false,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
        selectedUser:
          state.selectedUser?.id === action.payload.id
            ? action.payload
            : state.selectedUser,
        loading: false,
        error: null,
      };
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        selectedUser:
          state.selectedUser?.id === action.payload ? null : state.selectedUser,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
