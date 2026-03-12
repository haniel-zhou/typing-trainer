import { AppShell } from "@/components/app-shell";
import { AuthGateway } from "@/components/auth-gateway";

export default function AuthPage() {
  return (
    <AppShell>
      <AuthGateway />
    </AppShell>
  );
}
