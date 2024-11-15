<template>
    <Page :title="page.title" :breadcrumbs="page.breadcrumbs" :actions="page.actions" @action="onAction">
        <Panel>
            <Form id="create-user" :novalidate="true" @submit.prevent="onSubmit">
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
                    :required="true" 
                    name="password" 
                    v-model="form.password" 
                    :label="trans('users.labels.password')"
                    :errorMessage="v$.password.$errors.length ? v$.password.$errors[0].$message : ''"

                />

                <Button
                    :label="trans('global.buttons.save')"
                    class="mt-4"
                    icon="fa fa-save"
                />
            </Form>
        </Panel>
    </Page>
</template>

<script>
import {defineComponent, reactive} from "vue";
import {trans} from "@/helpers/i18n";
import {useAuthStore} from "@/stores/auth";
import Button from "@/views/components/input/Button";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import Alert from "@/views/components/Alert";
import Panel from "@/views/components/Panel";
import Page from "@/views/layouts/Page";
import FileInput from "@/views/components/input/FileInput";
import UserService from "@/services/UserService";
import {clearObject, reduceProperties} from "@/helpers/data";
import {toUrl} from "@/helpers/routing";
import Form from "@/views/components/Form";
import {roleOptionsList as roleOptions} from "@/stub/roles";
import {branches} from "@/stub/statuses";
import useVuelidate from '@vuelidate/core';
import {
  required,
  minLength,  
  helpers
} from '@vuelidate/validators';

export default defineComponent({
    components: {Form, FileInput, Panel, Alert, Dropdown, TextInput, Button, Page},
    setup() {
        const {user} = useAuthStore();
        const form = reactive({
            name: '',           
            email: '',
            role: '',
            branch: '',
            password: '',
        });

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
                required: helpers.withMessage(trans('global.validation.required'), required),
                minLength: helpers.withMessage(
                    trans('global.validation.minlength', { count: 8 }),
                    minLength(8)
                ),
            }
        }

        const v$ = useVuelidate(rules, form);

        const page = reactive({
            id: 'create_users',
            title: trans('global.pages.users_create'),
            filters: false,
            breadcrumbs: [
                {
                    name: trans('global.pages.users'),
                    to: toUrl('/users/list'),

                },
                {
                    name: trans('global.pages.users_create'),
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
                //     name: trans('global.buttons.save'),
                //     icon: "fa fa-save",
                //     type: 'submit',
                // }
            ]
        });

        const service = new UserService();

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

            service.handleCreate('create-user', reduceProperties(form, ['role', 'branch'], 'id')).then((res) => {                
                if (res?.status == 200 || res?.status == 201) {
                    clearObject(form)
                }
            })
            
            return false;
        }

        return {
            trans,
            user,
            form,
            page,
            onSubmit,
            onAction,
            roleOptions,
            branches,
            v$
        }
    }
})
</script>

<style scoped>

</style>
