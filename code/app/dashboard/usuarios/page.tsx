import { UsersManagement } from "@/components/users-management"

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestão de Usuários</h1>
        <p className="text-muted-foreground mt-1">Gerencie usuários e permissões do sistema</p>
      </div>

      <UsersManagement />
    </div>
  )
}
