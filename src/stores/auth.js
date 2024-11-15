import router from "@/router";
import {defineStore} from 'pinia'
import {getResponseError} from "@/helpers/api";
import {useAlertStore} from "@/stores/alert";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
import {trans} from "@/helpers/i18n";
import {roles} from "@/stub/roles";
import {usePendingOpportunitiesStore} from "@/stores/pendingOpportunities";

export const useAuthStore = defineStore("auth", {
    state: () => {
        return {
            user: null,
            lastIncompletedTasks: [],
            notifications: [],
            error: null,
            interval: null
        };
    },
    actions: {
        async login(payload) {
            const authService = new AuthService();
            const alertStore = useAlertStore();
            try {
                const response = await authService.login(payload);
                this.user = response.data.user;
                this.setBrowserData();
                alertStore.clear();
                await router.push("/panel/customers/list");
                await this.getCurrentUser();
            } catch (error) {
                alertStore.error(getResponseError(error));
            }
        },
        async register(payload) {
            const authService = new AuthService();
            const alertStore = useAlertStore();
            try {
                const response = await authService.registerUser(payload);
                await router.push("/panel/customers/list");
                alertStore.clear();
            } catch (error) {
                alertStore.error(getResponseError(error));
            }
        },
        async getCurrentUser() {
            this.loading = true;
            const authService = new AuthService();
            try {
                const response = await authService.getCurrentUser();
                this.user = response.data.data;
                this.lastIncompletedTasks = response.data.data.lastIncompletedTasks;
                this.notifications = response.data.data.notifications;
                if (!this.interval) {
                    this.setIntervalFn();
                }
                this.loading = false
            } catch (error) {
                this.loading = false
                this.user = null;
                this.error = getResponseError(error);
            }
            return this.user;
        },
        updateAvatar(id, payload) {
            const alertStore = useAlertStore();
            const userService = new UserService();
            return new Promise((resolve, reject) => {
                return userService
                    .updateAvatar(id, payload)
                    .then((response) => {
                        this.getCurrentUser().then(() => {
                            alertStore.success(trans('global.phrases.file_uploaded'));
                            resolve(response)
                        });
                    })
                    .catch((err) => {
                        alertStore.error(getResponseError(err));
                        reject(err)
                    })
            })
        },
        logout() {
            return new Promise((resolve, reject) => {
                const alertStore = useAlertStore();
                const authService = new AuthService();
                return authService
                    .logout()
                    .then((response) => {
                        this.clearBrowserData();
                        this.stopIntervals();
                        this.user = null;
                        if (router.currentRoute.name !== "login") {
                            router.push({path: "/login"});
                            window.location.reload();
                            console.log('logout...');
                        }
                        resolve(response)
                    })
                    .catch((err) => {
                        alertStore.error(getResponseError(err));
                        reject(err)
                    })
            });
        },
        hasBrowserData() {
            let data = window.localStorage.getItem('currentUser');
            return !!data;
        },
        setBrowserData() {
            window.localStorage.setItem('currentUser', JSON.stringify(this.user))
        },
        clearBrowserData() {
            window.localStorage.removeItem('currentUser');
        },
        stopIntervals() {
            const pendingOpportunitiesStore = usePendingOpportunitiesStore();
            clearInterval(this.interval);
            pendingOpportunitiesStore.stopIntervalFn();    
        },
        hasAbilities(abilities) {
            return this.user.hasOwnProperty('abilities') && !!this.user.abilities.find((ab) => {
                if (ab.name === '*') {
                    return true
                }
                if (typeof abilities === 'string') {
                    return ab.name === abilities
                }
                return !!abilities.find((p) => {
                    return ab.name === p
                })
            })
        },

        hasAllAbilities(abilities) {
            let isAvailable = true
            if (this.user.hasOwnProperty('abilities')) {
                this.user.abilities.filter((ab) => {
                    let hasContain = !!abilities.find((p) => {
                        return ab.name === p
                    })
                    if (!hasContain) {
                        isAvailable = false
                    }
                })
            }

            return isAvailable
        },

        hasAccessByRole(role) {
            if (
                this.user.role === roles.SUPERADMIN ||
                this.user.role === roles.DIRECTOR ||
                this.user.role === role
            ) {
                return true;
            } else {
                return false;
            }
        },

        isDirector() {
            if (
                this.user.role === roles.DIRECTOR
            ) {
                return true;
            } else {
                return false;
            }
        },

        isMasterOrDirector() {
            if (this.user.role === roles.SUPERADMIN || this.user.role === roles.DIRECTOR) {
                return true;
            }

            return false
        },

        setIntervalFn() {
            this.interval = setInterval(async () => {      
               this.getCurrentUser();                           
            }, 30000);      
        },
    },
    getters: {
        isAdmin: (state) => {
            return state.user ? state.user.is_admin : false;
        },
        loggedIn: (state) => {
            return !!state.user;
        },
        guest: (state) => {
            return !state.hasBrowserData();
        },
    }
});
