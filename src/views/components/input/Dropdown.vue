<template>
    <div :style="style" :class="$props.class" :data-value="value?.label || value?.name">
        <label :for="name" class="text-sm text-gray-500" :class="{ 'sr-only': !showLabel }" v-if="label">
            {{ label }}<span class="text-red-600" v-if="$props.required">*</span>
        </label>
        <!-- <Multiselect track-by="id" label="title" v-model="value" :id="$props.name" :name="$props.name" :disabled="disabled" :placeholder="$props.placeholder" :options="selectOptions" :multiple="$props.multiple" :searchable="true" :loading="isLoading"  :clear-on-select="false" :close-on-select="$props.closeOnSelect" :show-no-results="false" :hide-selected="false" open-direction="bottom" @close="handleClose" @select="handleSelect"
        :showLabels="false"
        >
        </Multiselect> -->
        <VSelect 
            v-model="value" 
            :options="$props.options" 
            :id="$props.name" 
            :name="$props.name"
            :placeholder="$props.placeholder"
            :class="$props.selectClass"
            :label="$props.selectLabel"            
            :closeOnSelect="$props.closeOnSelect"
            :dropdown-should-open="dropdownShouldOpen"
            :multiple="$props.multiple"
            @option:selected="handleSelect"
            @search="handleSearch"
            ref="select"
        >

            <template #no-options="{ search, searching, loading }">
                {{ search.length < 3 ? 'Escribe para buscar' : 'No se encontraron resultados'  }}
            </template>

        </VSelect>

        <span v-if="$props.errorMessage.length > 0" class="text-red-500 text-sm ml-1">
            {{ $props.errorMessage }}
        </span>
    </div>
</template>

<script>

import {computed, defineComponent, ref, onMounted} from "vue";

import SearchService from "@/services/SearchService";
import Multiselect from 'vue-multiselect';

export default defineComponent({
    components: {Multiselect},
    inheritAttrs: false,
    props: {
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
            type: [Object, String, Number, Boolean],
        },
        showLabel: {
            type: Boolean,
            default: true,
        },
        required: {
            type: Boolean,
            default: false,
        },
        open: {
            type: Boolean,
            default: false
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
        server: {
            type: String,
            default: null,
        },
        serverPerPage: {
            type: Number,
            default: 5
        },        
        serverSearchMinCharacters: {
            type: Number,
            default: 3
        },
        errorMessage: {
            type: String,
            default: '',
        },
        selectClass: {
            type: String,
            default: '',
        }
    },
    emits: ['update:modelValue', 'input', 'closed', 'selected', 'deselected', 'search'],
    setup(props, {emit}) {

        let selectOptionsArr = ref(props.options);
        let isLoading = ref(false);
        let select = ref(null);

        const selectOptions = computed(() => {
            let val = [];
            for (let i in selectOptionsArr.value) {
                if (typeof selectOptionsArr.value[i] === 'object') {
                    val.push({id: selectOptionsArr.value[i].id, label: selectOptionsArr.value[i].label});
                } else {
                    val.push(selectOptionsArr.value[i])
                }
            }
            return val;
        });

        const value = computed({
            get() {
                return props.modelValue;
            },
            set(newValue) {
                emit("update:modelValue", newValue);
                emit('input', value);
            },
        })

        function handleSearch(search, loading) {
            emit('search', search, loading)
        }

        function handleClose() {
            emit('closed');
        }

        function handleSelect(item) {
            emit('selected', item);
        }      

        function dropdownShouldOpen({ noDrop: e, open: t, mutableLoading: s }) {            
            if (props.open) {
                return true;
            }

            return e ? !1 : t && !s;          
        }        

        return {
            value,
            selectOptions,
            handleSearch,
            isLoading,
            handleClose,
            handleSelect,
            select,
            dropdownShouldOpen
        }
    }
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
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

div[data-value="AAA - Corporativos e Industrias"] .vs__selected,
div[data-value="de 0 a 3 meses"] .vs__selected,
div[data-value="Prospección"] .vs__selected,
div[data-value="Ganado"] .vs__selected
{
    @apply bg-green-300;
    @apply text-gray-600;
}

div[data-value="AA - Pymes"] .vs__selected,
div[data-value="de 3 a 6 meses"] .vs__selected,
div[data-value="Publicidad - Guardia"] .vs__selected
{
    @apply bg-yellow-300;
    @apply text-gray-600;
}

div[data-value="A - Micro y Personas Físicas"] .vs__selected,
div[data-value="6 meses o más"] .vs__selected,
div[data-value="Recompra"] .vs__selected,
div[data-value="Nuevo"] .vs__selected,
{
    @apply bg-blue-300;
    @apply text-gray-600;
}

div[data-value="Perdido"] .vs__selected
{
    @apply bg-red-300;
}

div[data-value="En proceso"] .vs__selected
{
    @apply bg-gray-300;
}

.vs__dropdown-menu li:hover {
    @apply opacity-80;
}

.customer_category .vs__dropdown-menu li:nth-child(1),
.estimated_close_date_range .vs__dropdown-menu li:nth-child(1),
.deal_source .vs__dropdown-menu li:nth-child(1),
.deal_status .vs__dropdown-menu li:nth-child(2)
{
    @apply bg-green-300;
    @apply text-gray-600;
}

.customer_category .vs__dropdown-menu li:nth-child(2),
.estimated_close_date_range .vs__dropdown-menu li:nth-child(2),
.deal_source .vs__dropdown-menu li:nth-child(2)
{
    @apply bg-yellow-300;
    @apply text-gray-600;
}

.customer_category .vs__dropdown-menu li:nth-child(3),
.estimated_close_date_range .vs__dropdown-menu li:nth-child(3),
.deal_source .vs__dropdown-menu li:nth-child(3),
.deal_status .vs__dropdown-menu li:nth-child(1)

{
    @apply bg-blue-300;
    @apply text-gray-600;
}

.deal_status .vs__dropdown-menu li:nth-child(3)
{
    @apply bg-red-300;
    @apply text-gray-600;
}

.deal_status .vs__dropdown-menu li:nth-child(4)
{
    @apply bg-gray-300;
    @apply text-gray-600;
}

// .estimated_close_date_range .vs__dropdown-menu li:nth-child(3) 
// {
//     @apply text-red-400;
// }


</style>
