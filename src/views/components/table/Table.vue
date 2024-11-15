<template>
  <div class="w-full shadow border-b border-gray-200 mb-8 sm:rounded-lg overflow-auto">
      <table class="w-full divide-y divide-gray-200 table-auto">
          <thead class="bg-gray-50">
          <tr>
              <th v-for="(item, i) in headers" scope="col" class="align-middle px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <slot :name="'header-'+i">
                      <div class="leading-loose inline-block">{{ item }}</div>
                      <div class="sort-arrows inline-block text-center absolute" v-if="sorting.hasOwnProperty(i) && sorting[i]">
                          <span @click.prevent="onSortChange(i, 'asc')" :class="sortControlClasses(i, 'asc')" class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i class="fa fa-caret-up"></i></span>
                          <span @click.prevent="onSortChange(i, 'desc')" :class="sortControlClasses(i, 'desc')" class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i class="fa fa-caret-down"></i></span>
                      </div>
                  </slot>
              </th>
              <th v-if="actions" scope="col" class="align-middle px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <slot name="actions">{{ trans('global.actions.name') }}</slot>
              </th>
          </tr>
          </thead>
          <tbody v-if="records && records.length && !$props.isLoading" class="bg-white divide-y divide-gray-200">
          
          </tbody>
          <tbody v-else>
          <tr>
              <td :colspan="headersLength" class="pt-10 pb-6 text-center">
                  <template v-if="$props.isLoading">
                      <Spinner :text-new-line="true"></Spinner>
                  </template>
                  <template v-else>
                      {{ trans('global.phrases.no_records') }}
                  </template>
              </td>
          </tr>
          </tbody>
      </table>
  </div>

  <Pager v-if="lastPage && !$props.isLoading" :page-count="lastPage" :value="currentPage" @input="onPagerInput"/>

</template>