
const { AutoCompletePlugin } = ejs.dropdowns;
const { Query, DataManager, UrlAdaptor } = ejs.data;

Vue.use(AutoCompletePlugin);
Vue.use(VTooltip);
Vue.use(VeeValidate, { fieldsBagName: 'validationFields' })
Vue.use(VueTables.ClientTable);

// const { DataManager, Query, WebApiAdaptor } = ejs.data;
const { L10n, setCulture, createElement } = ejs.base;
const { GridPlugin, Page, InfiniteScroll, Sort, Filter, Selection, GridComponent, Toolbar, Search, Edit } = ejs.grids;
const { TextBox } = ejs.inputs;
Vue.use(GridPlugin);

var app = new Vue({
    el: '#vc_app',
    data: {
        baseUrl: '/Regions',
        rigionList: [],
        tempcolumns: ['regionCode','regionName', 'actions'],
        options: {
            headings: {
                regionCode: 'Region Code',
                regionName: 'Region Name',
                actions: 'Actions'
            },
            columnsClasses: {
                actions: 'text-center w-2b',
            },
            sortable: ['id', 'regionName', 'regionCode'],
            filterable: ['id', 'regionName', 'regionCode']
        },

        region: {},
        hasUnsavedChanges: false,

        data: {},
        pageOptions: { pageSize: 500 },
        editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, showDeleteConfirmDialog: true },
        toolbar: ['Search'],
        rules: { required: true },
        customTemplate: function () {
            return {
                template: Vue.component('custom-element', {
                    template: `<div>
                                 <a v-bind:title="edit" href="javascript:;" class="text-info" @click="editRegion(data)"><i class="far fa-edit"></i></a>&nbsp;&nbsp;
                                 <a v-bind:title="delet" href="javascript:;" @click="deleteRegion(data)"><i class="fas fa-trash"></i></a>
                               </div>`,
                    data() {
                        return {
                            data: { data: {} },
                            edit: 'Edit',
                            delet: 'Delete',
                        };
                    },
                    mounted: function () {
                        this.updateDataProperty();
                    },
                    methods: {
                        editRegion(data) {
                            app.AddOrEditRegion(data.id);
                        },
                        deleteRegion(data) {
                            app.RemoveRegion(data.id);
                        },
                        updateDataProperty() {
                            if (app.currentLanguage === 'sv-SE') {
                                this.edit = 'Redigera';
                                this.delet = 'Radera';
                            }
                        }
                    }
                })
            }
        },
        state: {
            skip: 0,
            take: 0
        },

        currentLanguage: null,

    },
    provide: {
        grid: [Page, Toolbar, InfiniteScroll, Edit, Search]
    },
    beforeMount() {
        window.addEventListener("beforeunload", this.preventNav)
    },
    beforeDestroy() {
        window.removeEventListener("beforeunload", this.preventNav);
    },
    mounted: function () {
        this.getCurrentLanguage();
        //this.LoadRegionList();
        this.state.take = this.pageOptions.pageSize
        this.dataStateChange(this.state);

        $('#mdl_region_mapping').on('shown.bs.modal', function () {
            $(document).off('focusin.modal');
        });
    },
    methods: {
        getCurrentLanguage: function () {
            let self = this;
            helper.get(`Culture/GetCurrentLanguage`, {}, (response) => {
                if (response.success) {
                    self.currentLanguage = response.data;
                } else {
                    self.currentLanguage = response.data;
                }
            });
        },
        dataStateChange: function (state) {
            //debugger;
            var self = this;
            const pageQuery = `skip=${state.skip}&take=${state.take}`;
            let sortQuery = '';
            if ((state.sorted || []).length) {
                sortQuery = `&orderby=` + (state).sorted.map((obj) => {
                    return obj.direction === 'descending' ? `${obj.name} desc` : obj.name;
                }).reverse().join(',');
            }

            var grid = document.getElementById('regionsGrid').ej2_instances[0]; // Grid instance
            grid.showSpinner();
            var ajax = new ej.base.Ajax({
                url: `${this.baseUrl}/GetAll?${pageQuery}${sortQuery}`,
                data: JSON.stringify({
                }),
                type: 'GET'
            });

            return ajax.send().then((data) => {
                var responseModel = ej.data.DataUtil.parse.parseJson(data);
                if (responseModel.success) {
                    var response = responseModel.data;
                    self.data = {
                        result: response.result,
                        count: response.count
                    };
                } else {
                    $.notify('@UserClaim.CurrentLanguage' == 'sv-SE' ? 'Det gick inte att uppdatera data' : 'Failed to refresh data', 'error');
                    //grid.hideSpinner();
                }
            }, (error) => {
                //grid.hideSpinner();
                $.notify('@UserClaim.CurrentLanguage' == 'sv-SE' ? 'Det gick inte att uppdatera data' : 'Failed to refresh data', 'error');
            });

            grid.hideSpinner();
        },
        dataSourceChanged: function (state) {
            if (state.action === 'add') {
                this.save(state);
            } else if (state.action === 'edit') {
                this.save(state);
            } else if (state.requestType === 'delete') {
                this.remove(state);
            }
        },
        actionBegin(args) {
            if (args.requestType === 'beginEdit') {
                //if (args.rowData.yellow == "France") {
                //    args.cancel = true;
                //}
                console.log(args);
            }
        },
        actionComplete(args) {
            if (args.action === 'add') {
                const newState = { skip: 0, take: this.pageOptions.pageSize };
                this.dataStateChange(newState);
            } else if (args.requestType === 'delete') {
                const newState = { skip: 0, take: this.pageOptions.pageSize };
                this.dataStateChange(newState);
            }
        },
        clearRegion() {
            this.region = {
                id: '',
                regionNmae: ''
            };
        },

        LoadRegionList: function () {
            helper.get('/regions/getall', null, (response) => {

                this.rigionList = response;
            });
        },

        SaveRegion: function () {
            let errormsg = 'Please enter name';
            if (!helper.isNullOrEmpty(this.region.regionName)) {
                helper.post('/regions/SaveRegion', this.region, (response) => {
                    if (helper.isSuccess(response)) {
                        //this.LoadRegionList();
                        this.dataStateChange(this.state);
                        $('#mdl_region').modal('hide');
                    }
                });
            } else {
                $.notify(errormsg, 'error');
            }
        },
        CancelAddEditRegion: function () {
            if (this.hasUnsavedChanges) {
                let msg = 'Do you want to save the changes?';
                if (this.currentLanguage === 'sv-SE') {
                    msg = 'Vill du spara ändringarna?';
                }
                helper.confirmationCustom(
                    msg,
                    () => {
                        this.hasUnsavedChanges = false;
                        $('#mdl_region').modal('hide');
                    },
                    () => {
                    },
                    () => {
                        this.SaveRegion();
                    }, this.currentLanguage
                );
            } else {
                this.hasUnsavedChanges = false;
                $('#mdl_region').modal('hide');
            }
        },

        AddOrEditRegion: function (regionid) {
            debugger;
            if (!helper.isNullOrEmpty(regionid)) {
                helper.get('/regions/GetRegion', { regionid: regionid }, (response) => {
                    this.region = response;
                    $('#mdl_region').modal('show');
                });
            }
            else {
                this.region = {
                    id: '',
                    regionName: ''
                };
                $('#mdl_region').modal('show');
            }
        },
        RemoveRegion: function (id) {
            helper.confirmation('Are you sure?', () => {
                if (!helper.isNullOrEmpty(id)) {
                    helper.post('/regions/RemoveRegion', { regionId: id }, (response) => {
                        if (helper.isSuccess(response)) {
                            //this.LoadRegionList();
                            this.dataStateChange(this.state);
                        } else {
                            $.notify("Can not delete this role because this role is associated with other users", 'error');
                        }
                    });
                } else {
                    $.notify("Please select an item", 'error');
                }
            });
        },



        preventNav: function (event) {
            if (!this.hasUnsavedChanges) return
            event.preventDefault()
            event.returnValue = ""
        }
    }

});
