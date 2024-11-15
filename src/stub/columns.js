import {trans} from "@/helpers/i18n";
import {customerCategories} from "@/stub/categories";
import {dealCategories, leadCategories} from "@/stub/categories";
import { datesFilter, datesSinceFilter } from "@/stub/date";
import { customerStatuses } from "@/stub/statuses";
import { leadStatuses, dealStages, branches, customerStarStatus, dealStatus, dealStatusWithoutWon, nexTaskStatuses } from "@/stub/statuses";

export const customerColumns = [
  {
    key: 'checkall',
    label: trans('global.labels.checkall'),
    show: true,
    locked: true 
  },
  {
    key: 'star',
    label: trans('customers.labels.key_contact'),
    show: true,
    locked: false,
    editable: false,
    sorteable: false,
    filterable: true,
    filter: {
      modelValue: '',
      type: 'select',
      options: customerStarStatus
    }
  },
  // {
  //     key: 'name',
  //     label: trans('customers.labels.name'),
  //     show: true,
  //     locked: true,
  //     editable: true,
  //     sorteable: true,
  //     filterable: true,
  //     filter: {
  //       modelValue: null,
  //       type: 'input'
  //     }
  // },
  {
      key: 'company_name',
      label: trans('customers.labels.company_name'),
      show: true,
      locked: true,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'input'            
      }
  },
  {
    key: 'branch',
    label: trans('users.labels.branch'),
    show: true,
    locked: false,
    editable: false,
    sorteable: false,
    filterable: true,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: branches,
    },
    cellLabel: 'owner.branch'
  },     
  {
    key: 'owner',
    label: trans('global.labels.owner'),
    show: true,
    locked: false,
    sorteable: true,
    filterable: true,
    editable: true,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },
    edit: {
      type: 'list',
      options: [],
      optionsLabel: 'name'
    },
    cellKey: 'owner.id',
    cellLabel: 'owner.name'
  }, 
  // {
  //     key: 'email',
  //     label: trans('global.labels.email'),
  //     show: true,
  //     locked: true,
  //     sorteable: true,
  //     editable: true
  // },    
  // {
  //     key: 'mobile',
  //     label: trans('customers.header.phone'),
  //     show: true,
  //     locked: false,
  //     sorteable: false,
  //     editable: true
  // },
  // {
  //     key: 'active_opportunities_count',
  //     label: trans('customers.labels.active_opportunities'),
  //     show: true,
  //     locked: false,
  //     sorteable: true,
  //     editable: false
  // },
  // {
  //     key: 'active_quotes_count',
  //     label: trans('customers.labels.active_quotes'),
  //     show: true,
  //     locked: false,
  //     sorteable: true,
  //     editable: false
  // },
  {
      key: 'active_deals_count',
      label: trans('customers.labels.active_projects'),
      show: true,
      locked: false,
      sorteable: true,
      editable: false
  },
  {
    key: 'next_task',
    label: trans('global.labels.next_task'),
    show: true,
    locked: false,
    editable: false,
    sorteable: true,
    filterable: true,
    filter: {
      modelValue: '',
      type: 'select',
      options: nexTaskStatuses
    },
    cellKey: 'lastActivetask.id',
    cellLabel: 'lastActivetask.name'
  },
  {
    key: 'last_sell_at',
    label: trans('customers.labels.last_sell_at'),
    show: true,
    locked: false,
    editable: false,
    sorteable: true,
    filterable: true,
    filter: {
      modelValue: '',
      type: 'date-select-range',
      options: datesFilter
    }

  },
  {
    key: 'days_since_last_won_deal',
    label: trans('customers.labels.days_since_last_won_deal'),
    show: true,
    locked: false,
    editable: false,
    sorteable: true,
    filterable: true,
    filter: {
      modelValue: '',
      type: 'select',
      options: datesSinceFilter
    }
  },
  {
      key: 'category',
      label: trans('customers.labels.category'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: true,
      editable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: customerCategories
      },
      edit: {
        type: 'list',
        options: customerCategories
      },
      cellKey: 'category.id',
      cellLabel: 'category.name'
  },
  {
    key: 'source',
    label: trans('global.labels.source'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: true,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },
    edit: {
      type: 'list',
      options: [],
      optionsLabel: 'name'
    },
    cellKey: 'source.id',
    cellLabel: 'source.name'
  },    
  {
      key: 'created_at',
      label: trans('customers.labels.created_at'),
      show: true,
      locked: false,
      sorteable: true,
      filterable: true,
      editable: false,
      filter: {
        modelValue:'',
        type: 'date-select-range',
        options: datesFilter
      }          
  },
]

export const leadColumns = [   
  {
    key: 'checkall',
    label: trans('global.labels.checkall'),
    show: true,
    locked: true 
  },
  // {
  //     key: 'name',
  //     label: trans('customers.labels.name'),
  //     show: true,
  //     locked: true,
  //     editable: true,
  //     sorteable: true,
  //     filterable: true,
  //     filter: {
  //       modelValue: '',
  //       type: 'input'            
  //     }
  // },
  {
      key: 'company_name',
      label: trans('customers.labels.company_name'),
      show: true,
      locked: true,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'input'            
      }
  },
  {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      },
      cellLabel: 'owner.branch'
  },
  {
    key: 'creator',
    label: trans('global.labels.created_by'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: false,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },   
    cellKey: 'creator.id',
    cellLabel: 'creator.name'
  },     
  {
      key: 'owner',
      label: trans('global.labels.owner'),
      show: true,
      locked: false,
      sorteable: true,
      filterable: true,
      editable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: [],
        optionsLabel: 'name'
      },
      edit: {
        type: 'list',
        options: [],
        optionsLabel: 'name'
      },
      cellKey: 'owner.id',
      cellLabel: 'owner.name'
  },
  // {
  //   key: 'email',
  //   label: trans('global.labels.email'),
  //   show: true,
  //   locked: true,
  //   sorteable: true,
  //   editable: true
  // },    
  // {
  //   key: 'mobile',
  //   label: trans('customers.header.phone'),
  //   show: true,
  //   locked: false,
  //   sorteable: false,
  //   editable: true
  // },
  {
    key: 'next_task',
    label: trans('global.labels.next_task'),
    show: true,
    locked: false,
    editable: false,
    sorteable: true,
    filterable: false,
    filter: {
      modelValue: '',
      type: 'input'            
    },
    cellKey: 'lastActivetask.id',
    cellLabel: 'lastActivetask.name'
  },
  {
    key: 'category',
    label: trans('customers.labels.category'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: false,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: leadCategories
    },
    edit: {
      type: 'list',
      options: leadCategories
    },
    cellKey: 'category.id',
    cellLabel: 'category.name'
}, 
{
  key: 'source',
  label: trans('global.labels.source'),
  show: true,
  locked: false,
  sorteable: false,
  filterable: true,
  editable: true,
  filter: {
    modelValue: '',
    type: 'multiselect',
    options: [],
    optionsLabel: 'name'
  },
  edit: {
    type: 'list',
    options: [],
    optionsLabel: 'name'
  },
  cellKey: 'source.id',
  cellLabel: 'source.name'
},    
{
    key: 'created_at',
    label: trans('global.labels.created_at'),
    show: true,
    locked: false,
    sorteable: true,
    filterable: true,
    editable: false,
    filter: {
      modelValue:'',
      type: 'date-select-range',
      options: datesFilter
    }          
},
]

export const dealColumns = [
  {
    key: 'checkall',
    label: trans('global.labels.checkall'),
    show: true,
    locked: true 
  },   
  {
      key: 'name',
      label: trans('deals.labels.proyect_name'),
      show: true,
      locked: true,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'input'            
      }
  },
  {
    key: 'contact_name',
    label: trans('customers.labels.company_name'),
    show: true,
    locked: true,
    editable: false,
    sorteable: false,
    filterable: false,
    cellLabel: 'customer.company_name'
  }, 
  {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      },
      cellLabel: 'owner.branch'
  },
  {
    key: 'creator',
    label: trans('global.labels.created_by'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: false,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },   
    cellKey: 'creator.id',
    cellLabel: 'creator.name'
  },
  {
    key: 'owner',
    label: trans('global.labels.owner'),
    show: true,
    locked: false,
    sorteable: true,
    filterable: true,
    editable: true,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },
    edit: {
      type: 'list',
      options: [],
      optionsLabel: 'name'
    },
    cellKey: 'owner.id',
    cellLabel: 'owner.name'
  },
  {
    key: 'source',
    label: trans('global.labels.source'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: true,
    filter: {
      // modelValue: [{
      //   id: 2,
      //   name: 'Publicidad - Guardia',
      // }],
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },
    edit: {
      type: 'list',
      options: [],
      optionsLabel: 'name'
    },
    cellKey: 'source.id',
    cellLabel: 'source.name'
},
{
  key: 'status',
  label: trans('deals.labels.cotizado_status'),
  show: true,
  locked: false,
  sorteable: false,
  filterable: true,
  editable: true,
  filter: {
    modelValue: [
      {
        id: 'en proceso',
        label: 'En proceso',
      },
      {
        id: 'nuevo',
        label: 'Nuevo',
      },
  ],
    type: 'multiselect',
    options: dealStatus
  },
  edit: {
    type: 'list',
    options: dealStatus
  }
}, 
{
  key: 'closed_at',
  label: trans('deals.labels.updated_status_date'),
  show: false,
  locked: false,
  sorteable: true,
  filterable: true,
  editable: false,
  filter: {
    modelValue:'',
    type: 'date-select-range',
    options: datesFilter
  }          
},
{
    key: 'category',
    label: trans('deals.labels.category'),
    show: true,
    locked: false,
    sorteable: true,
    filterable: true,
    editable: false,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: dealCategories
    },
    edit: {
      type: 'list',
      options: dealCategories
    }
  }, 
  {
      key: 'value',
      label: trans('deals.labels.value'),
      show: true,
      locked: false,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: {
          minValue: null,
          maxValue: null
        },
        type: 'range'
      },       
  },       
  {
      key: 'estimated_close_date_range',
      label: trans('deals.labels.estimated_close_date'),
      show: false,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false           
  },
  {
    key: 'next_task',
    label: trans('global.labels.next_task'),
    show: true,
    locked: false,
    editable: false,
    sorteable: true,
    filterable: true,
    filter: {
      modelValue: '',
      type: 'select',
      options: nexTaskStatuses
    },
    cellKey: 'lastActivetask.id',
    cellLabel: 'lastActivetask.name'
  }, 
  {
      key: 'created_at',
      label: trans('global.labels.created_at'),
      show: true,
      locked: false,
      editable: false,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue:'',
        type: 'date-select-range',
        options: datesFilter
      }        
  },         
]

export const cotizadoColumns = [
  // {
  //     key: 'deal',
  //     label: trans('deals.labels.company_name'),
  //     show: true,
  //     locked: true,
  // },   
  {
    key: 'checkall',
    label: trans('global.labels.checkall'),
    show: true,
    locked: true 
  },
  {
      key: 'name',
      label: trans('deals.labels.cotizado_name'),
      show: true,
      locked: true,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'input'            
      }
  },
  {
    key: 'contact_name',
    label: trans('customers.labels.name'),
    show: true,
    locked: true,
    editable: false,
    sorteable: false,
    filterable: false,
    cellLabel: 'customer.name'
  }, 
  // {
  //     key: 'stage',
  //     label: trans('deals.labels.stage'),
  //     show: false,
  //     locked: false,
  //     editable: true,
  //     sorteable: false,
  //     filterable: true,
  //     edit: {
  //       type: 'list',
  //       options: dealStages,
  //     },
  //     filter: {
  //       modelValue: '',
  //       type: 'multiselect',
  //       options: dealStages
  //     },
  //     cellKey: 'stage.id',
  //     cellLabel: 'stage.name'  
  // },         
  {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      },
      cellLabel: 'owner.branch'
  },
  {
    key: 'creator',
    label: trans('global.labels.created_by'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: false,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },   
    cellKey: 'creator.id',
    cellLabel: 'creator.name'
  },
  {
    key: 'owner',
    label: trans('global.labels.owner'),
    show: true,
    locked: false,
    sorteable: true,
    filterable: true,
    editable: true,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },
    edit: {
      type: 'list',
      options: [],
      optionsLabel: 'name'
    },
    cellKey: 'owner.id',
    cellLabel: 'owner.name'
  },
  {
    key: 'source',
    label: trans('global.labels.source'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: true,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },
    edit: {
      type: 'list',
      options: [],
      optionsLabel: 'name'
    },
    cellKey: 'source.id',
    cellLabel: 'source.name'
},  
{
    key: 'status',
    label: trans('deals.labels.cotizado_status'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: true,
    filter: {
      modelValue: [{
        id: 'en proceso',
        label: 'En proceso',
      }],
      type: 'multiselect',
      options: dealStatus
    },
    edit: {
      type: 'list',
      options: dealStatus
    }
  }, 
  {
    key: 'closed_at',
    label: 'Fecha de Proyecto Ganado',
    show: false,
    locked: false,
    sorteable: true,
    filterable: true,
    editable: false,
    filter: {
      modelValue:'',
      type: 'date-select-range',
      options: datesFilter
    }          
  },
{
    key: 'category',
    label: trans('deals.labels.category'),
    show: true,
    locked: false,
    sorteable: true,
    filterable: true,
    editable: false,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: dealCategories
    },
    edit: {
      type: 'list',
      options: dealCategories
    }
  },      
  {
      key: 'value',
      label: trans('deals.labels.value_quoted'),
      show: true,
      locked: false,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: {
          minValue: null,
          maxValue: null
        },
        type: 'range'
      },       
  },          
  {
      key: 'quote',
      label: trans('deals.labels.quote'),
      show: true,
      locked: false,  
  },          
  {
      key: 'profitability_format',
      label: trans('deals.labels.profitability_format'),
      show: true,
      locked: false,  
  },          
  {
      key: 'estimated_close_date_range',
      label: trans('deals.labels.estimated_close_date'),
      show: false,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false           
  },
  {
      key: 'next_task',
      label: trans('global.labels.next_task'),
      show: true,
      locked: false,
      editable: false,
      sorteable: true,
      filterable: false,
      filter: {
        modelValue: '',
        type: 'input'            
      },
      cellKey: 'lastActivetask.id',
      cellLabel: 'lastActivetask.name'
  },  
          
  {
      key: 'created_at',
      label: trans('global.labels.created_at'),
      show: true,
      locked: false,
      editable: false,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue:'',
        type: 'date-select-range',
        options: datesFilter
      }        
  },         
]

export const oportunidadColumns = [
  // {
  //     key: 'deal',
  //     label: trans('deals.labels.company_name'),
  //     show: true,
  //     locked: true,
  // },
  {
    key: 'checkall',
    label: trans('global.labels.checkall'),
    show: true,
    locked: true 
  },   
  {
      key: 'name',
      label: trans('deals.labels.oportunidad_name'),
      show: true,
      locked: true,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'input'            
      }
  },  
  {
    key: 'contact_name',
    label: trans('customers.labels.name'),
    show: true,
    locked: true,
    editable: false,
    sorteable: false,
    filterable: false,
    cellLabel: 'customer.name'
  },    
  {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      },
      cellLabel: 'owner.branch'
  },
  {
    key: 'creator',
    label: trans('global.labels.created_by'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: false,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },   
    cellKey: 'creator.id',
    cellLabel: 'creator.name'
  },
  {
    key: 'owner',
    label: trans('global.labels.owner'),
    show: true,
    locked: false,
    sorteable: true,
    filterable: true,
    editable: true,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },
    edit: {
      type: 'list',
      options: [],
      optionsLabel: 'name'
    },
    cellKey: 'owner.id',
    cellLabel: 'owner.name'
  },
  {
    key: 'source',
    label: trans('global.labels.source'),
    show: true,
    locked: false,
    sorteable: false,
    filterable: true,
    editable: true,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: [],
      optionsLabel: 'name'
    },
    edit: {
      type: 'list',
      options: [],
      optionsLabel: 'name'
    },
    cellKey: 'source.id',
    cellLabel: 'source.name'
},
{
  key: 'status',
  label: trans('deals.labels.cotizado_status'),
  show: true,
  locked: false,
  sorteable: false,
  filterable: true,
  editable: true,
  filter: {
    modelValue: [{
      id: 'en proceso',
      label: 'En proceso',
    }],
    type: 'multiselect',
    options: dealStatusWithoutWon
  },
  edit: {
    type: 'list',
    options: dealStatusWithoutWon
  }
}, 
{
    key: 'category',
    label: trans('deals.labels.category'),
    show: true,
    locked: false,
    sorteable: true,
    filterable: true,
    editable: false,
    filter: {
      modelValue: '',
      type: 'multiselect',
      options: dealCategories
    },
    edit: {
      type: 'list',
      options: dealCategories
    }
  }, 
  {
      key: 'value',
      label: trans('deals.labels.value_estimated'),
      show: true,
      locked: false,
      editable: true,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue: {
          minValue: null,
          maxValue: null
        },
        type: 'range'
      },       
  },       
  {
      key: 'estimated_close_date_range',
      label: trans('deals.labels.estimated_close_date'),
      show: false,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false           
  },
  {
    key: 'next_task',
    label: trans('global.labels.next_task'),
    show: true,
    locked: false,
    editable: false,
    sorteable: true,
    filterable: false,
    filter: {
      modelValue: '',
      type: 'input'            
    },
    cellKey: 'lastActivetask.id',
    cellLabel: 'lastActivetask.name'
  },
  {
    key: 'confirmed_at',
    label: trans('deals.labels.response_time'),
    show: false,
    locked: false,
    editable: false,
    sorteable: false,
    filterable: false,          
  }, 
  {
      key: 'created_at',
      label: trans('global.labels.created_at'),
      show: true,
      locked: false,
      editable: false,
      sorteable: true,
      filterable: true,
      filter: {
        modelValue:'',
        type: 'date-select-range',
        options: datesFilter
      }        
  },         
]