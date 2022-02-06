
const { AutoCompletePlugin } = ejs.dropdowns;
const { Query, DataManager, UrlAdaptor } = ejs.data;
Vue.use(AutoCompletePlugin);
Vue.use(VTooltip);
Vue.use(VeeValidate, { fieldsBagName: 'validationFields' })
Vue.use(VueTables.ClientTable);

//const { DataManager, Query, WebApiAdaptor } = ejs.data;

const { L10n, setCulture, createElement } = ejs.base;
const { GridPlugin, Page, InfiniteScroll, Sort, Filter, Selection, GridComponent, Toolbar, Search, Edit } = ejs.grids;
const { TextBox } = ejs.inputs;
Vue.use(GridPlugin);


const { DateRangePickerPlugin } = ejs.calendars;
const { MultiSelectPlugin, MultiSelect, TaggingEventArgs, DropDownListPlugin, CheckBoxSelection } = ejs.dropdowns;


Vue.use(DropDownListPlugin);
Vue.use(DateRangePickerPlugin);
MultiSelect.Inject(CheckBoxSelection);
Vue.use(MultiSelectPlugin);
Vue.use(VeeValidate, { fieldsBagName: 'vueValidateFields' });
Vue.use(VueTables.ClientTable);


var remoteData = new DataManager({
    url: '/userroles/SearchUserList',
    adaptor: new UrlAdaptor,
    crossDomain: true
});

var app = new Vue({
    el: '#vc_app',
    data: {
        baseUrl: '/RoleWisePagePermission',
        tempcolumns: ['username', 'name', 'email', 'roleName', 'actions'],
        options: {
            headings: {
                username: 'User Name',
                name: 'Full Name',
                email: 'Email',
                roleName: 'Role',
                actions: 'Actions'
            },
            columnsClasses: {
                actions: 'text-center w-2b',
            },
            sortable: ['username', 'name', 'email', 'roleName'],
            filterable: ['username', 'name', 'email', 'roleName']
        },

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
                                 <a v-bind:title="edit" href="javascript:;" class="text-info" @click="editRoleWisePagePermission(data)"><i class="far fa-edit"></i></a>&nbsp;&nbsp;
                               </div>`,
                    data() {
                        return {
                            data: {
                                data: {
                                }
                            },
                            edit: 'Edit',
                            delet: 'Delete',
                        };
                    },
                    mounted: function () {
                        this.updateDataProperty();
                    },
                    methods: {
                        editRoleWisePagePermission(data) {
                            app.showModalManageRoleWisePage(data);
                        },
                        deleteRole(data) {
                            app.Remove(data.username);
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

        selectedPage: {
            roleIds: []
        },

        fields: { value: 'id' , text: 'name'},
        showSelectAll: true,
        selectAll: this.currentLanguage === 'sv-SE' ? 'Välj alla' : 'Select All',
        unselectAll: this.currentLanguage === 'sv-SE' ? 'Avmarkera alla' : 'Unselect All',
        selectRoles: this.currentLanguage === 'sv-SE' ? 'Välj Roller' : 'Select Roles',
        availableRoles: null,
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

        //this.getCurrentLanguage();

        this.state.take = this.pageOptions.pageSize
        this.dataStateChange(this.state);


        $('#mdl_role_mapping').on('shown.bs.modal', function () {
            $(document).off('focusin.modal');
        });

    },
    methods: {
        tagging: function (e) {
            var msObject = document.getElementById("role-multiselect").ej2_instances[0];
            e.setClass(e.itemData[msObject.fields.text].toLowerCase());
        },
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
            var self = this;
            const pageQuery = `skip=${state.skip}&take=${state.take}`;
            let sortQuery = '';
            if ((state.sorted || []).length) {
                sortQuery = `&orderby=` + (state).sorted.map((obj) => {
                    return obj.direction === 'descending' ? `${obj.name} desc` : obj.name;
                }).reverse().join(',');
            }

            var grid = document.getElementById('roleWisePagePermissionGrid').ej2_instances[0]; // Grid instance
            grid.showSpinner();
            var ajax = new ej.base.Ajax({
                url: `${this.baseUrl}/GetRoleWisePages?${pageQuery}${sortQuery}`,
                data: JSON.stringify({
                }),
                type: 'GET'
            });

            return ajax.send().then((data) => {
                var responseModel = ej.data.DataUtil.parse.parseJson(data);
                if (responseModel.success) {
                    var response = responseModel.data;
     
                    self.availableRoles = response.availableRoles;
                    self.currentLanguage = response.currentLanguage;
                    self.data = {
                        result: response.result,
                        count: response.count
                    };

                } else {
                    $.notify('@UserClaim.CurrentLanguage' == 'sv-SE' ? 'Det gick inte att uppdatera data' : 'Failed to refresh data', 'error');
                    grid.hideSpinner();
                }
            }, (error) => {
                grid.hideSpinner();
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
                //console.log(args);
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


        showModalManageRoleWisePage: function (page) {
           
            if (!helper.isNullOrEmpty(page.pageName)) {
                this.selectedPage = page;
                this.selectAll = this.currentLanguage === 'sv-SE' ? 'Välj alla' : 'Select All',
                this.unselectAll = this.currentLanguage === 'sv-SE' ? 'Avmarkera alla' : 'Unselect All',
                this.selectRoles = this.currentLanguage === 'sv-SE' ? 'Välj Roller' : 'Select Roles',
                $('#mdl_role_mapping').modal('show');
            }
            else {
                $('#mdl_role_mapping').modal('show');
            }
        },
        AddUpdateRoleWisePagePermission() {

            if (this.selectedPage.roleIds.length === 0) {
                let noty = this.currentLanguage === 'sv-SE' ? 'Välj minst en roll' : 'Please select at least one role'
                $.notify(noty, 'error');
                return;
            }
            let msg = this.currentLanguage === 'sv-SE' ? 'Är du säker, vill du spara?' : 'Are you sure, you want to save?';
            helper.confirmation(msg,
                (response) => {
                    this.AddUpdateRoleWisePagePermissionConfirmed();
                });
        },
        AddUpdateRoleWisePagePermissionConfirmed() {
            let data = {
                pageId: this.selectedPage.id,
                roleIds: this.selectedPage.roleIds
            }
            helper.post(`${this.baseUrl}/save`, data, (response) => {
                if (helper.isSuccess(response)) {
                    $('#mdl_role_mapping').modal('hide');
                    this.dataStateChange(this.state);
                }
                else {
                    $.notify(response.message, 'error');
                    //this.dataStateChange(state);
                }
            });
        },
        closeModalManageRoleWisePage: function () {
            if (this.hasUnsavedChanges) {
                let msg = 'Do you want to save the changes?';
                if (this.currentLanguage === 'sv-SE') {
                    msg = 'Vill du spara ändringarna?';
                }
                helper.confirmationCustom(
                    msg,
                    () => {
                        this.hasUnsavedChanges = false;
                        $('#mdl_role_mapping').modal('hide');
                    },
                    () => {
                    },
                    () => {
                        this.AddUpdateRoleWisePagePermission();
                    },
                    this.currentLanguage
                );
            } else {
                this.hasUnsavedChanges = false;
                $('#mdl_role_mapping').modal('hide');
            }
        },




        SaveUserRole: function () {
            if (helper.isNullOrEmpty(this.user.username) ||
                helper.isNullOrEmpty(this.user.roleId) ||
                helper.isNullOrEmpty(this.user.email)) {
                $.notify("One or more required fields are empty", 'error');
                return;
            }
            helper.post('/userroles/save', this.user, (response) => {
                if (helper.isSuccess(response)) {
                    //this._LoadUserRoleList();
                    this.dataStateChange(this.state);
                    this.enabledEditUser = false;
                    $('#mdl_role_mapping').modal('hide');
                }
                else {
                    $.notify(response.message, 'error');
                }
            });
        },
        CancelRoleMapping: function () {
            if (this.hasUnsavedChanges) {
                let msg = 'Do you want to save the changes?';
                if (this.currentLanguage === 'sv-SE') {
                    msg = 'Vill du spara ändringarna?';
                }
                helper.confirmationCustom(
                    msg,
                    () => {
                        this.hasUnsavedChanges = false;
                        $('#mdl_role_mapping').modal('hide');
                    },
                    () => {
                    },
                    () => {
                        this.SaveUserRole();
                    },
                    this.currentLanguage
                );
            } else {
                this.hasUnsavedChanges = false;
                $('#mdl_role_mapping').modal('hide');
            }
        },

        Remove: function (username) {
            helper.confirmation('Are you sure?', () => {
                if (!helper.isNullOrEmpty(username)) {
                    helper.post('/userroles/Remove', { username: username }, (response) => {
                        if (helper.isSuccess(response)) {
                            //this._LoadUserRoleList();
                            this.dataStateChange(this.state);
                        }
                    });
                } else {
                    $.notify("Please select an item", 'error');
                }
            });
        },


        SaveRole: function () {
            let errormsg = 'Please enter name';
            if (!helper.isNullOrEmpty(this.role.name)) {
                helper.post('/userroles/saverole', this.role, (response) => {
                    if (helper.isSuccess(response)) {
                        this._GetAvailableRoles();
                        this.openRoleModal();
                        this.user.roleId = response.data.id;
                        $('#mdl_role').modal('hide');
                    }
                });
            } else {
                $.notify(errormsg, 'error');
            }
        },
        CancelAddEditRole: function () {
            if (this.hasUnsavedChanges) {
                let msg = 'Do you want to save the changes?';
                if (this.currentLanguage === 'sv-SE') {
                    msg = 'Vill du spara ändringarna?';
                }
                helper.confirmationCustom(
                    msg,
                    () => {
                        this.hasUnsavedChanges = false;
                        $('#mdl_role').modal('hide');
                    },
                    () => {
                    },
                    () => {
                        this.SaveRole();
                    }, this.currentLanguage
                );
            } else {
                this.hasUnsavedChanges = false;
                $('#mdl_role').modal('hide');
            }
        },

        AddOrEdit: function (roleId) {
            if (!helper.isNullOrEmpty(roleId)) {
                helper.get('/UserRoles/GetRole', { roleId: roleId }, (response) => {
                    this.role = response;
                    $('#mdl_role').modal('show');

                });
            }
            else {
                this.role = {
                    id: '',
                    name: ''
                };
                $('#mdl_role').modal('show');
            }
        },
        RemoveRole: function (roleId) {
            helper.confirmation('Are you sure?', () => {
                if (!helper.isNullOrEmpty(roleId)) {
                    helper.post('/userroles/RemoveRole', { roleId: roleId }, (response) => {
                        if (helper.isSuccess(response)) {
                            this._GetAvailableRoles();
                            this.openRoleModal();
                            this.user.roleId = "";
                            //let index = this.roleSli.findIndex(function (v, i) {
                            //    return v.id == roleId;
                            //});
                            //if (index >= 0) {
                            //    this.roleSli.splice(index, 1);
                            //}
                        } else {
                            $.notify("Can not delete this role because this role is associated with other users", 'error');
                        }
                    });
                } else {
                    $.notify("Please select an item", 'error');
                }
            });
        },

        openRoleModal: function () {
            helper.get('/userroles/GetRoles', {}, (response) => {
                if (helper.isSuccess(response)) {
                    this.roleTable.data = response.data;
                    $('#modal_role').modal('show');
                } else {
                    $.notify("Failed to load roles!", 'error');
                }
            });

        },

        closeRoleModal: function () {
            $('#modal_role').modal('hide');
        },

        preventNav: function (event) {
            if (!this.hasUnsavedChanges) return
            event.preventDefault()
            event.returnValue = ""
        }
    }

});
