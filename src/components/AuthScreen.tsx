
import React, { useState } from 'react';
import { supabase } from '../supabaseClient.ts';
import { Button } from './Button.tsx';
import { Card } from './Card.tsx';

interface AuthScreenProps {
    onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmMessage, setShowConfirmMessage] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        if (!supabase) {
            setError("La configuration de l'authentification est manquante. Impossible de se connecter.");
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                if (error) throw error;
                // onAuthSuccess sera géré par le listener onAuthStateChange dans App.tsx
                onAuthSuccess();
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });
                if (error) throw error;
                
                // Vérifie si l'utilisateur doit confirmer son email (dépend des réglages Supabase)
                if (data.user && data.user.identities && data.user.identities.length > 0 && !data.session) {
                    setRegisteredEmail(data.user.email || email);
                    setShowConfirmMessage(true);
                } else {
                    // Si l'auto-confirm est activé ou si la session est créée directement
                    onAuthSuccess();
                }
            }
        } catch (err: any) {
             const errorMessage = err.message || "Une erreur inconnue est survenue.";
             if (errorMessage.includes("Invalid login credentials")) {
                setError("Email ou mot de passe incorrect.");
             } else if (errorMessage.includes("User already registered")) {
                setError("Un utilisateur avec cet email existe déjà.");
             } else if (errorMessage.includes("Password should be at least 6 characters")) {
                setError("Le mot de passe doit contenir au moins 6 caractères.");
             } else {
                setError(errorMessage);
             }
        } finally {
            setIsLoading(false);
        }
    };
    
    if (showConfirmMessage) {
        return (
            <div className="flex flex-col items-center justify-center p-4 animate-fade-in text-fg">
                <div className="max-w-md w-full">
                    <Card>
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl">✉️</h2>
                            <h2 className="text-2xl font-bold">Vérifie tes emails !</h2>
                            <p className="text-muted">
                                Un email de confirmation a été envoyé à <br />
                                <strong className="text-fg">{registeredEmail}</strong>.
                            </p>
                            <p className="text-sm text-muted">
                                Clique sur le lien dans cet email pour activer ton compte et pouvoir te connecter.
                            </p>
                            <Button 
                                variant="primary" 
                                className="w-full text-lg"
                                onClick={() => {
                                    setShowConfirmMessage(false);
                                    setIsLogin(true);
                                    setPassword('');
                                }}
                            >
                                Retour à la connexion
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 text-fg w-full">
            <div className="max-w-md w-full">
                <header className="text-center mb-6">
                    <h1 className="text-2xl font-bold">MindPivot Cloud</h1>
                    <p className="text-muted text-sm">Sauvegarde ta progression et accède à tes rituels partout.</p>
                </header>
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-xl font-bold text-center">{isLogin ? 'Connexion' : 'Créer un compte'}</h2>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 focus:ring-accent focus:border-accent text-fg"
                                disabled={isLoading}
                                placeholder="exemple@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-muted mb-2">Mot de passe</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 focus:ring-accent focus:border-accent text-fg"
                                disabled={isLoading}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && <p className="text-bad text-sm text-center bg-bad/10 p-2 rounded">{error}</p>}

                        <div>
                            <Button type="submit" variant="primary" className="w-full text-lg" disabled={isLoading}>
                                {isLoading ? (isLogin ? 'Connexion...' : 'Création...') : (isLogin ? 'Se connecter' : 'S\'inscrire')}
                            </Button>
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="text-sm text-link hover:underline hover:text-accent transition-colors"
                                disabled={isLoading}
                            >
                                {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};
