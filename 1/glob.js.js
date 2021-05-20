$(document).ready(function () {
    // вся мaгия пoслe зaгрузки стрaницы

    // alert('werwer');

    /**
     * обновляем цифру товаров в корзине в ярлыке корзины
     * @param {type} kolvo
     * @param {type} items
     * @returns {undefined}
     */
    function refreshCart(kolvo = 0, items = []) {
        // // console.log('function refreshCart', kolvo, items);
        //// console.log('function refreshCart', kolvo);
        $('#cart .number-shopping-cart').html(kolvo);
        // alert('refresh');
    }

    /**
     * считаем все суммы в таблице корзины
     * @returns {undefined}
     */
    function refreshCartTable() {
        //// console.log('function refreshCartTable');

        // $('#cart .number-shopping-cart').html(kolvo);
        // alert('refresh');

        var summa = 0;

        $('tr.cart_item').each(function (i, elem) {
            // // console.log('111', elem);

            var item_id = $(this).attr('item_id');
            //// console.log('item id', item_id);

            var kolvo = $('.product-quantity input#quantity' + item_id).val();
            // var kolvo = $('#quantity' + item_id).val();
            //// console.log('kolvo', kolvo);

            var price = $('#price' + item_id).attr('price');
            // console.log('price', price);

            var sum1 = kolvo * price;
            //// console.log('sum1', sum1);

            if (price > 0) {
                $('#summa' + item_id).html(number_format(sum1, 2, ',', '`'));
            }

            summa = summa + sum1;

            $('#summa_id_show_' + item_id).html(number_format(sum1, 0, '.', '`'));
            $('#summa_id_' + item_id).val(sum1);

            //            if ($(this).hasClass("stop")) {
            //                alert("Остановлено на " + i + "-м пункте списка.");
            //                return false;
            //            } else {
            //                alert(i + ': ' + $(elem).text());
            //            }
        });

        // console.log('summa', summa);
        $('#summa_all_show').html(number_format(summa, 2, '.', '`') + ' ₽');
    }

    /**
     * удаление позиции в корзине
     * @param {type} $item
     * @returns {undefined}
     */
    var deleteItemFromCart = function (item_id, s) {
        // console.log('deleteItemFromCart', item_id, s);
        $.ajax({
            url: '/vendor/didrive_mod/shop0/1/ajax.php',
            data: 'action=remove_from_cart&id=' + item_id + '&s=' + s,
            cache: false,
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                /*
                 if (typeof $div_hide !== 'undefined') {
                 $('#' + $div_hide).hide();
                 }
                 */
                //                $("#ok_but_stat").html('<img src="/img/load.gif" alt="" border=0 />');
                //                $("#ok_but_stat").show('slow');
                //                $("#ok_but").hide();
            },
            success: function ($j) {
                refreshCart();
                refreshCartTable();
                return true;
                /*
                 // alert($j.html);
                 if (typeof $div_show !== 'undefined') {
                 $('#' + $div_show).show();
                 }
                 */
                //                $('#form_ok').hide();
                //                $('#form_ok').html($j.html + '<br/><A href="">Сделать ещё заявку</a>');
                //                $('#form_ok').show('slow');
                //                $('#form_new').hide();
                //
                //                $('.list_mag').hide();
                //                $('.list_mag_ok').show('slow');
            },
        });
        return false;
    };

    var shop__change_kolvo = function (action, item_id, s) {
        // console.log('shop__change_kolvo', action, item_id, s);

        $.ajax({
            url: '/vendor/didrive_mod/shop0/1/ajax.php',
            data: 'action=' + action + '&id=' + item_id + '&s=' + s,
            cache: false,
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                /*
                 if (typeof $div_hide !== 'undefined') {
                 $('#' + $div_hide).hide();
                 }
                 */
                //                $("#ok_but_stat").html('<img src="/img/load.gif" alt="" border=0 />');
                //                $("#ok_but_stat").show('slow');
                //                $("#ok_but").hide();
            },
            success: function ($j) {
                // console.log('shop__change_kolvo 22', $j);

                $('#quantity' + item_id).val($j['new_kolvo']);

                refreshCartTable();

                // refreshCart();
                return true;
                /*
                 // alert($j.html);
                 if (typeof $div_show !== 'undefined') {
                 $('#' + $div_show).show();
                 }
                 */
                //                $('#form_ok').hide();
                //                $('#form_ok').html($j.html + '<br/><A href="">Сделать ещё заявку</a>');
                //                $('#form_ok').show('slow');
                //                $('#form_new').hide();
                //
                //                $('.list_mag').hide();
                //                $('.list_mag_ok').show('slow');
            },
        });
        return false;
    };

    // добавляем товар в корзину, убираем от туда
    $(document).on('click', '.shop__add_to_cart', function (event) {
        event.preventDefault();

        var th = $(this);

        // console.log('shop__add_to_cart0', th);


        var hide_this_on_click = '';
        var show_id_defore_click = '';

        var uri_query = '';

        $.each(this.attributes, function () {
            if (this.specified) {

                // console.log('s', this.name, this.value);

                // пропускаем атрибуты
                if (this.name == 'style' || this.name == 'class' || this.name == 'href' || this.name == 'onclick') {
                }
                // обрабатываем атрибуты
                else if (this.name == 'hide_this_on_click' && this.value == 'da') {
                    hide_this_on_click = this.value;
                }
                // обрабатываем атрибуты
                else if (this.name == 'show_id_defore_click') {
                    show_id_defore_click = '#' + this.value;
                }
                // обрабатываем атрибуты
                else {
                    uri_query = uri_query + '&' + this.name + '=' + this.value;
                }
            }
        });

        $.ajax({
            url: '/vendor/didrive_mod/shop0/1/ajax.php',
            data: 't=1' + uri_query,
            cache: false,
            dataType: 'json',
            type: 'post',
            beforeSend: function () {},
            success: function ($j) {

                refreshCart($j['kolvo'], $j['to_cart']);

                if (hide_this_on_click != '') {
                    th.hide();
                }

                if (show_id_defore_click != '') {
                    $(show_id_defore_click).show();
                }
            },
        });
    });

    // refreshCart();
    // alert('123123');

    //
    $(document).on('click', '.deleteItemFromCart', function (event) {

        event.preventDefault();

        if (!confirm('Удалить позицию ?'))
            return false;

        // console.log("$(document).on('click', '.deleteItemFromCart', function (event) {");
        var th = $(this);
        var item_id = $(this).attr('item_id');
        var s = $(this).attr('s');
        deleteItemFromCart(item_id, s);
        $('#item_tr_' + item_id).remove();

        // refreshCart($('#shop_id').val());
        return false;

    });

    $(document).on('click', '.shop__change_kolvo', function (event) {
        event.preventDefault();
        //        if (!confirm('Удалить позицию ?'))
        //            return false;

        // // console.log( "$(document).on('click', '.deleteItemFromCart', function (event) {" );

        //        var uri_query = '';
        //        $.each(this.attributes, function () {
        //            if (this.specified) {
        //                if (this.name == 'class' || this.name == 'style') {
        //                } else {
        //                    uri_query = uri_query + '&' + this.name + '=' + this.value;
        //                }
        //            }
        //        });

        var th = $(this);
        var action = $(this).attr('action');
        var item_id = $(this).attr('item_id');
        var s = $(this).attr('s');

        shop__change_kolvo(action, item_id, s);
        // $('#item_tr_' + item_id).remove();
        // refreshCart($('#shop_id').val());

        return false;
    });

    //    $(document).on('click', '.shop__change_kolvo', function (event) {
    //    }

    // $(document).on( 'keyup input', '.kolvo-items', $.debounce(1000, refreshCartTable) );
    refreshCartTable();

    var search_tov_other_shop = function () {
        //// console.log('shop__search77');

        if ($('#show__search_tov_other_shop').length) {

            let search = $('#show__search_tov_other_shop').attr('search');
            let s = $('#show__search_tov_other_shop').attr('s');

            //// console.log('поиск в других магах запущен', search, s);

            $.ajax({
                url: '/vendor/didrive_api/allautoparts/1/api.php',
                data: 'search=' + search + '&s=' + s,
                // data: "actxxion=" + action + "&id=" + item_id + "&s=" + s,
                cache: false,
                dataType: 'json',
                type: 'post',

                beforeSend: function () {
                    /*
                     if (typeof $div_hide !== 'undefined') {
                     $('#' + $div_hide).hide();
                     }
                     */
                    //                $("#ok_but_stat").html('<img src="/img/load.gif" alt="" border=0 />');
                    //                $("#ok_but_stat").show('slow');
                    //                $("#ok_but").hide();
                },
                success: function ($j) {
                    // // console.log( '222' , $j.length , $j  );

                    var $res = '';

                    if ($j.length > 0) {
                        // // console.log('товары есть, показываем');

                        $('#show__search_tov_other_shop tbody').html('');

                        $.each($j, function (ind, val) {

                            //// console.log(val.ProductName, val.Quantity, val.Price);
                            // console.log( val );

                            $('#show__search_tov_other_shop tbody').append(
                                    '<tr>' +
                                    '<td>' +

                                    // val.catnumber_search +
                                    // // val.PriceListDiscountCode +
                                    // search +
                                    val.CodeAsIs +
                                    
                                    '</td>' +
                                    '<td>' +
                                    val.ProductName +
                                    '<br/>' +
                                    '<b>' +
                                    val.ManufacturerName +
                                    '</b>' +
                                    '</td>' +                                    
                                    '<td>' +
                                    val.PeriodMax +
                                    '</td>' +
                                    '<td>' +
                                    val.Quantity +
                                    '</td>' +
                                    '<td>' +
                                    number_format(val.Price, 0, '.', '`') +
                                    '</td>' +
                                    '<td>' +
                                    // '<button>Добавить в корзину</button>' +

                                    ' <button class="addcart-ver2 shop__add_to_cart xaddToCart xbtn xbtn-default " ' +
                                    ' style="width: auto; xdisplay: inline-block; margin:0 auto;" ' +
                                    ' action="add_item_to_cart" ' +
                                    // ' {%  for k3,v3 in item %} ' +
                                    // ' aj_{{ k3 }} ="{{ v3 }}" ' +
                                    // ' {% endfor %} ' +
                                    // ' {#aj_name ="{{ item.head }}"#} ' +
                                    // ' {#aj_price ="{{ item.a_price }}"#} ' +
                                    ' aj_kolvo ="1" ' +
                                    ' aj_head ="' + val.ProductName + ' ' + val.ManufacturerName + '" ' +
                                    ' aj_name ="' + val.ProductName + ' ' + val.ManufacturerName + '" ' +
                                    // ' aj_opis ="заказ автосейлз № ' + val.PriceListDiscountCode + ' / ' + val.ProductName + ' ' + val.ManufacturerName + ' / доставка дней ' + val.PeriodMax + ' / цена ' + val.Price + '" ' +
                                    ' aj_opis ="Заказ АВТОСТЭЛС № ' + val.PriceListDiscountCode + ' / код заказа '+ val.CodeAsIs +' / доставка дней ' + val.PeriodMax + '" ' +
                                    ' aj_id ="' + val.PriceListDiscountCode + '" ' +
                                    ' aj_a_id ="' + val.PriceListDiscountCode + '" ' +
                                    ' aj_kod ="' + val.PriceListDiscountCode + '" ' +
                                    ' aj_a_price ="' + val.Price + '" ' +
                                    // ' {#aj_img ="{% if item.a_arrayimage is not empty %}{{ item.a_arrayimage }}{% endif %}"#} ' +
                                    // ' id ="{{ item.head ~ item.a_price ~\'1\' }}" ' +
                                    // ' s ="{{ creatSecret( item.head ~ item.a_price ~\'1\' ) }}" ' +
                                    ' hide_this_on_click="da" ' +
                                    ' show_id_defore_click="but_ok_' + val.PriceListDiscountCode + '" ' +
                                    ' >  ' +
                                    ' <span class=""> ' +
                                    ' Добавить в&nbsp;корзину ' +
                                    ' </span> ' +
                                    ' </button> ' +
                                    ' <a href="/show/cart/"  ' +
                                    ' class="addcart-ver2 ok btn btn-success"  ' +
                                    ' id="but_ok_' + val.PriceListDiscountCode + '" ' +
                                    ' style="margin-top:0;display:none;" ' +
                                    ' >В&nbsp;корзине</a> ' +


//                ' <center> ' +
//                    ' <button class="addcart-ver2 shop__add_to_cart xaddToCart xbtn xbtn-default " ' +
//
//                            ' style="width: auto; xdisplay: inline-block; margin:0 auto;" ' + 
//                            ' action="add_item_to_cart" ' +
//                            ' {%  for k3,v3 in item %} '+
//                            '    aj_{{ k3 }} ="{{ v3 }}" '+
//                            '{% endfor %} '+ 
//                            '{#aj_name ="{{ item.head }}"#} ' + 
//                            '{#aj_price ="{{ item.a_price }}"#} ' +
//                            ' aj_kolvo ="1" ' +
//                            ' {#aj_img ="{% if item.a_arrayimage is not empty %}{{ item.a_arrayimage }}{% endif %}"#} ' + 
//                            ' id ="{{ item.head ~ item.a_price ~\'1\' }}" '+
//                            ' s ="{{ creatSecret( item.head ~ item.a_price ~\'1\' ) }}" ' + 
//                            ' hide_this_on_click="da" ' + 
//                            ' show_id_defore_click="but_ok_'+val.PriceListDiscountCode+'" ' + 
//                            ' >  ' +
//                        ' <span class=""> ' + 
//                            ' Добавить в&nbsp;корзину ' + 
//                        ' </span> ' + 
//                    ' </button> ' + 
//                    ' <a href="/show/cart/" class="addcart-ver2 ok btn btn-success" '+
//                    ' id="but_ok_'+ val.PriceListDiscountCode +'" style="margin-top:0;display:none;" >  ' + 
//                        ' В&nbsp;корзине ' + 
//                    ' </a> ' + 
//                ' </center> ' + 

                                    '</td>' +
                                    '</tr>'
                                    );
                        });

                        var $j = [];

                        $('#show__search_tov_other_shop').show('slow');
                        
                    }
                    // else{
                    //     $('#show__search_loading').hide('slow');
                    // }

                    $('#show__search_loading').hide('slow');

//s class addcart-ver2 shop__add_to_cart xaddToCart xbtn xbtn-default glob.js.js:176:37
//s style width: auto; xdisplay: inline-block; margin:0 auto; glob.js.js:176:37
//s action add_item_to_cart glob.js.js:176:37
//s aj_kolvo 1 glob.js.js:176:37
//s aj_name АМОРТИЗАТОР ПОДВЕСКИ ПЕР R ГАЗ -334331- TO RAV4 #A20-21 00-05 JUST DRIVE (JD) glob.js.js:176:37
//s aj_opis заказ автосейлз № 556868 / АМОРТИЗАТОР ПОДВЕСКИ ПЕР R ГАЗ -334331- TO RAV4 #A20-21 00-05 JUST DRIVE (JD) / доставка 9 / цена 4152 glob.js.js:176:37
//s aj_kod 556868 glob.js.js:176:37
//s aj_a_price 4152 glob.js.js:176:37
//s hide_this_on_click da glob.js.js:176:37
//s show_id_defore_click but_ok_556868


//s class addcart-ver2 shop__add_to_cart xaddToCart xbtn xbtn-default glob.js.js:176:37
//s style width: auto; xdisplay: inline-block; margin:0 auto; glob.js.js:176:37
//s action add_item_to_cart glob.js.js:176:37
//s aj_comment <empty string> glob.js.js:176:37
//+s aj_id 138 glob.js.js:176:37
//s aj_head Амортизатор передний правый Tiggo/X60 glob.js.js:176:37
//+s aj_a_id ЦБ000105 glob.js.js:176:37
//s aj_a_categoryid ЦБ001409 glob.js.js:176:37
//s aj_a_catnumber G32392R glob.js.js:176:37
//s aj_catnumber_search g32392r glob.js.js:176:37
//s aj_a_price 3500 glob.js.js:176:37
//s aj_a_in_stock 1 glob.js.js:176:37
//s aj_a_arrayimage <empty string> glob.js.js:176:37
//s aj_add_dt <empty string> glob.js.js:176:37
//s aj_add_who <empty string> glob.js.js:176:37
//s aj_sort 50 glob.js.js:176:37
//s aj_status show glob.js.js:176:37
//s aj_articul2 G32392R glob.js.js:176:37
//s aj_kolvo 1 glob.js.js:176:37
//s id Амортизатор передний правый Tiggo/X6035001 glob.js.js:176:37
//s s 9935ffc674708d3e5c1b62f189871ea9 glob.js.js:176:37
//s hide_this_on_click da glob.js.js:176:37
//s show_id_defore_click but_ok_138














                    // // console.log("shop__change_kolvo 22", $j );

                    // $('#quantity' + item_id).val($j['new_kolvo']);

                    // refreshCartTable();

                    // refreshCart();
                    return true;
                    /*
                     // alert($j.html);
                     if (typeof $div_show !== 'undefined') {
                     $('#' + $div_show).show();
                     }
                     */
                    //                $('#form_ok').hide();
                    //                $('#form_ok').html($j.html + '<br/><A href="">Сделать ещё заявку</a>');
                    //                $('#form_ok').show('slow');
                    //                $('#form_new').hide();
                    //
                    //                $('.list_mag').hide();
                    //                $('.list_mag_ok').show('slow');
                },
            });
        } else {
            // console.log('поиск в других магах не запущен');
        }
        return false;
    };

    search_tov_other_shop(111, 222);
});
