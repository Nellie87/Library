<?php

define ('HMAC_SHA256', 'sha256');
define ('SECRET_KEY', '77927807e30a4600b120e108c1971e05a7ff4b56b2ec45d8a20bd19f2b23ad99b9f774f6999f451a93537e14ebac735367b4a15a6bb54edbb7ff0ea5710a89752ef38849485d49cbb999bd1352907ae36a47a5fa3ad348559eea592513d2bd962d0cc15fd1e1426dbb9ecfced4085eb6d42b04c0a9af456cada198cf9b25df39');

function sign ($params) {
  return signData(buildDataToSign($params), SECRET_KEY);
}

function signData($data, $secretKey) {
    return base64_encode(hash_hmac('sha256', $data, $secretKey, true));
}

function buildDataToSign($params) {
        $signedFieldNames = explode(",",$params["signed_field_names"]);
        foreach ($signedFieldNames as $field) {
           $dataToSign[] = $field . "=" . $params[$field];
        }
        return commaSeparate($dataToSign);
}

function commaSeparate ($dataToSign) {
    return implode(",",$dataToSign);
}

?>
