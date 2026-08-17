/** role_id 4 = Chef d'équipe, 5 = Superviseur */
export const ROLE_TEAM_MANAGER = 4;
export const ROLE_SUPERVISOR = 5;

export function getRoleLabel(roleId: number | string | null | undefined): string {
  const id = Number(roleId);
  if (id === ROLE_TEAM_MANAGER) return "Chef d'équipe";
  if (id === ROLE_SUPERVISOR) return "Superviseur";
  if (roleId == null || roleId === "") return "Non spécifié";
  return `Rôle ${roleId}`;
}

export function isTeamManager(roleId: number | string | null | undefined): boolean {
  return Number(roleId) === ROLE_TEAM_MANAGER;
}

export function isSupervisor(roleId: number | string | null | undefined): boolean {
  return Number(roleId) === ROLE_SUPERVISOR;
}
