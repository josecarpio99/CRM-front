<template>
  <div :style="style" :class="$props.class">
      <label :for="name" class="text-sm text-gray-500" :class="{ 'sr-only': !showLabel }" v-if="label">
          {{ label }}<span class="text-red-600" v-if="$props.required">*</span>
      </label>  
      <VSelect
          v-model="value" 
          :options="paginated" 
          :id="$props.name" 
          :name="$props.name"
          :label="'name'"            
          :closeOnSelect="$props.closeOnSelect"
          :filterable="false"
          @option:selected="handleSelect"
          @search="handleSearch"

      >
        <template #list-footer>
            <li ref="load" class="loader">
                Loading more options...
            </li>
        </template>
      </VSelect>
  </div>
</template>

<script setup>
import {computed, ref, onMounted, watch, nextTick, reactive} from "vue";
import UserService from "@/services/UserService";
import {getResponseError, prepareQuery} from "@/helpers/api";
import {useAlertStore} from "@/stores";

const emit = defineEmits(['update:modelValue', 'input', 'closed', 'selected']);
const props = defineProps({
  class: String,
  style: [String, Object],
  name: {
      type: String,
      required: true,
  },
  options: {
      required: false,
  },
  label: {
      type: String,
      default: "",
  },
  selectLabel: {
      type: String,
      default: "label",
  },
  modelValue: {
      type: [Object, String],
  },
  showLabel: {
      type: Boolean,
      default: true,
  },
  required: {
      type: Boolean,
      default: false,
  },
  disabled: {
      type: Boolean,
      default: false
  },
  placeholder: {
      type: String,
      default: null,
  },
  multiple: {
      type: [Boolean, String, Number],
      default: false,
  },
  closeOnSelect: {
      type: Boolean,
      default: true
  },
  type: {
    type: String,
    default: 'simple'
  }
});

const mainQuery = reactive({
    page: 1,
    limit: 10,
    filters: {
        search: {
            value: '',
            comparison: '='
        }
    }
});

const userService = new UserService();
const alertStore = useAlertStore();
const load = ref('');
let observer = null;
let limit = 10;
let search = '';
let total = null;
let users = [];

const value = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue);
        emit('input', value);
    },
});

// const filtered = computed(UserService.index({'filter[search]': search}).then(res) => res.data.data);
let paginated = computed(() => users);
function hasNextPage() { return users.length < total};

function handleClose() {
    emit('closed');
}

function handleSelect() {
    emit('selected');
}

function handleSearch(search, loading) {
  console.log(search);
  mainQuery.filters.search.value = search;
}

async function onOpen() {
    if (hasNextPage()) {
        await nextTick()
        console.log(load);
        observer.observe(load.$el)
    }
}

async function onClose() {
    observer.disconnect();
}

function fetchPage(params) {    
    let query = prepareQuery(params);
    userService
        .index(query)
        .then((response) => {
            users = response.data.data;
            console.log(users);
            total = response.data.meta.total;
        })
        .catch((error) => {
            console.log(error);
            alertStore.error(getResponseError(error));
        });
}

async function infiniteScroll([{ isIntersecting, target }]) {
    if (isIntersecting) {
    const ul = target.offsetParent
    const scrollTop = target.offsetParent.scrollTop
    limit += limit
    await nextTick()
    ul.scrollTop = scrollTop
    }
}

watch(mainQuery, (newTableState) => {
    fetchPage(mainQuery);
});

onMounted(() => {
    observer = new IntersectionObserver(infiniteScroll);
    fetchPage(mainQuery);
});

</script>

<style lang="scss">
.multiselect__input {
    max-width: 300px !important;
    border: 0 !important;
}
.multiselect__input:focus, .multiselect__input:active, .multiselect__input:hover {
    border: 0 !important;
    outline: none !important;
    outline-offset: 0 !important;
    box-shadow: none !important;
}

.vs__dropdown-menu {
    max-height: 200px !important;
    font-size: 0.875rem !important;
}

.vs__dropdown-toggle {
    padding: .25rem .5rem .25rem .5rem !important;
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
    --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
    --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color) !important;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important;
    --tw-border-opacity: 1 !important;
    border-color: rgb(209 213 219 / var(--tw-border-opacity)) !important;
    border-width: 1px !important;
    border-radius: 0.375rem !important;
}

.vs__search {
    border-width: 0;
    border-color: transparent;
}

.vs__selected-options {
    padding: 0 !important;
}
</style>