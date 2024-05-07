<?php
    define('MERCHANT_ID', 'kcb_59517002_kes');
    define('PROFILE_ID',  '7F63C645-84F2-4FE7-842F-4F9CDF304813');
    define('ACCESS_KEY',  '8ee7ae4fca00353daedc890dab0b20f7');
    define('SECRET_KEY',  '77927807e30a4600b120e108c1971e05a7ff4b56b2ec45d8a20bd19f2b23ad99b9f774f6999f451a93537e14ebac735367b4a15a6bb54edbb7ff0ea5710a89752ef38849485d49cbb999bd1352907ae36a47a5fa3ad348559eea592513d2bd962d0cc15fd1e1426dbb9ecfced4085eb6d42b04c0a9af456cada198cf9b25df39');

    // DF TEST: 1snn5n9w, LIVE: k8vif92e 
    define('DF_ORG_ID', '1snn5n9w');

    // PAYMENT URL
    define('CYBS_BASE_URL', 'https://testsecureacceptance.cybersource.com');

    define('PAYMENT_URL', CYBS_BASE_URL . '/pay');
    // define('PAYMENT_URL', '/sa-sop/debug.php');

    define('TOKEN_CREATE_URL', CYBS_BASE_URL . '/token/create');
    define('TOKEN_UPDATE_URL', CYBS_BASE_URL . '/token/update');
?>