<?php

$vv['in_body_end'][] = '<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>';

if (isset($_POST['io']) && isset($_POST['phone']) && isset($_POST['items']) && !empty($_POST['items'])) {

     // \f\pa($_POST);     die();
    
    $msg = 'Новый заказ'
            . PHP_EOL
            . htmlspecialchars($_REQUEST['io'])
            . PHP_EOL
            . htmlspecialchars($_REQUEST['phone'])
            . PHP_EOL
            . 'Нужна помощь специалиста: '.( isset($_REQUEST['help']) ? 'да' : 'нет' )
            . PHP_EOL
            . 'Ваш город '.htmlspecialchars($_REQUEST['city'])
            . PHP_EOL
            . ( !empty( $_REQUEST['dost'] ) ? PHP_EOL . 'адрес для доставки: '.htmlspecialchars($_REQUEST['dost']) : '' )
            ;

    $summa = 0;

    \Nyos\mod\items::$search['id'] = array_keys($_POST['items']);
    $order_items = \Nyos\mod\items::get($db, '021.items', 'show', 'id_id');
    
//    \f\pa($order_items);
//die();

    foreach ($_POST['items'] as $k => $v) {

        $msg .= PHP_EOL . PHP_EOL . $v 
            . ( $order_items[$k]['a_catnumber'] ? PHP_EOL.$order_items[$k]['a_catnumber'] : '' ) 
            . ( $_POST['opis'][$k] ? PHP_EOL.$_POST['opis'][$k] : '' );

        if (!empty($_POST['price'][$k]) && $_POST['price'][$k] > 0) {
            $msg .= PHP_EOL . $_POST['quantity'][$k] . ' шт. * ' . $_POST['price'][$k] . ' р ( '. ceil($_POST['price'][$k]/120*100) .' ) = ' . ( $_POST['quantity'][$k] * $_POST['price'][$k] ) . ' р';
            $summa += ( $_POST['quantity'][$k] * $_POST['price'][$k] );
        } else {
            $msg .= PHP_EOL . $_POST['quantity'][$k] . ' шт. под заказ';
        }

    }

    $msg .= PHP_EOL . PHP_EOL . 'Итого: ' . number_format($summa, '0', '.', '`') . ' р';
    \nyos\Msg::sendTelegramm($msg, null, 2);

    // die();
    
    $_SESSION['cart'] = [];
    \f\redirect('/', 'index.php', ['level' => 'show', 
        // 'option' => 'cart', 
        'warn_order' => 'Заказ принят, менеджер свяжется с вами для уточнения деталей заказа по указанному номеру телефона: '. htmlspecialchars($_REQUEST['phone']) 
        ]);
}

$vv['tpl_body'] = ( file_exists(dir_site_module_nowlev_tpl . 'body.htm') ? dir_site_module_nowlev_tpl . 'body.htm' : dir_mods_mod_vers_tpl . 'body.htm' );

$vv['in_body_end'][] = '<script src="' . DS . 'vendor' . DS . 'didrive' . DS . 'libs' . DS . 'js' . DS . 'numberformat.js"></script>';
