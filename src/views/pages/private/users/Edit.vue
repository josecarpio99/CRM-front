<template>
    <Page :title="page.title" :breadcrumbs="page.breadcrumbs" :actions="page.actions" @action="onAction" :is-loading="page.loading">
        <Panel id="edit-user" >
            <Form @submit.prevent="onSubmit">           
                <TextInput 
                    class="mb-4" 
                    type="text" 
                    :required="true" 
                    name="name" 
                    v-model="form.name" 
                    :label="trans('users.labels.name')"
                    :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"

                /> 

                <TextInput 
                    class="mb-4" 
                    type="email" 
                    :required="true" 
                    name="email" 
                    v-model="form.email" 
                    :label="trans('users.labels.email')"
                    :errorMessage="v$.email.$errors.length ? v$.email.$errors[0].$message : ''"

                />

                <Dropdown 
                    class="mb-4" 
                    :options="branches" 
                    :required="true" 
                    name="type" 
                    v-model="form.branch" 
                    :label="trans('users.labels.branch')"
                    :errorMessage="v$.branch.$errors.length ? v$.branch.$errors[0].$message : ''"
                    @input="onBranchChange"
                />  

                <Dropdown 
                    class="mb-4" 
                    :options="roleOptions" 
                    :required="true" 
                    name="type" 
                    v-model="form.role" 
                    :label="trans('users.labels.role')"
                    :errorMessage="v$.role.$errors.length ? v$.role.$errors[0].$message : ''"
                />  

                <TextInput 
                    class="mb-4" 
                    type="password" 
                    name="password" 
                    v-model="form.password" 
                    :label="trans('users.labels.password')"
                    :errorMessage="v$.password.$errors.length ? v$.password.$errors[0].$message : ''"

                />

                <Button
                    :label="trans('global.buttons.update')"
                    class="mt-4"
                    icon="fa fa-save"
                />
            </Form>

            <div    
                v-if="form.role.id == roles.TEAM_LEADER"
                class="border-t-2 pl-2 border-gray-200 pt-8 mt-8 mb-4"
            >
                <h4 class="font-semibold mb-4">Asesores Asignados</h4>

                <ul
                    v-if="assignedUsers.length > 0"
                    class="flex flex-col gap-2"
                >  
                    <li
                        v-for="user in assignedUsers"
                        :key="user.id"
                        class="inline-block w-min text-sm text-gray-800 font-semibold p-2 bg-gray-100 rounded-lg"
                    >
                        {{ user.name }}
                    </li>

                </ul>

                <div class="mt-6">
                    <Dropdown  
                        class="mb-4"
                        :required="false"
                        :label="trans('users.labels.advisors')"
                        selectLabel="name"
                        name="advisors" 
                        :options="userList" 
                        v-model="assignedUsers"
                        :multiple="true"
                        :close-on-select="false"
                    />   
                </div>

                <Button
                    :label="trans('global.buttons.update_assigned_advisors')"
                    class="mt-4"
                    icon="fa fa-save"
                    @click="updateAssignedAdvisors"
                    :disabled="assignedUsers.length == 0"
                />

            </div>

            <div    
                v-if="form.role.id == roles.ADMIN"
                class="border-t-2 pl-2 border-gray-200 pt-8 mt-8 mb-4"
            >
                <h4 class="font-semibold mb-4">Sucursales asignadas</h4>

                <ul
                    v-if="assignedBranches.length > 0"
                    class="flex flex-col gap-2"
                >  
                    <li
                        v-for="branch in assignedBranches"
                        :key="branch.id"
                        class="inline-block w-min text-sm text-gray-800 font-semibold p-2 bg-gray-100 rounded-lg"
                    >
                        {{ branch.name }}
                    </li>

                </ul>

                <div class="mt-6">
                    <Dropdown  
                        class="mb-4"
                        :required="false"
                        :label="trans('users.labels.branches')"
                        selectLabel="name"
                        name="branches" 
                        :options="branchList" 
                        v-model="assignedBranches"
                        :multiple="true"
                        :close-on-select="false"
                    />   
                </div>

                <Button
                    :label="trans('global.buttons.update_assigned_branches')"
                    class="mt-4"
                    icon="fa fa-save"
                    @click="updateUserBranches"
                    :disabled="assignedBranches.length == 0"
                />

            </div>
        </Panel>
    </Page>
</template>

<script>
import {defineComponent, onBeforeMount, reactive, ref, computed} from "vue";
import {trans} from "@/helpers/i18n";
import {fillObject, reduceProperties} from "@/helpers/data"
import {useRoute} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {useUsersStore} from "@/stores/users";
import {useAlertStore} from "@/stores";
import {useGlobalStateStore} from "@/stores";
import {toUrl} from "@/helpers/routing";
import UserService from "@/services/UserService";
import Button from "@/views/components/input/Button";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import Alert from "@/views/components/Alert";
import Panel from "@/views/components/Panel";
import Page from "@/views/layouts/Page";
import FileInput from "@/views/components/input/FileInput";
import Form from "@/views/components/Form";
import {roleOptionsList as roleOptions, roles} from "@/stub/roles";
import {branches, branchList} from "@/stub/statuses";
import useVuelidate from '@vuelidate/core';
import {
  required,
  minLength,  
  helpers
} from '@vuelidate/validators';

export default defineComponent({
    components: {
        Form,
        FileInput,
        Panel,
        Alert,
        Dropdown,
        TextInput,
        Button,
        Page
    },
    setup() {
        const {user} = useAuthStore();
        const usersStore = useUsersStore();
        const alertStore = useAlertStore();
        const globalUserState = useGlobalStateStore();

        const route = useRoute();
        const form = reactive({ 
            name: '',
            email: '',
            role: '',
            branch: '',
            password: '',
        });

        const assignedUsers = ref([]);
        const assignedBranches = ref([]);

        const userList = computed(() => usersStore.userList.filter(
                (item) => item.branch == form.branch.id && item.role == roles.ADVISOR
            )
        );               

        const rules = {
            name: {
                required: helpers.withMessage(trans('global.validation.required'), required)
            },
            email: {
                required: helpers.withMessage(trans('global.validation.required'), required)
            },
            branch: {
                required: helpers.withMessage(trans('global.validation.required'), required)
            },
            role: {
                required: helpers.withMessage(trans('global.validation.required'), required)
            },
            password: {
                minLength: helpers.withMessage(
                    trans('global.validation.minlength', { count: 8 }),
                    minLength(8)
                ),
            }
        }

        const v$ = useVuelidate(rules, form);

        const page = reactive({
            id: 'edit_user',
            title: trans('global.pages.users_edit'),
            filters: false,
            loading: true,
            breadcrumbs: [
                {
                    name: trans('global.pages.users'),
                    to: toUrl('/users/list'),
                },
                {
                    name: trans('global.pages.users_edit'),
                    active: true,
                }
            ],
            actions: [
                {
                    id: 'back',
                    name: trans('global.buttons.back'),
                    icon: "fa fa-angle-left",
                    to: toUrl('/users/list'),
                    theme: 'outline',
                },
                // {
                //     id: 'submit',
                //     name: trans('global.buttons.update'),
                //     icon: "fa fa-save",
                //     type: 'submit'
                // }
            ]
        });

        const service = new UserService();

        onBeforeMount(() => {
            service.find(route.params.id).then((response) => {
                fillObject(form, response.data.data);   
                form.role = roleOptions.find(option => option.id === form.role);
                form.branch = branches.find(option => option.id === form.branch);
                assignedUsers.value = response.data.data.assignedUsers ?? []; 
                assignedBranches.value = response.data.data.branches ?? []; 

                page.loading = false;
            })
        });

        function onAction(data) {
            switch(data.action.id) {
                case 'submit':
                    onSubmit();
                    break;
            }
        }

        function onSubmit() {
            v$.value.$touch();

            if (v$.value.$invalid) {
                return true
            }

            v$.value.$reset();

            service.handleUpdate('edit-user', route.params.id, reduceProperties(form, ['role', 'branch'], 'id'));
            return false;
        }

        function updateAssignedAdvisors() {
            globalUserState.loadingElements['edit-user'] = true;

            let data = {
                users: assignedUsers.value.map(item => item)
            };

            service.syncManagerUser(
                route.params.id,
                data
            ).then((res) => {              
                alertStore.success();  
                globalUserState.loadingElements['edit-user'] = false;
            })
        }

        function updateUserBranches() {
            globalUserState.loadingElements['edit-user'] = true;

            let data = {
                branches: assignedBranches.value.map(item => item)
            };

            service.syncBranchUser(
                route.params.id,
                data
            ).then((res) => {              
                alertStore.success();  
                globalUserState.loadingElements['edit-user'] = false;
            })
        }

        function onBranchChange() {
            assignedUsers.value = [];
        }

        return {
            trans,
            user,
            form,
            onSubmit,
            updateAssignedAdvisors,
            onAction,
            page,
            roleOptions,
            roles,
            branches,
            assignedUsers,
            usersStore,
            userList,
            onBranchChange,
            v$,
            branchList,
            updateUserBranches,
            assignedBranches
        }
    }
})
</script>

<style scoped>

</style>
