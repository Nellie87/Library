<?php
// app/Rules/EmailExtension.php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Str;
class EmailExtension implements Rule
{
    public function passes($attribute, $value)
    {
        // Specify your desired email extension here
        return Str::endsWith($value, '@knls.ac.ke');
    }

    public function message()
    {
        return 'Invalid email extension.';
    }
}
