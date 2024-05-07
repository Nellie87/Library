(function ($) {
    "use strict";

    // ADD OPERATION
    var admin_loader = "{{$gs->admin_loader}}";
    $(document).on('click', '#add-data', function () {
//	alert("in");
        if (admin_loader == 1) {
            $('.submit-loader').show();
        }
        $('#modal1').find('.modal-title').html('ADD NEW ' + $('#headerdata').val());
        $('#modal1 .modal-content .modal-body').html('').load($(this).attr('data-href'), function (response, status, xhr) {
            if (status == "success") {
                if (admin_loader == 1) {
                    $('.submit-loader').hide();
                }
            }

        });
    });


// EDIT OPERATION

    $(document).on('click', '.edit', function () {
        if (admin_loader == 1) {
            $('.submit-loader').show();
        }
        $('#modal1').find('.modal-title').html('EDIT ' + $('#headerdata').val());
        $('#modal1 .modal-content .modal-body').html('').load($(this).attr('data-href'), function (response, status, xhr) {
            if (status == "success") {
                if (admin_loader == 1) {
                    $('.submit-loader').hide();
                }
            }
        });
    });

    $(document).on('click', '.view', function () {
        if (admin_loader == 1) {
            $('.submit-loader').show();
        }
        $('#modal1').find('.modal-title').html($('#headerdata').val() + ' DETAILS');
        $('#modal1 .modal-content .modal-body').html('').load($(this).attr('data-href'), function (response, status, xhr) {
            if (status == "success") {
                if (admin_loader == 1) {
                    $('.submit-loader').hide();
                }
            }

        });
    });

// EDIT OPERATION END

    $('#confirm-delete').on('show.bs.modal', function (e) {
        $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
    });

    $('#confirm-delete .btn-ok').on('click', function (e) {
        if (admin_loader == 1) {
            $('.submit-loader').show();
        }
        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            success: function (data) {
                $('#confirm-delete').modal('toggle');
                location.reload();
                // table.ajax().reload()
                toastr.success(data);
                $('.alert-danger').hide();
                $('.alert-success').show();
                $('.alert-success p').html(data);
                if (admin_loader == 1) {
                    $('.submit-loader').hide();
                }
            }
        });
        return false;
    });

// Attribute Modal

    $(document).on('click', '.attribute', function () {
        if (admin_loader == 1) {
            $('.submit-loader').show();
        }
        $('#attribute').find('.modal-title').html($('#attribute_data').val());
        $('#attribute .modal-content .modal-body').html('').load($(this).attr('data-href'), function (response, status, xhr) {
            if (status == "success") {
                if (admin_loader == 1) {
                    $('.submit-loader').hide();
                }
            }

        });
    });

// Attribute Modal Ends

    // Status Start
    $(document).on('click', '.status', function () {
        var link = $(this).attr('data-href');
        $.get(link, function (data) {
        }).done(function (data) {
            table.ajax.reload();
            toastr.success(data);
            $('.alert-danger').hide();
            $('.alert-success').show();
            $('.alert-success p').html(data);
        })
    });
    // Status Ends
    //
    // Droplinks Start
    $(document).on('change', '.droplinks', function () {

        var link = $(this).val();
        var data = $(this).find(':selected').attr('data-val');
        if (data == 0) {
            $(this).next(".nice-select.process.select.droplinks").removeClass("drop-success").addClass("drop-danger");
        } else {
            $(this).next(".nice-select.process.select.droplinks").removeClass("drop-danger").addClass("drop-success");
        }
        $.get(link);
        $.notify("Status Updated Successfully.", "success");
    });


    $(document).on('change', '.vdroplinks', function () {

        var link = $(this).val();
        var data = $(this).find(':selected').attr('data-val');
        if (data == 0) {
            $(this).next(".nice-select.process.select1.vdroplinks").removeClass("drop-success").addClass("drop-danger");
        } else {
            $(this).next(".nice-select.process.select1.vdroplinks").removeClass("drop-danger").addClass("drop-success");
        }
        $.get(link);
        $.notify("Status Updated Successfully.", "success");
    });

    $(document).on('change', '.data-droplinks', function (e) {
        $('#confirm-delete1').modal('show');
        $('#confirm-delete1').find('.btn-ok').attr('href', $(this).val());
        table.ajax.reload();
        var data = $(this).children("option:selected").html();
        if (data == 'Pending') {
            $('#t-txt').addClass('d-none');
            $('#t-txt').val('');
        } else {
            $('#t-txt').removeClass('d-none');
        }
        $('#t-id').val($(this).data('id'));
        $('#t-title').val(data);
    });

    $(document).on('change', '.vendor-droplinks', function (e) {
        $('#confirm-delete1').modal('show');
        $('#confirm-delete1').find('.btn-ok').attr('href', $(this).val());
        table.ajax.reload();
    });

    $(document).on('change', '.order-droplinks', function (e) {
        $('#confirm-delete2').modal('show');
        $('#confirm-delete2').find('.btn-ok').attr('href', $(this).val());
    });


// Droplinks Ends

// Display Subcategories & attributes
    $(document).on('change', '#cat', function () {
        var link = $(this).find(':selected').attr('data-href');
        if (link != "") {
            $('#subcat').load(link);
            $('#subcat').prop('disabled', false);
        }
        $.get(getattrUrl + '?id=' + this.value + '&type=category', function (data) {
            console.log(data);
            let attrHtml = '';
            for (var i = 0; i < data.length; i++) {
                attrHtml += `
      <div class="row">
        <div class="col-lg-4">
          <div class="left-area">
              <h4 class="heading">${data[i].attribute.name} *</h4>
          </div>
        </div>
        <div class="col-lg-7">
      `;

                for (var j = 0; j < data[i].options.length; j++) {
                    let priceClass = '';
                    if (data[i].attribute.price_status == 0) {
                        priceClass = 'd-none';
                    }
                    attrHtml += `
          <div class="row mb-0 option-row">
            <div class="col-lg-5">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" id="${data[i].attribute.input_name}${data[i].options[j].id}" name="${data[i].attribute.input_name}[]" value="${data[i].options[j].name}" class="custom-control-input attr-checkbox">
                <label class="custom-control-label" for="${data[i].attribute.input_name}${data[i].options[j].id}">${data[i].options[j].name}</label>
              </div>
            </div>
            <div class="col-lg-7 ${priceClass}">
              <div class="row">
                <div class="col-2">
                  +
                </div>
                <div class="col-10">
                  <div class="price-container">
                    <span class="price-curr">${curr.sign}</span>
                    <input type="text" class="input-field price-input" id="${data[i].attribute.input_name}${data[i].options[j].id}_price" data-name="${data[i].attribute.input_name}_price[]" placeholder="0.00 (Additional Price)" value="">
                  </div>
                </div>
              </div>
            </div>
          </div>

        `;
                }

                attrHtml += `
        </div>
      </div>
      `;
            }

            $("#catAttributes").html(attrHtml);
            $("#subcatAttributes").html('');
            $("#childcatAttributes").html('');
        });
    });
// Display Subcategories Ends

// Display Childcategories & Attributes
    $(document).on('change', '#subcat', function () {
        var link = $(this).find(':selected').attr('data-href');
        if (link != "") {
            $('#childcat').load(link);
            $('#childcat').prop('disabled', false);
        }

        $.get(getattrUrl + '?id=' + this.value + '&type=subcategory', function (data) {
            console.log(data);
            let attrHtml = '';
            for (var i = 0; i < data.length; i++) {
                attrHtml += `
      <div class="row">
        <div class="col-lg-4">
          <div class="left-area">
              <h4 class="heading">${data[i].attribute.name} *</h4>
          </div>
        </div>
        <div class="col-lg-7">
      `;

                for (var j = 0; j < data[i].options.length; j++) {
                    let priceClass = '';
                    if (data[i].attribute.price_status == 0) {
                        priceClass = 'd-none';
                    }
                    attrHtml += `
            <div class="row option-row">
              <div class="col-lg-5">
                <div class="custom-control custom-checkbox custom-control-inline">
                  <input type="checkbox" id="${data[i].attribute.input_name}${data[i].options[j].id}" name="${data[i].attribute.input_name}[]" value="${data[i].options[j].name}" class="custom-control-input attr-checkbox">
                  <label class="custom-control-label" for="${data[i].attribute.input_name}${data[i].options[j].id}">${data[i].options[j].name}</label>
                </div>
              </div>
              <div class="col-lg-7 ${priceClass}">
                <div class="row">
                  <div class="col-2">
                    +
                  </div>
                  <div class="col-10">
                    <div class="price-container">
                      <span class="price-curr">${curr.sign}</span>
                      <input type="text" class="input-field price-input" id="${data[i].attribute.input_name}${data[i].options[j].id}_price" data-name="${data[i].attribute.input_name}_price[]" placeholder="0.00 (Additional Price)" value="">
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `;
                }

                attrHtml += `
        </div>
      </div>
      `;
            }

            $("#subcatAttributes").html(attrHtml);
            $("#childcatAttributes").html('');
        });
    });
// Display Childcateogries & Attributes Ends


// Display Attributes for Selected Childcategory Starts
    $(document).on('change', '#childcat', function () {

        $.get(getattrUrl + '?id=' + this.value + '&type=childcategory', function (data) {
            console.log(data);
            let attrHtml = '';
            for (var i = 0; i < data.length; i++) {
                attrHtml += `
      <div class="row">
        <div class="col-lg-4">
          <div class="left-area">
              <h4 class="heading">${data[i].attribute.name} *</h4>
          </div>
        </div>
        <div class="col-lg-7">
      `;

                for (var j = 0; j < data[i].options.length; j++) {
                    let priceClass = '';
                    if (data[i].attribute.price_status == 0) {
                        priceClass = 'd-none';
                    }
                    attrHtml += `
            <div class="row option-row">
              <div class="col-lg-5">
                <div class="custom-control custom-checkbox custom-control-inline">
                  <input type="checkbox" id="${data[i].attribute.input_name}${data[i].options[j].id}" name="${data[i].attribute.input_name}[]" value="${data[i].options[j].name}" class="custom-control-input attr-checkbox">
                  <label class="custom-control-label" for="${data[i].attribute.input_name}${data[i].options[j].id}">${data[i].options[j].name}</label>
                </div>
              </div>
              <div class="col-lg-7 ${priceClass}">
                <div class="row">
                  <div class="col-2">
                    +
                  </div>
                  <div class="col-10">
                    <div class="price-container">
                      <span class="price-curr">${curr.sign}</span>
                      <input type="text" id="${data[i].attribute.input_name}${data[i].options[j].id}_price" class="input-field price-input" data-name="${data[i].attribute.input_name}_price[]" placeholder="0.00 (Additional Price)" value="">
                    </div>
                  </div>
                </div>
              </div>
            </div>

        `;
                }

                attrHtml += `
        </div>
      </div>
      `;
            }

            $("#childcatAttributes").html(attrHtml);
        });
    });
// Display Attributes for Selected Childcategory Ends

    $(document).on('click', '.godropdown .go-dropdown-toggle', function () {
        //alert("in");
        $('.godropdown .action-list').hide();
        var $this = $(this);
        $this.next('.action-list').toggle();
    });


    $(document).on('click', function (e) {
        var container = $(".godropdown");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.find('.action-list').hide();
        }
    });


// CATALOG OPTION

    $('#catalog-modal').on('show.bs.modal', function (e) {
        $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
    });

    $('#catalog-modal .btn-ok').on('click', function (e) {

        if (admin_loader == 1) {
            $('.submit-loader').show();
        }

        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            success: function (data) {
                $('#catalog-modal').modal('toggle');
                table.ajax.reload();
                $('.alert-danger').hide();
                $('.alert-success').show();
                $('.alert-success p').html(data);


                if (admin_loader == 1) {
                    $('.submit-loader').hide();
                }


            }
        });
        return false;
    });


// CATALOG OPTION ENDS

// FEATURE OPERATION

    $(document).on('click', '.feature', function () {
        if (admin_loader == 1) {
            $('.submit-loader').show();
        }
        $('#modal2').find('.modal-title').html($('#headerdata').val() + ' Highlight');
        $('#modal2 .modal-content .modal-body').html('').load($(this).attr('data-href'), function (response, status, xhr) {
            if (status == "success") {
                if (admin_loader == 1) {
                    $('.submit-loader').hide();
                }

                var dateToday = new Date();
                $("#discount_date").datepicker({
                    changeMonth: true,
                    changeYear: true,
                    minDate: dateToday,
                });

            }
        });
    });
    // TRACK OPERATION

    $(document).on('click', '.track', function () {
        if (admin_loader == 1) {
            $('.submit-loader').show();
        }
        $('#modal1').find('.modal-title').html('TRACK ' + $('#headerdata').val());
        $('#modal1 .modal-content .modal-body').html('').load($(this).attr('data-href'), function (response, status, xhr) {
            if (status == "success") {
                if (admin_loader == 1) {
                    $('.submit-loader').hide();
                }
            }

        });
    });


    // TRACK OPERATION END

// DELIVERY OPERATION

    $(document).on('click', '.delivery', function () {
        if (admin_loader == 1) {
            $('.submit-loader').show();
        }
        $('#modal1').find('.modal-title').html('DELIVERY STATUS');
        $('#modal1 .modal-content .modal-body').html('').load($(this).attr('data-href'), function (response, status, xhr) {
            if (status == "success") {
                if (admin_loader == 1) {
                    $('.submit-loader').hide();
                }
            }

        });
    });


    // DELIVERY OPERATION END

    // ORDER TRACKING STARTS

    $(document).on('click', '.track-edit', function () {
        $('#track-title').focus();
        var title = $(this).parent().parent().parent().find('.t-title').text();
        var text = $(this).parent().parent().parent().find('.t-text').text();

        $('#track-title').val(title);
        $('#track-details').val(text);

        $('#track-btn').text($('#edit-text').val());
        $('#trackform').prop('action', $(this).data('href'));
        $('#cancel-btn').removeClass('d-none');

    });


    $(document).on('click', '#cancel-btn', function () {

        $(this).addClass('d-none');
        $('#track-btn').text($('#add-text').val());
        $('#track-title').val('');
        $('#track-details').val('');
        $('#trackform').prop('action', $('#track-store').val());
    });


    $(document).on('click', '.track-delete', function () {
        $(this).parent().parent().parent().remove();
        $.get($(this).data('href'), function (data, status) {
            toastr.success(data);
            // $('#trackform .alert-success').show();
            // $('#trackform .alert-success p').html(data);
        });

    });


    // ORDER TRACKING ENDS

    // $(document).on('click','#notf_order',function(){
    //   $("#order-notf-count").html('0');
    //   $('#order-notf-show').load($("#order-notf-show").data('href'));
    // });

    // $(document).on('click','#order-notf-clear',function(){
    //   $(this).parent().parent().trigger('click');
    //   $.get($('#order-notf-clear').data('href'));
    // });

})(jQuery);
