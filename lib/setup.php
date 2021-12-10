<?php

namespace Roots\WStheme\Setup;


/*--------------------------------------------------
Inclusione JQUERY
--------------------------------------------------*/
function switch_jquery(){
    if ( !is_admin() ){
        wp_deregister_script('jquery');
        wp_register_script('jquery', ( get_template_directory_uri() . '/dist/js/jquery-2.1.1.min.js'), null, '2.1.1', false);
        wp_enqueue_script('jquery');
        wp_register_script( 'vendor', get_template_directory_uri() . '/dist/js/vendor.min.js', null, '1.0', true );
        wp_enqueue_script( 'vendor' );
    }
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\\switch_jquery', 1);


/*---------------------------------------------------
Including scripts
--------------------------------------------------*/
function include_scripts(){

    if (defined('WP_DEBUG') && true === WP_DEBUG) { //se è in debug mode prende da /src

        /*---------------------------------------------------
        JS LOADER DEBUG ON
        --------------------------------------------------*/
        wp_register_script( 'main', get_template_directory_uri() . '/src/js/main.js', array('vendor'), '1.0', true );
        wp_enqueue_script( 'main' );

    } else { //se non è in debug mode prende da /dist

        /*---------------------------------------------------
        JS LOADER DEBUG OFF
        --------------------------------------------------*/
        wp_register_script( 'main-min', get_template_directory_uri() . '/dist/js/main.min.js', array('vendor'), '1.0', true );
        wp_enqueue_script( 'main-min' );
    }

    /*---------------------------------------------------
    CSS INFO OBJECT
    --------------------------------------------------*/
    if (defined('WP_DEBUG') && true === WP_DEBUG) {
        $mainCss = array(
            'name'      => 'main',
            'url'       => get_template_directory_uri() . '/src/css/main.css',
        );
    } else {
        $mainCss = array(
            'name'      => 'main-min',
            'url'       => get_template_directory_uri() . '/dist/css/main.min.css',
        );
    }

    $loadCssInfo = array(
        // Vendor
        'vendor_css' => array(
            'name'      => 'vendor',
            'url'       => get_template_directory_uri() . '/dist/css/vendor.min.css',
        ),
        // Main CSS
        'style-css' => $mainCss,

    );

    /*---------------------------------------------------
    CSS LOADER
    --------------------------------------------------*/
    foreach ($loadCssInfo as $cssLibrary) {

        // promemoria inclusione js singolo:
        // wp_register_style( 'main-css', get_template_directory_uri() . '/dist/css/main.css'); wp_enqueue_style( 'main-css' );

        wp_register_style( $cssLibrary['name'], $cssLibrary['url']);
        wp_enqueue_style( $cssLibrary['name'] );
    }

}

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\include_scripts' );

