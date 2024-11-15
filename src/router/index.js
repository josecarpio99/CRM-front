import {createWebHistory, createRouter} from "vue-router";

import routes from "@/router/routes";

import {useAuthStore} from "@/stores/auth";
import {usePendingOpportunitiesStore} from "@/stores/pendingOpportunities";
import {can} from '@/helpers/permissions';
import {roles} from "@/stub/roles";

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes,
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    if (!authStore.user) {
        await authStore.getCurrentUser();        
    }

    if (authStore.user) {
        if (authStore.user?.role === roles.ADVISOR) {
            const pendingOpportunitiesStore = usePendingOpportunitiesStore();
            if (! pendingOpportunitiesStore.interval) {
                pendingOpportunitiesStore.setIntervalFn();            
            }
        }      
    }

    if (!authStore.user) {
        authStore.clearBrowserData();
    }
   
    const requiresRole = to.meta.requiresRole;
    const requiresPermission = to.meta.requiresPermission;
    const requiresAuth = to.meta.requiresAuth;
    const visitor = to.meta.visitor;
    const belongsToOwnerOnly = to.meta.isOwner;
    
    if (requiresAuth && !authStore.user) {
        next({name: 'home'});
    } else if ((requiresRole)) {

        if(authStore.isMasterOrDirector()) {
            next(); 
        } else if (authStore.hasAccessByRole(requiresRole)) {
            next();       
        } else {
            next({
                name: 'customers.list',
            })
        }

    } else if (requiresAuth && !authStore.user) {
        next({name: 'home'})
    } else if (requiresPermission && requiresAuth) {
        if (can(requiresPermission)) {
            next();
        }else {
            next({name: 'customers.list'});
        }
    } else if (visitor && authStore.user) {
        next({name: 'customers.list'});
    }  else {
        next()
    }
})

export default router;
