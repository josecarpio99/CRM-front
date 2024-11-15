import {useAuthStore} from "@/stores/auth";
import {roles} from "@/stub/roles";

export const can = function (name) {
  const authStore = useAuthStore();

  // if (name == 'view:customers') {
  //   if (authStore.isDirector()) {
  //     return false;
  //   }

  //   return true;
  // }

  if (name == 'view:delete') {
    if (
      authStore.isMasterOrDirector() ||
      authStore.hasAccessByRole(roles.ADMIN) ||
      authStore.hasAccessByRole(roles.LEAD_QUALIFIER)
      ) {
      return true;
    }

    return false;
  }

  if (name == 'view:created_by') {
    if (
      authStore.isMasterOrDirector() ||
      authStore.hasAccessByRole(roles.LEAD_QUALIFIER)
      ) {
      return true;
    }

    return false;
  }

  if (name == 'view:opportunities_by_lead_qualifier') {
    if (
      authStore.isMasterOrDirector() ||
      authStore.hasAccessByRole(roles.ADMIN) ||
      authStore.hasAccessByRole(roles.LEAD_QUALIFIER) 
      ) {
      return true;
    }

    return false;
  }

  if (name == 'view:deal_status_report') {
    if (
      authStore.isMasterOrDirector() ||
      authStore.hasAccessByRole(roles.ADMIN) ||
      authStore.hasAccessByRole(roles.LEAD_QUALIFIER) 
      ) {
      return true;
    }

    return false;
  }

  if (name == 'view:branch_report') {
    if (
      authStore.isMasterOrDirector() ||
      authStore.hasAccessByRole(roles.ADMIN) ||
      authStore.hasAccessByRole(roles.TEAM_LEADER) ||
      authStore.hasAccessByRole(roles.LEAD_QUALIFIER) 
      ) {
      return true;
    }

    return false;
  }

  if (name == 'view:deals') {
    if (
      authStore.isMasterOrDirector() ||
      authStore.hasAccessByRole(roles.ADMIN) ||
      authStore.hasAccessByRole(roles.TEAM_LEADER) ||
      authStore.hasAccessByRole(roles.LEAD_QUALIFIER) 
      ) {
      return true;
    }

    return false;
  }

  if (name == 'view:leads') {
    if (authStore.isDirector()) {
      return false;
    }

    return true;
  }

  if (name == 'view:reports') {
    if (authStore.hasAccessByRole(roles.SUPERADMIN)) {
      return true;
    }

    return false;
  }

  return false;
}