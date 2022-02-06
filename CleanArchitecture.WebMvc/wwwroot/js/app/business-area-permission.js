

Vue.use(VueTables.ClientTable);
Vue.use(VueTables.ServerTable);
Vue.use(VTooltip);
Vue.component('v-select', VueSelect.VueSelect);

const { DataManager, Query, WebApiAdaptor } = ejs.data;
const { L10n, setCulture, createElement } = ejs.base;
const { GridPlugin, Page, InfiniteScroll, Sort, Filter, Selection, GridComponent, Toolbar, Search, Edit } = ejs.grids;
const { TextBox } = ejs.inputs;
Vue.use(GridPlugin);



var app = new Vue({
    el: '#vc_app',
    data: {
        baseUrl: '/BusinessAreaPermission',
        scopes: [],
        settingFormValidationErrors: [],
        tree: [],
        permissionsScopeId: '',
        enabledBusinessAreaPermission: false,
        isTreeLoaded: false,
        options: [],
        articleTotalOrders: [],
        costCenterPermissionSettings: [],
        showSettingSaveButton: false,
        saveUpdateSettingBtnText: 'Save',
        selectedUser: null,
        workspaceTreeData: [],
        workspaceTreeFields: {
            dataSource: [], value: 'id', text: 'text', selected: 'selected', child: 'children', htmlAttributes: 'htmlAttributes'
        },
        permissionScope: {
            id: '',
            name: '',
            isDeleted: false
        },
        setting: {
            workSpaceId: '',
            dataSetId: ''
        },
        refreshModel: {
            datasetId: '',
            allowRefresh: false
        },
        model: {
            username: '',
            permissionsScopeId: '',
            costCenterIdIs: [],
            region: ''
        },
        workSpaces: [],
        datasets: [],
        modelTable: {
            data: [],
            columns: ['username', 'userFullName', 'permissionsScopeName', 'permissions', 'actions'],
            options: {
                headings: {
                    username: 'Username',
                    userFullName: 'User Full Name',
                    permissionsScopeName: 'Permissions Scope',
                    permissions: 'Permissions',
                    actions: 'Actions'
                },
                columnsClasses: {
                    actions: 'text-center w-2b align-middle'
                },
                sortable: ['username', 'userFullName', 'permissionsScopeName', 'permissions'],
                filterable: ['username', 'userFullName', 'permissionsScopeName', 'permissions', 'userFullName'],
                sortIcon: {
                    base: 'fal',
                    is: 'fa-sort',
                    up: 'fa-sort-up',
                    down: 'fa-sort-down'
                },
                pagination: {
                    virtual: true
                }
            }
        },
        settingsTable: {
            data: [],
            columns: ['workSpaceName', 'dataSetName', 'actions'],
            options: {
                headings: {
                    workSpaceName: 'Workspace',
                    dataSetName: 'Dateset',
                    actions: 'Actions'
                },
                columnsClasses: {
                    actions: 'text-center w-2b align-middle'
                },
                sortable: ['workSpaceName', 'dataSetName'],
                filterable: ['workSpaceName', 'dataSetName'],
                sortIcon: {
                    base: 'fal',
                    is: 'fa-sort',
                    up: 'fa-sort-up',
                    down: 'fa-sort-down'
                }
            }
        },
        regions: [],
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
                                 <a v-bind:title="showPermissions" href="javascript:;" class="text-info" @click="showPermission(data)">{{showPermissions}}</a>&nbsp;&nbsp;
                                 <a v-bind:title="delet" href="javascript:;" @click="deletePermission(data)"><i class="far fa-trash-alt"></i></a>
                               </div>`,
                    data() {
                        return {
                            data: { data: {} },
                            showPermissions: 'Show Permissions',
                            delet: 'Delete',
                        };
                    },
                    mounted: function () {
                        this.updateDataProperty();
                    },
                    methods: {
                        showPermission(data) {

                            app.openBusinessAreaPermissionModal(data);
                        },
                        deletePermission(data) {
                            app.remove(data);
                        },
                        updateDataProperty() {
                            if (app.currentLanguage === 'sv-SE') {
                                this.showPermissions = 'Visa behörigheter';
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
        //let state = { skip: 0, take: this.pageOptions.pageSize };
        this.state.take = this.pageOptions.pageSize
        this.dataStateChange(this.permissionsScopeId, this.state);

        //this.loadList();

        this.loadScopes();
        this.loadRegions();

        this.tree = $('#organizationTree').tree({
            primaryKey: 'id',
            uiLibrary: 'bootstrap4',
            dataSource: `${this.baseUrl}/GetOrganizationTree?username=` + this.model.username + '&permissionsScopeId=' + this.model.permissionsScopeId,
            checkboxes: true,
            autoLoad: false
        });
        this.tree.on('checkboxChange', function (e, $node, record, state) {
            this.hasUnsavedChanges = true;
        });

  
        $('#tree-toggler').click(function () {
            $('#workspaceTogglerIcon').toggleClass('rotated');
        });

        $('#permissionTree_modal').on('shown.bs.modal', function () {
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
        toolbarClick: function (args) {
            if (args.item.text === 'Click') {
                alert("Custom toolbar click...");
            }
        },
        loadList: function (permissionsScopeId) {
            helper.get(`${this.baseUrl}/GetAll`,
                { permissionsScopeId: permissionsScopeId },
                (response) => {
                    if (response.success) {
                        this.modelTable.data = response.data;
                    }
                });
        },
        dataStateChange: function (permissionsScopeId, state) {
            //debugger;
            var self = this;
            const pageQuery = `skip=${state.skip}&take=${state.take}`;
            let sortQuery = '';
            if ((state.sorted || []).length) {
                sortQuery = `&orderby=` + (state).sorted.map((obj) => {
                    return obj.direction === 'descending' ? `${obj.name} desc` : obj.name;
                }).reverse().join(',');
            }

            var grid = document.getElementById('capabilityGrid').ej2_instances[0]; // Grid instance
            grid.showSpinner();
            var ajax = new ej.base.Ajax({
                url: `${this.baseUrl}/GetAllByPagination?permissionsScopeId=${permissionsScopeId}&${pageQuery}${sortQuery}`,
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
        loadScopes: function () {
            helper.get(`${this.baseUrl}/GetScopes`,
                {},
                (response) => {
                    if (response.success) {
                        this.scopes = response.data;
                    }
                });
        },
        loadRegions: function () {
            helper.get(`${this.baseUrl}/GetRegions`,
                {},
                (response) => {
                    if (response.success) {
                        this.regions = response.data;
                    }
                });
        },
        onRegionChange(event) {
            //debugger;
            this.tree.destroy();

            this.tree = $('#organizationTree').tree({
                primaryKey: 'id',
                uiLibrary: 'bootstrap4',
                dataSource: `${this.baseUrl}/GetOrganizationTree?username=` + this.model.username
                    + '&permissionsScopeId=' + this.model.permissionsScopeId
                    + '&region=' + this.model.region
                ,
                checkboxes: true,
                autoLoad: false
            });



            this.tree.render();
            this.tree.reload();
            var self = this;
            self.isTreeLoaded = false;

            this.tree.on('dataBound', function () {
                $('#permissionTree_modal').modal('show');
                self.isTreeLoaded = true;
                self.findTreeNodeFromTree(self.tree.getAll());
            });
            this.tree.on('checkboxChange', function (e, $node, record, state) {
                console.log(state);
                this.hasUnsavedChanges = true;
            });

        },
        loadWorkspaces: function () {
            helper.get(`${this.baseUrl}/GetAllWorkspaces`,
                {},
                (response) => {
                    if (response.success) {
                        this.workSpaces = response.data;
                    }
                });
        },
        loadDatesets: function (workspaceId) {
            helper.get(`${this.baseUrl}/GetAllDatesets`,
                { groupId: workspaceId },
                (response) => {
                    if (response.success) {
                        this.datasets = response.data;
                    }
                });
        },
        loadBusinessAreaPermissionSettings: function () {
            helper.get(`${this.baseUrl}/GetAllSettings`,
                {},
                (response) => {
                    if (response.success) {
                        this.settingsTable.data = response.data;
                    }
                });
        },

        loadWorkspaceTreeData: function () {
            helper.get(`${this.baseUrl}/GetWorkspaceTree`,
                {},
                (response) => {
                    if (response.success) {
                        this.workspaceTreeData = response.data;
                        this.workspaceTreeFields = {
                            dataSource: response.data, value: 'id', text: 'text', selected: 'selected', child: 'children', htmlAttributes: 'htmlAttributes'
                        };
                    }
                });
        },

        openCreateOrEditPermissionScopeModal: function (id) {
            console.log(id);
            if (id) {
                helper.get(`${this.baseUrl}/GetScope`,
                    { id: id },
                    (response) => {
                        if (response) {
                            this.permissionScope = response.data;
                            $('#permissionScope_modal').modal('show');
                        }
                    });
            } else {
                this.permissionScope.name = '';
                $('#permissionScope_modal').modal('show');
            }
        },
        onWorkspaceNodeExanding: function (args) {
            this.$refs.workspaceTree.collapseAll();
        },
        onWorkspaceTreeDataBound: function () {
            this.showSettingSaveButton = true;
        },

        // tree
        openBusinessAreaPermissionModal: function (row) {

            this.options = [];
            this.model.permissionsScopeId = row ? row.permissionsScopeId : '';
            this.model.username = row ? row.username : null;
            this.enabledBusinessAreaPermission = !!row;

            this.selectedUser = {
                name: '',
                email: this.model.username,
                username: this.model.username
            };

            this.tree.destroy();

            this.tree = $('#organizationTree').tree({
                primaryKey: 'id',
                uiLibrary: 'bootstrap4',
                dataSource: `${this.baseUrl}/GetOrganizationTree?username=` + this.model.username + '&permissionsScopeId=' + this.model.permissionsScopeId,
                checkboxes: true,
                autoLoad: false
            });



            this.tree.render();
            this.tree.reload();

            var self = this;
            self.isTreeLoaded = false;

            this.tree.on('dataBound', function () {
                $('#permissionTree_modal').modal('show');
                self.isTreeLoaded = true;
                self.findTreeNodeFromTree(self.tree.getAll());
            });
            this.tree.on('checkboxChange', function (e, $node, record, state) {
                console.log(state);
                this.hasUnsavedChanges = true;
            });

        },
        
        expandAll: function () {
            this.tree.expandAll();
        },
        collapseAll: function () {
            this.tree.collapseAll();
        },
        expandChecked: function () {
            this.findTreeNodeFromTree(this.tree.getAll());
        },
        //checkAll: function () {
        //    this.tree.checkAll();
        //},
        //uncheckAll: function () {
        //    this.tree.uncheckAll();
        //},

        openSettingsModal: function () {
            $('#settings_modal').modal('show');
            this.settingFormValidationErrors = [];
            this.clearSettingForm();
            //this.loadWorkspaceTreeData();
            this.loadWorkspaces();
            this.loadBusinessAreaPermissionSettings();
        },

        clearSettingForm: function () {
            this.setting = {
                workSpaceId: '',
                dataSetId: ''
            }
            this.saveUpdateSettingBtnText = 'Save';
            this.settingFormValidationErrors = [];
        },

        itemClick(node) {
            console.log(node.model.text + ' clicked !');
        },

        searchUsers(search, loading) {
            if (search.length < 3) return;
            loading(true);
            this.doSearch(loading, search, this);
        },
        doSearch: _.debounce((loading, search, vm) => {
            if (!search) {
                loading(false);
                return;
            }
            fetch(
                `/User/GetUsers?searchString=${search}`
            ).then(res => {
                res.json().then(json => (vm.options = json.data));
                loading(false);
            });
        },
            350),

        onUserSelected: function (item) {
            this.model.username = item ? item.email : '';
            this.model.userFullName = item ? item.name : '';
            //this.openBusinessAreaPermissionModal({ user: this.model.username, permissionsScopeId: this.model.permissionsScopeId});
        },


        save: function () {
            //this.findTreeNodeFromTree(this.tree);
            this.model.organizationSks = this.tree.getCheckedNodes().filter(x => x != null);

            if (this.model.organizationSks.length === 0) {
                $.notify('Please select at least one business area', 'error');
                return;
            }

            helper.post(`${this.baseUrl}/Save`,
                this.model,
                (response) => {
                    if (response.success) {
                        //this.loadList();
                        this.dataStateChange(this.permissionsScopeId, this.state);
                        $('#permissionTree_modal').modal('hide');
                    } else {
                        $.notify(response.message, 'error');
                    }
                });
        },
        cancelBusinessAreaPermission: function () {
            //debugger;
            if (this.hasUnsavedChanges) {
                let msg = 'Do you want to save the changes?';
                if (this.currentLanguage === 'sv-SE') {
                    msg = 'Vill du spara ändringarna?';
                }
                helper.confirmationCustom(
                    msg,
                    () => {
                        self.hasUnsavedChanges = false;
                        $('#permissionTree_modal').modal('hide');
                    },
                    () => {
                    },
                    () => {
                        this.save();
                    }, this.currentLanguage
                );
            } else {
                this.hasUnsavedChanges = false;
                $('#permissionTree_modal').modal('hide');
            }
        },
        duplicatePermission: function (id) {
            helper.confirmation("Are you sure you want to duplicate this permission scope?", () => {
                helper.post(`${this.baseUrl}/DuplicatePermission`,
                    { id: id },
                    (response) => {
                        if (response.success) {
                            this.loadScopes();
                            this.permissionsScopeId = response.data.id;
                            //this.loadList(response.data.id);
                            this.dataStateChange(response.data.id, this.state)
                        } else {
                            $.notify(response.message, 'error');
                        }
                    });
            });
        },

        remove: function (row) {
            if (!helper.isNullOrEmpty(row)) {
                helper.confirmation('Are you sure you want to delete user scope cost cost center permissions?',
                    () => {
                        helper.post(`${this.baseUrl}/Remove`,
                            { username: row.username, permissionsScopeId: row.permissionsScopeId },
                            (response) => {
                                if (response.success) {
                                    //this.loadList();
                                    this.dataStateChange(this.permissionsScopeId, this.state);
                                } else {
                                    $.notify(response.message, 'error');
                                }
                            });
                    });
            } else {
                $.notify('Please select an item', 'error');
            }
        },

        findTreeNodeFromTree(treeRoots) {

            //this.model.costCenterIds = [];

            treeRoots.forEach(v => {
                //if (v.isLeaf && v.selected) {
                //    this.model.costCenterIds.push(v.id);
                //}
                if (v.opened) {
                    var node = this.tree.getNodeByText(v.text);
                    this.tree.expand(node);
                }
                if (v.childCount > 0)
                    this.findTreeNodeFromChildTree(v.children);

            });
        },

        findTreeNodeFromChildTree(array) {
            array.forEach(v => {

                //if (v.isLeaf && v.selected) {
                //    this.model.costCenterIds.push(v.id);
                //}
                if (v.opened) {
                    var node = this.tree.getNodeByText(v.text);
                    this.tree.expand(node);
                }

                if (v.childCount > 0)
                    this.findTreeNodeFromChildTree(v.children);
            });
        },


        savePermissionScope: function () {
            helper.post(`${this.baseUrl}/SavePermissionScope`,
                this.permissionScope,
                (response) => {
                    if (response.success) {
                        $('#permissionScope_modal').modal('hide');
                        this.loadScopes();
                    } else {
                        $.notify(response.message, 'error');
                    }
                });
        },
        cancelPermissionScope: function () {
            if (this.hasUnsavedChanges) {
                let msg = 'Do you want to save the changes?';
                if (this.currentLanguage === 'sv-SE') {
                    msg = 'Vill du spara ändringarna?';
                }
                helper.confirmationCustom(
                    msg,
                    () => {
                        this.hasUnsavedChanges = false;
                        $('#permissionScope_modal').modal('hide');
                    },
                    () => {
                    },
                    () => {
                        this.SaveUserRole();
                    }, this.currentLanguage
                );
            } else {
                this.hasUnsavedChanges = false;
                $('#permissionScope_modal').modal('hide');
            }
        },
        deletePermissionScope: function (id) {
            if (!helper.isNullOrEmpty(id)) {
                helper.confirmation(
                    'Are you sure you want to delete permission scope? FYI, all cost center permissions regarding this scope will be deleted permanently.',
                    () => {
                        helper.post(`${this.baseUrl}/RemovePermissionScope`,
                            { id: id },
                            (response) => {
                                if (response.success) {
                                    this.permissionsScopeId = '';
                                    this.model.permissionsScopeId = '';
                                    this.loadScopes();
                                    //this.loadList();
                                    this.dataStateChange(this.permissionsScopeId, this.state);
                                } else {
                                    $.notify(response.message, 'error');
                                }
                            });
                    });
            } else {
                $.notify('Please select an item', 'error');
            }
        },
        saveUpdateSetting: function () {
            this.settingFormValidationErrors = [];

            if (!this.setting.workSpaceId) {
                this.settingFormValidationErrors.push("Work space id is required.");
            }
            if (!this.setting.dataSetId) {
                this.settingFormValidationErrors.push('Data set id is required.');
            }

            if (this.settingFormValidationErrors.length) {
                return false;
            }
            helper.post(`${this.baseUrl}/SaveOrUpdateSetting`,
                this.setting,
                (response) => {
                    if (helper.isSuccess(response)) {
                        this.loadBusinessAreaPermissionSettings();
                        this.clearSettingForm();
                    }
                });
        },

        editSetting: function (row) {
            this.loadDatesets(row.workSpaceId);
            this.setting = row ?? {
                workSpaceId: '',
                dataSetId: ''
            }
            this.saveUpdateSettingBtnText = 'Update';
        },

        removeSetting: function (row) {
            this.clearSettingForm();
            if (!helper.isNullOrEmpty(row)) {
                helper.confirmation('Are you sure you want to delete this setting?',
                    () => {
                        helper.post(`${this.baseUrl}/RemoveSetting`,
                            { id: row.id },
                            (response) => {
                                if (response.success) {
                                    this.loadBusinessAreaPermissionSettings();
                                } else {
                                    $.notify(response.message, 'error');
                                }
                            });
                    });
            } else {
                $.notify('Please select an item', 'error');
            }
        },

        refresh: function () {

            helper.confirmation('Do you really want to refresh datasets', () => {
                helper.post(`${this.baseUrl}/Refresh`,
                    this.model,
                    (response) => {
                        if (response.success) {
                            let status = response.data;

                            let alerts = '';
                            let hasError = false;

                            status.forEach((s) => {
                                let error = s.text !== 'Success';
                                if (error) hasError = true;

                                alerts += `<div class="alert ${error ? 'alert-danger' : 'alert-success'} text-left" role="alert">
    Refreshing dataset ${s.value} ${error ? 'has failed.' : 'is successful.'}</div>`
                            });

                            Swal.fire({
                                title: `${hasError ? 'Error' : 'Success'}`,
                                icon: `${hasError ? 'error' : 'success'}`,
                                html: alerts,
                                confirmButtonText: 'Ok',
                                width: '50rem'
                            })

                        } else {
                            $.notify(response.message, 'error');
                        }
                    }, true, false, false);
            });


        },
        exportToExcel() {
            this.model.organizationSks = this.tree.getCheckedNodes().filter(x => x != null);

            if (this.model.organizationSks.length === 0) {
                $.notify('Please select at least one business area', 'error');
                return;
            }
            helper.blockUI();
            $.ajax({
                url: `${this.baseUrl}/ExportToExcel`,
                type: 'POST',
                data: this.model,
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (data) {
                    helper.unBlockUI();

                    var blob = new Blob([data], { type: "application/octetstream" });

                    const currentDate = moment().format('L');
                    var fileName = `User_Permissions_Scope_${currentDate}`;

                    var isIE = false || !!document.documentMode;
                    if (isIE) {
                        window.navigator.msSaveBlob(blob, fileName);
                    } else {
                        var url = window.URL || window.webkitURL;
                        link = url.createObjectURL(blob);
                        var a = $("<a />");
                        a.attr("download", fileName);
                        a.attr("href", link);
                        $("body").append(a);
                        a[0].click();
                        $("body").remove(a);
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    helper.unBlockUI();
                }
            })




            //window.open(`${this.baseUrl}/ExportToExcel?` + $.param(this.model));
        },

        closeCreateUpdateModal() {
            if (this.hasUnsavedChanges) {
                let msg = 'Do you want to save the changes?';
                if (this.currentLanguage === 'sv-SE') {
                    msg = 'Vill du spara ändringarna?';
                }
                helper.confirmationCustom(
                    msg,
                    () => {
                        this.hasUnsavedChanges = false;
                        $('#createOrEdit_modal').modal('hide');
                    },
                    () => {
                    },
                    () => {
                        this.save();
                    }, this.currentLanguage
                );
            } else {
                this.hasUnsavedChanges = false;
                $('#createOrEdit_modal').modal('hide');
            }
        },
        preventNav: function (event) {
            if (!this.hasUnsavedChanges) return
            event.preventDefault()
            event.returnValue = ""
        }
    }
});