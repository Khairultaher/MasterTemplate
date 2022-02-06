String.prototype.toNumber = function () {
    if (typeof this === undefined || this === null) {
        return 0;
    }
    var _val = parseFloat(this);
    return isNaN(_val) ? 0 : _val;
};


String.prototype.toInt = function () {
    if (typeof this === undefined || this === null) {
        return 0;
    }
    var _val = parseInt(this);
    return isNaN(_val) ? 0 : _val;
};


var helper = function () {

    var orderColumn = {
        agressoOrderNumber: 'agressoOrderNumber',
        applySLA: 'applySLA',
        article: 'article',
        articleId: 'articleId',
        articleSLA: 'articleSLA',
        category: 'category',
        comments: 'comments',
        customeOrderNumber: 'customeOrderNumber',
        customer: 'customer',
        customerAddress: 'customerAddress',
        customerGroupId: 'customerGroupId',
        customerGroupName: 'customerGroupName',
        customerId: 'customerId',
        customerName: 'customerName',
        customerReference: 'customerReference',
        customerZip: 'customerZip',
        day: 'day',
        deliveryAddress_1: 'deliveryAddress_1',
        deliveryAddress_2: 'deliveryAddress_2',
        deliveryCity: 'deliveryCity',
        deliveryDate: 'deliveryDate',
        deliveryDateString: 'deliveryDateString',
        deliveryDaysNeeded: 'deliveryDaysNeeded',
        deliveryId: 'deliveryId',
        deliveryTo: 'deliveryTo',
        deliveryZip: 'deliveryZip',
        exportOff: 'exportOff',
        goodsMarking: 'goodsMarking',
        invoiceDate: 'invoiceDate',
        invoiceDateString: 'invoiceDateString',
        invoiceNumber: 'invoiceNumber',
        lastOrderTimeForTheDay: 'lastOrderTimeForTheDay',
        manufacturer: 'manufacturer',
        manufacturerComments: 'manufacturerComments',
        manufacturerId: 'manufacturerId',
        month: 'month',
        orderComments: 'orderComments',
        orderDate: 'orderDate',
        orderDate0: 'orderDate0',
        orderDateString: 'orderDateString',
        orderHistories: 'orderHistories',
        orderNumber: 'orderNumber',
        packageIds: 'packageIds',
        penaltyPercentageApplied: 'penaltyPercentageApplied',
        price: 'price',
        priceString: 'priceString',
        quantity: 'quantity',
        serialNumber: 'serialNumber',
        shippingDate: 'shippingDate',
        shippingDateString: 'shippingDateString',
        showSaveButton: 'showSaveButton',
        slaFailed: 'slaFailed',
        slaRevision: 'slaRevision',
        status: 'status',
        subCategory: 'subCategory',
        totalPriceString: 'totalPriceString',
        vssla: 'vssla',
        year: 'year',
        handled: 'handled',
        sellerId: 'sellerId',
        sellerName: 'sellerName',
        penaltyAmountString:'penaltyAmountString',
        lastUpdatedString: 'lastUpdatedString',
        claimedAmount: 'claimedAmount',
        claimRebateId: 'claimRebateId'
    };
    var menufacturerRptColumn = {
        deliveryId: 'deliveryId',
        orderNumber: 'orderNumber',
        orderDate: 'orderDate',
        orderDate0: 'orderDate0',
        orderDateString: 'orderDateString',
    };

    var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    var dateFormat = 'yyyy-mm-dd';
    var PhoneNoRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    var EmailAddressRegex = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;

    var post = function (url, data, callback, async = true, modalHandling = false, showMessage = true, alertBox = false, showLoader = true) {
        _post('POST', url, data, callback, async, modalHandling, showMessage, alertBox, showLoader);
    };


    var get = function (url, data, callback, async = true, modalHandling = false, showMessage = false, alertBox = false, showLoader = true) {
        _post('GET', url, data, callback, async, modalHandling, showMessage, alertBox, showLoader);
    };


    var postFormData = function (url, formData, callback, modalAndMessageHandling, alertBox) {

        if (typeof modalAndMessageHandling === "undefined" || modalAndMessageHandling === null) {
            modalAndMessageHandling = true;
        }
        if (typeof alertBox === "undefined" || alertBox === null) {
            alertBox = false;
        }


        blockUI();
        $.ajax({
            type: 'post',
            url: url,
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                unBlockUI();
                if (modalAndMessageHandling) {
                    if (!alertBox) {
                        showMessage(response);
                    }
                    if (isSuccess(response)) {
                        hideModal();

                        if (alertBox) {
                            showAlert(response.MessageString, true);
                        }

                        callback(response);
                    }
                    else {
                        if (alertBox) {
                            showAlert(response.MessageString, false);
                        }
                    }
                }
                else {
                    callback(response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unBlockUI();
                _handleError(jqXHR, textStatus, errorThrown);
            }
        });
    };

    var isNullOrEmpty = function (str) {
        if (typeof str === 'undefined')
            return true;

        if (str === null)
            return true;

        var string = str.toString();
        if (!string)
            return true;
        return string === null || string.match(/^ *$/) !== null;
    };

    var showModal = function (modalTitle, urlToLoad, data, modalSize, callback) {
        modalSize = modalSize || 'md';
        data = data || null;
        if (data !== null) {
            urlToLoad = urlToLoad + '?' + $.param(data);
        }

        var d = new Date();
        var modalId = 'PUPModal-' + d.getTime();
        var html = '<div id="' + modalId + '" class="modal fade" aria-hidden="true" data-backdrop="static" data-keyboard="false">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" onclick="helper.hideModal()" class="close modal-close-button"></button>' +
            '<h4 class="modal-title"></h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('body').append(html);

        var title = $('#' + modalId + ' .modal-title');
        var body = $('#' + modalId + ' .modal-body');

        title.text(modalTitle);
        body.load(urlToLoad, function (responseText, textStatus, jqXHR) {
            if (jqXHR.status === 200) {

                $('#' + modalId + ' .modal-dialog').addClass(modalSize);
                $('#' + modalId + '.modal').modal('show');
                if (callback) {
                    callback();
                    uiInit();
                }
            }
            else {
                _handleError(jqXHR, textStatus, responseText);
            }
        });
    };

    var showContentOnModal = function (modalTitle, content, modalSize, callback) {
        modalSize = modalSize || 'md';
        var d = new Date();
        var modalId = 'PUPModal-' + d.getTime();
        var html = '<div id="' + modalId + '" class="modal fade" aria-hidden="true" data-backdrop="static" data-keyboard="false">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" onclick="helper.hideModal()" class="close modal-close-button"></button>' +
            '<h4 class="modal-title"></h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        $('body').append(html);

        $('#' + modalId + ' .modal-title').text(modalTitle);
        $('#' + modalId + ' .modal-body').append(content);

        $('#' + modalId + ' .modal-dialog').addClass(modalSize);
        $('#' + modalId + '.modal').modal('show');

    };

    var hideModal = function () {
        var idVal = 0;
        var id = $('body div.modal:last').attr('id');
        $(".modal[id^='PUPModal-']").each(function () {
            var modalId = $(this).attr('id');
            modalId = modalId.substring(9);
            if (parseInt(modalId) > idVal) {
                idVal = parseInt(modalId);
            }
        });
        var ctrl = '#PUPModal-' + idVal;
        $(ctrl).nextAll('.modal-backdrop:last').remove();
        $(ctrl).remove();
    };

    var load = function (control, url, data, callback) {
        if (data !== null) {
            url = url + '?' + $.param(data);
        }
        $(control).load(url, function (responseText, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                //loadImage();
                if (callback) {
                    uiInit();
                    callback();
                }
            }
            else {
                _handleError(jqXHR, textStatus, responseText);
            }
        });
    };
    var confirmation = function (confrimMessage, callbackFunction) {
        bootbox.confirm({
            message: confrimMessage,
            buttons: {
                confirm: {
                    label: ' YES ',
                    className: 'btn-success btn-sm'
                },
                cancel: {
                    label: ' NO ',
                    className: 'btn-danger btn-sm'
                }
            },
            callback: function (result) {
                if (result === true) {
                    if (callbackFunction) {
                        callbackFunction();
                    }
                }
            }
        });
    };

    var confirmationCustom = function (confrimMessage, noCallback, cancelCallback, okCallback, lan) {
        bootbox.dialog({
            message: `<div class="bootbox-body">${confrimMessage}</div>`,
            size: 'medium',
            buttons: {
                cancel: {
                    label: lan === 'sv-SE' ? " Avbryt " :" Cancel ",
                    className: 'btn-danger btn-sm',
                    callback: () => {
                        if (cancelCallback) cancelCallback();
                    }
                },
                noclose: {
                    label: lan === 'sv-SE' ? " Nej " : " No ",
                    className: 'btn-primary btn-sm',
                    callback: () => {
                        if (noCallback) noCallback();
                    }
                },
                ok: {
                    label: lan === 'sv-SE' ? " Ja " : " Yes ",
                    className: 'btn-success btn-sm',
                    callback: () => {
                        if (okCallback) okCallback();
                    }
                }
            }
        });
    };

    var showMessage = function (messageObjectOrmessageType, messageString) {
        var messageType = '';
        var message = '';

        if (typeof messageString === 'undefined') {
            messageType = messageObjectOrmessageType['messageType'];
            message = messageObjectOrmessageType['messageString'];
            if (typeof messageType !== 'undefined' && typeof message !== 'undefined') {
                _openMessage(messageType, message);
            }
        }
        else {

            messageType = messageObjectOrmessageType;
            message = messageString;
            _openMessage(messageType, message);
        }
    };

    var _openMessage = function (messageType, message) {
        if (messageType === 1 || messageType === '1' || messageType === 'success') {
            toastr.success(message, "Success !", { closeButton: true });
        }
        else if (messageType === 2 || messageType === '2' || messageType === 'error') {
            toastr.error(message, "Error !", { closeButton: true });
        }
        else if (messageType === 3 || messageType === '3' || messageType === 'warning') {
            toastr.warning(message, "Warning !", { closeButton: true });
        }
    };

    var getFormattedNumber = function (format, number) {
        if (format === 1) {
            let x = parseFloat(number).toFixed(2);

            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return parts.join(",");
        } else if (format === 2) {
            let x = parseInt(number);
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        } else if (format === 3) {
            let x = Math.round(parseInt(number) / 1000);
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
    };

    var getTotalPercentage = function (obj) {
        var total = 0;
        for (const prop in obj) {
            if (months.includes(prop))
                total = total + parseFloat(obj[prop]);
        }
        return total.toFixed(2);
    }

    var initializeDatePicker = function () {

        //var session = JSON.parse(localStorage.getItem('vcompihrls'));
        //if (session) {
        //    $(".form_datetime").datepicker({
        //        autoclose: true,
        //        todayHighlight: true,
        //        setDaysOfWeekDisabled: [0, 6],
        //        format: session.DateFormat.toLowerCase(),
        //        pickerPosition: ("bottom-right")
        //    });

        //    $('.form_datetime input').attr('placeholder', session.DateFormat.toLowerCase());
        //}
        //else {
        //    showAlert('Date format not found', false);
        //}
    };

    var getFormValue = function (formControl) {

        var form = $(formControl);
        if (typeof form !== "undefined") {
            var obj = {};

            $(formControl + ' input ,' + formControl + ' select ,' + formControl + ' textarea').each(function () {
                if ($(this).is('[data-pi]')) {
                    var name = $(this).attr('name');
                    var property = $(this).data('pi');
                    var value;

                    if ($(this).is(':checkbox')) {
                        value = $(this).is(':checked');
                    }
                    else if ($(this).is(':radio')) {
                        value = $('input[name=' + name + ']:checked').val();
                    }
                    else {
                        value = $(this).val();
                    }

                    if (isNullOrEmpty(property)) {
                        obj[name] = value;
                    }
                    else {
                        obj[property] = value;
                    }
                }
            });

            return obj;
        }
        console.log('Form is undefined: site.js>GetFormValue');
        return null;
    };

    var objectToFormData = function (obj) {

        var formData = new FormData();
        for (var prop in obj) {
            if (!obj.hasOwnProperty(prop)) continue;
            formData.append(prop, obj[prop]);
        }
        return formData;
    };

    var showAlert = function (message, alertType, callBack) {

        Swal.fire({
            title: capitalize(alertType) + '!',
            text: message,
            icon: alertType,
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.value && callBack) {
                callBack();
            }
        });        
    };

    var bindSelect = function (control, options) {

        var option = '';
        for (var i = 0; i < options.length; i++) {
            option += '<option value="' + options[i].Value + '">' + options[i].Text + '</option>';
        }

        $(control).select2('destroy').empty().append(option);
        $(control).select2();

    };

    var _post = function (method, url, data, callback, async, modalHandling, showMessage, alertBox, showLoader) {

        if (showLoader === true) {
            blockUI();
        }

        $.ajax({
            type: method,
            async: async,
            url: url,
            data: data,
            success: (response, textStatus, jqXHR) => {
                if (showLoader === true) {
                    unBlockUI();
                }
                if (modalHandling === true && isSuccess(response)) {
                    hideModal();
                }

                if (showMessage === true) {
                    if (alertBox === true) {
                        showAlert(response.message, isSuccess(response) === true ? 'success' : 'error', callback);
                    }
                    else {
                        $.notify(response.message, isSuccess(response) === true ? 'success' : 'error');
                    }
                }
                if (alertBox === false) {
                    callback(response);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {

                if (showLoader) {
                    unBlockUI();
                }
                _handleError(jqXHR, textStatus, errorThrown);
            }
        });
    };

    var isValidEmail = function (emailAddress) {
        var result = false;
        if (EmailAddressRegex.test(emailAddress)) {
            result = true;
        }
        return result;
    };

    var isSuccess = function (obj) {
        if (typeof obj !== 'undefined') {
            if (obj.success === true || obj.success === 1) {
                return true;
            }
        }
        return false;
    };

    var toDate = function (date) {
        var d = new Date(parseInt(date.slice(6, -2)));
        return (("0" + d.getDate()).slice(-2) + '-' + ("0" + (1 + d.getMonth())).slice(-2) + '-' + d.getFullYear());
    };


    var toDateTime = function (date) {
        var d = new Date(parseInt(date.slice(6, -2)));
        return (("0" + d.getDate()).slice(-2) + '-' + ("0" + (1 + d.getMonth())).slice(-2) + '-' + d.getFullYear() + " " +
            d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
    };

    var toNumber = function (data) {
        if (isNullOrEmpty(data)) {
            return 0;
        }
        else {
            var _val = parseFloat(data);
            return isNaN(_val) ? 0 : _val;
        }
    };

    var revisedString = function (data) {
        var result = data;
        if (!isNullOrEmpty(data) && data.length > 2 && data.indexOf(':') == -1) {
            let input = data;
            let addChar = ":";
            var position = 2;
            result = [input.slice(0, position), addChar, input.slice(position)].join('');
        }
        return result;
    };

    var getCurrentDate = function () {
        let d = new Date();
        let currentDateTime = ("0" + d.getDate()).slice(-2) + '-' + ("0" + (1 + d.getMonth())).slice(-2) + '-' + d.getFullYear() + " " +
            d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        return currentDateTime;
    };

    var formatDate = function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    };

    var dateToTS = function (date) {
        return date.valueOf();
    };

    var tsToDate = function (ts) {
        var d = new Date(ts);

        return d.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    var uiInit = function () {

        $('[data-toggle="tooltip"]').tooltip();

    };

    var initDataTable = function (table) {
        $(table).dataTable({
            "language": {
                "lengthMenu": "Records per page _MENU_ "
            },
            "aaSorting": [],
            "pageLength": 15,
            "aLengthMenu": [[10, 15, 25, 35, 50, 100, -1], [10, 15, 25, 35, 50, 100, "All"]]
        });
    };


    var _handleError = function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR)
        var msg = '';
        if (jqXHR.status === 0) {
            //msg = 'Not connect.\n Verify Network.';
            msg = '';
        } else if (jqXHR.status === 101) {
            window.location.href = '/Error/SessionExpired';
        } else if (jqXHR.status === 404) {
            window.location.href = '/Error';
        } else if (jqXHR.status === 403) {
            window.location.href = '/Error/PermissionDenied';
        } else if (jqXHR.status === 401) {

            bootbox.dialog({ message: '<div class="text-center"> <span class="font-red-thunderbird bold">Session has been expired.</span> </div>', closeButton: false });
            setTimeout(function () {
                window.location.href = '/Login';
            }, 2000);

        } else if (jqXHR.status === 500) {
            msg = 'Internal Server Error, contact with system administrator';
        } else if (textStatus === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (textStatus === 'timeout') {
            msg = 'Time out error.';
        } else if (textStatus === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }

        if ($('#xhr-error-dialog').length <= 0 && msg !== "") {

            var dialog = bootbox.dialog({
                message: '<div id="xhr-error-dialog">' +
                    '<p class="text-center font-red-soft font-18p">' + msg + '</p>' +
                    '<div class="text-right"><button type="button" class="bootbox-close-button btn btn-circle red-soft" data-dismiss="modal" aria-hidden="true" > &nbsp;&nbsp;Ok&nbsp;&nbsp; </button></div>' +
                    '</div>',
                closeButton: false
            });
        }
    };

    var _globalEventHandler = function () {

        $(document).off('keypress', '.percentage-only').on('keypress', '.percentage-only', function (evt) {
            var val1;
            if (!(evt.keyCode == 46 || (evt.keyCode >= 48 && evt.keyCode <= 57)))
                return false;
            var parts = evt.target.value.split('.');
            if (parts.length > 2)
                return false;
            if (evt.keyCode == 46)
                return (parts.length == 1);
            if (evt.keyCode != 46) {
                var currVal = String.fromCharCode(evt.keyCode);
                val1 = parseFloat(String(parts[0]) + String(currVal));
                if (parts.length == 2)
                    val1 = parseFloat(String(parts[0]) + "." + String(currVal));
            }

            if (val1 > 100)
                return false;
            if (parts.length == 2 && parts[1].length >= 2) return false;
        });

        $(document).off('keypress', '.number-only').on('keypress', '.number-only', function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;

            var isOk = true;

            // Max Value Check
            if ($(this).attr('data-max-value')) {
                var value = $(this).val() + String.fromCharCode(charCode);

                var maxvalue = parseInt($(this).data('max-value'));
                var val = parseInt(value);
                if (val > maxvalue) {
                    isOk = false;
                }
            }

            // Max Length Check
            if ($(this).attr('data-max-length')) {
                var length = parseInt($(this).val().length) + 1;
                var maxlength = parseInt($(this).data('max-length'));
                if (length > maxlength) {
                    isOk = false;
                }
            }

            return isOk;
        });

        $(document).off('keypress', '.money-only').on('keypress', '.money-only', function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;

            if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46 && charCode !== 45)
                return false;

            else if (charCode === 46) {
                var val = $(this).val();
                if (val) {
                    var count = val.replace(/[^.]/g, "").length;
                    if (count >= 1) {
                        return false;
                    }
                }
            }
            else if (charCode === 45) {
                if ($(this).hasClass('neg')) {
                    var val1 = $(this).val();
                    if (val1) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }

            var isOk = true;
            if ($(this).attr('data-max-value')) {
                var value = $(this).val() + String.fromCharCode(charCode);

                var maxvalue = parseFloat($(this).data('max-value'));
                var val2 = parseFloat(value);
                if (val2 > maxvalue) {
                    isOk = false;
                }
            }

            // Max Length Check
            if ($(this).attr('data-max-length')) {
                var length = parseInt($(this).val().length) + 1;
                var maxlength = parseInt($(this).data('max-length'));
                if (length > maxlength) {
                    isOk = false;
                }
            }

            return isOk;
        });

        $(document).off('keypress', '.money-only-sw').on('keypress', '.money-only-sw', function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;

            if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 44 && charCode !== 45)
                return false;

            else if (charCode === 44) {
                var val = $(this).val();
                if (val) {
                    var count = val.replace(/[^,]/g, "").length;
                    if (count >= 1) {
                        return false;
                    }
                }
            }
            else if (charCode === 45) {
                if ($(this).hasClass('neg')) {
                    var val1 = $(this).val();
                    if (val1) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }

            var isOk = true;
            if ($(this).attr('data-max-value')) {
                var value = $(this).val() + String.fromCharCode(charCode);

                var maxvalue = parseFloat($(this).data('max-value'));
                var val2 = parseFloat(value);
                if (val2 > maxvalue) {
                    isOk = false;
                }
            }

            // Max Length Check
            if ($(this).attr('data-max-length')) {
                var length = parseInt($(this).val().length) + 1;
                var maxlength = parseInt($(this).data('max-length'));
                if (length > maxlength) {
                    isOk = false;
                }
            }

            return isOk;
        });

        jQuery(document).off('change', '#SetdSubModuleId').on('change', '#SetdSubModuleId', function () {
            var subModulId = $(this).val();
            document.location.href = '/Dashboard/SetSubModule?subModuleId=' + subModulId;
        });


        //Notification Handing
        $(document).off('click', '.nf-btn-showdetails').on('click', '.nf-btn-showdetails', function (e) {

            var $des = $(this).parent().parent().find('.nf-description');
            if ($des.hasClass('hidden')) {
                $des.addClass('show');
                $des.removeClass('hidden');
                var notificationId = $(this).parent().parent().data('id');
                post('/Dashboard/ReadNotification', { notificationId: notificationId }, function () {
                }, true, false, false, false);

            }
            else {
                $des.addClass('hidden');
                $des.removeClass('show');
            }
        });

        //Notification Handing
        $(document).off('click', '.nf-btn-read').on('click', '.nf-btn-read', function (e) {

            var e = this;
            var notificationId = $(this).parent().parent().data('id');
            post('/Dashboard/ReadNotification', { notificationId: notificationId }, function () {
                $(e).parent().parent().parent().remove();

                var nfCount = parseInt($('#notificationNumber').text().trim());
                nfCount = isNaN(nfCount) ? 0 : nfCount;
                if (nfCount > 0) {
                    nfCount = nfCount - 1;
                    $('#notificationNumber').text(nfCount);
                    if (nfCount === 0) {
                        $('#notificationNumber').addClass('display-hide');
                    }
                }

            }, true, false, false, false);

        });

    };

    //Notification Handing
    var viewNotifications = function () {

        get('/Dashboard/GetMyNotifications', {}, function (response) {
            if (response) {
                $('#notificationNumber').text(response.length);
                if (response.length > 0) {
                    $('#notificationNumber').removeClass('display-hide');
                }
                var nf = '';
                response.forEach(function (v) {
                    nf += '<li>' +
                        '<a data-id="' + v.NotificationId + '" href="javascript:;">' +
                        '<span class="time">' +
                        '<button data-toggle="tooltip" title="View description"  type= "button" class="btn green btn-xs nf-btn-showdetails" > <i class="fa fa-list"></i></button >' +
                        '<button data-toggle="tooltip" title="Mask as read" style="margin-left:3px;" type="button" class="btn green-jungle btn-xs nf-btn-read"><i class="fa fa-check"></i></button>' +
                        '</span>' +
                        '<span class="details"> ' + v.Title + '<br /><span class="nf-description hidden">' + v.Description + '</span></span >' +
                        '</a>' +
                        '</li>';
                });
                $('#lst-notifications').empty().append(nf);
            }
            else {
                $('#notificationNumber').text('0');
            }

            $('[data-toggle="tooltip"]').tooltip();
        }, true, false, false, false);
    };

    var money = function (selector) {
    };


    var blockUI = function (ctrl) {
        ctrl = isNullOrEmpty(ctrl) ? 'body' : ctrl;
        $(ctrl).loading({
            stoppable: false,
            zIndex: 10051,
            message: 'Please wait ...'
        });
    };

    var unBlockUI = function (ctrl) {
        ctrl = isNullOrEmpty(ctrl) ? 'body' : ctrl;
        $(ctrl).loading('stop');
    };

    var capitalize = function (str) {
        if (typeof str !== 'string') return '';
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    var isMatch = function (str) {

        let isValid = true;
        if (str) {

            var found = str.match(PhoneNoRegex);
            isValid = found === null ? false : true;

            if (str.length < 7 || str.length > 16) {
                isValid = false;
            }
        }
        return isValid;
    };
    var toCamelCase = function (str) {
        if (str === str.toUpperCase()) {
            str = str.toLowerCase();

        }

        for (var i = 0; i < str.length - 1; i++) {

            if (i === 0) {
                str = str.replaceAt(i, str[i].toLowerCase());
            } else if (str[i + 1] === str[i + 1].toUpperCase()) {
                str = str.replaceAt(i, str[i].toLowerCase());
            } else {
                break;
            }
        }
        return str;
    };



    var init = function () {
        _globalEventHandler();
        // initializeDatePicker();
    };


    return {
        init: init,
        post: post,
        get: get,
        months: months,
        postFormData: postFormData,
        getTotalPercentage: getTotalPercentage,
        isNullOrEmpty: isNullOrEmpty,
        getFormattedNumber: getFormattedNumber,
        showModal: showModal,
        showContentOnModal: showContentOnModal,
        hideModal: hideModal,
        load: load,
        confirmation: confirmation,
        confirmationCustom: confirmationCustom,
        showMessage: showMessage,
        showAlert: showAlert,
        getFormValue: getFormValue,
        objectToFormData: objectToFormData,
        isSuccess: isSuccess,
        toDate: toDate,
        toDateTime: toDateTime,
        initializeDatePicker: initializeDatePicker,
        bindSelect: bindSelect,
        uiInit: uiInit,
        initDataTable: initDataTable,
        viewNotifications: viewNotifications,
        toNumber: toNumber,
        _handleError: _handleError,
        blockUI: blockUI,
        unBlockUI: unBlockUI,
        dateFormat: dateFormat,
        isMatch: isMatch,
        PhoneNoRegex: PhoneNoRegex,
        toCamelCase: toCamelCase,
        orderColumn: orderColumn,
        revisedString: revisedString,
        getCurrentDate: getCurrentDate,
        isValidEmail: isValidEmail,
        dateToTS: dateToTS,
        tsToDate: tsToDate,
        formatDate: formatDate
    };

}();

var modalSize = function () {
    var lg = 'lg';
    var xl = 'xl';
    var md = 'md';
    var report = 'report';
    var xs = 'xs';
    var sm = 'sm';
    var none = '';

    return {
        lg: lg,
        xl: xl,
        md: md,
        report: report,
        sm: sm,
        xs: xs,
        none: none
    };
}();




$(document).ready(function () {

    helper.init();

    function readURL(input) {
        var id = $(input).data('preview');
        if (typeof id !== 'undefined') {

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#' + id).attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            }
        }
    }

    $(document).on('change', '.ci-image', function () {
        readURL(this);
    });

    $('.no-paste').bind('paste', function (e) {
        e.preventDefault(); //disable cut,copy,paste  
    });
    //$('input[placeholder="Search query"]').attr('placeholder', 'Sök');
});

$.fn.isValid = function () {
    var form = $(this);
    form.validate();
    return form.valid();
};

jQuery.validator.setDefaults({
    errorPlacement: function (error, element) {
        if (element.hasClass('select2-hidden-accessible')) {
            error.insertAfter(element.next());
        }
        else if (element.hasClass('error-next')) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});


var AlertTypes = function () {
    var success = 'success';
    var error = 'error';
    var warning = 'warning';
    var info = 'info';
    var question = 'question';


    return {
        success: success,
        error: error,
        warning: warning,
        info: info,
        question: question
    };
}();
