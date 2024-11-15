<template>
  <Page
    :title="'Reportes'" 
    :showFooter="false"
  >
    <Panel>
      <div class="p-8">
        <ul class="report-list max-w-6xl mx-auto">
          <li v-if="authStore.isMasterOrDirector()">
            <router-link               
              :to="{name: 'reports.scorecard'}" 
              class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              {{ trans('global.menu.scorecard') }}
            </router-link>
          </li>

          <li>
            <router-link :to="{name: 'reports.origins'}" class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              {{ trans('global.menu.origins') }}
            </router-link>
          </li>

          <li v-if="can('view:opportunities_by_lead_qualifier')">
            <router-link :to="{name: 'reports.opportunities_by_lead_qualifier'}" class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              {{ trans('global.menu.assigned_leads') }}
            </router-link>
          </li>

          <li v-if="can('view:deal_status_report')">
            <router-link :to="{name: 'reports.deal_status'}" class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              {{ trans('global.menu.deal_status') }}
            </router-link>
          </li>

          <li v-if="can('view:branch_report')">
            <router-link :to="{name: 'reports.user_audit'}" class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              {{ trans('global.pages.user_audit') }}
            </router-link>
          </li>

          <li v-if="can('view:branch_report')">
            <router-link :to="{name: 'reports.branch'}" class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              {{ trans('global.pages.global_resume') }}
            </router-link>
          </li>

          <li v-if="can('view:branch_report')">
            <router-link :to="{name: 'reports.branch-period'}" class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              {{ trans('global.pages.global_resume') }}
              (<span class="text-sm">Con Ganados de Otros Períodos</span>)
            </router-link>
          </li>

          <li v-if="can('view:branch_report')">
            <router-link :to="{name: 'reports.owner'}" class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              {{ trans('global.pages.resume_by_branch') }}
            </router-link>
          </li>

          <li v-if="can('view:branch_report')">
            <router-link :to="{name: 'reports.owner-period'}" class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              {{ trans('global.pages.resume_by_branch') }}
              (<span class="text-sm">Con Ganados de Otros Períodos</span>)
            </router-link>
          </li> 

          <li>
            <router-link :to="{name: 'reports.user_report'}" class="border-2 border-gray-500 p-4 text-gray-700 hover:bg-gray-100 text-center uppercase w-full font-semibold rounded-lg block tracking-wide whitespace-normal">
              RADIOGRAFÍA ASESORES
            </router-link>
          </li>         

        </ul>
      </div>
    </Panel>
  </Page>
</template>

<script setup>
import Page from "@/views/layouts/Page";
import Panel from "@/views/components/Panel";
import {trans} from "@/helpers/i18n";
import { useAuthStore } from "@/stores/auth";
import {can} from '@/helpers/permissions';

const authStore = useAuthStore();

</script>

<style scope>
.report-list {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(
      150px,
      400px
    )
  );
  gap: 16px;
  place-content: center;
}
</style>
