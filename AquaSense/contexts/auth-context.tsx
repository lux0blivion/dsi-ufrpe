// Contexto global de autenticação.
// Futuramente: expor `AuthProvider` e `useAuth` para compartilhar usuário logado e permissões.


import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { onAuthStateChanged, reload, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";

// Formato dos dados do usuário que vamos guardar no contexto
interface UserProfile {
    uid: string;
    nome: string;
    email: string;
    cidade: string;
    tipoUsuario: string;
    statusConta: string;
}

interface AuthContextData {
    user: User | null;              // usuário do Firebase Auth
    userProfile: UserProfile | null; // dados do Firestore
    loadingAuth: boolean;            // true enquanto o Firebase ainda está inicializando
}

const AuthContext = createContext<AuthContextData>({
    user: null,
    userProfile: null,
    loadingAuth: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        // onAuthStateChanged dispara automaticamente quando:
        // - o app abre (verifica se já tinha sessão salva)
        // - o usuário faz login
        // - o usuário faz logout
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Recarrega o usuário para pegar o emailVerified atualizado
                // Isso é importante: se o usuário verificou o e-mail e voltou
                // ao app, o Firebase local ainda pode ter o estado antigo
                await reload(firebaseUser);
                const freshUser = auth.currentUser;

                if (freshUser) {
                    setUser(freshUser);

                    // Busca os dados do Firestore
                    const docRef = doc(db, "usuarios", freshUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserProfile;

                        // Se o Firebase Auth diz que o e-mail está verificado
                        // mas o Firestore ainda está como "pendente_verificacao",
                        // atualiza agora (sincronização automática)
                        if (
                            freshUser.emailVerified &&
                            data.statusConta === "pendente_verificacao"
                        ) {
                            await updateDoc(docRef, { statusConta: "ativo" });
                            setUserProfile({ ...data, statusConta: "ativo" });
                        } else {
                            setUserProfile(data);
                        }
                    }
                }
            } else {
                // Usuário não está logado
                setUser(null);
                setUserProfile(null);
            }

            setLoadingAuth(false);
        });

        // Limpa o listener quando o componente desmonta
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userProfile, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para usar o contexto em qualquer tela
export function useAuth() {
    return useContext(AuthContext);
}
