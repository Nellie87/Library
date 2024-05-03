<!doctype html>
<html lang="en" dir="ltr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="author" content="GeniusOcean">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Title -->
    <title>{{config('app.name')}}</title>
    <!-- favicon -->

    <!-- Bootstrap -->
    <link href="{{asset('public/assets/admin/css/bootstrap.min.css')}}" rel="stylesheet"/>
    <!-- Fontawesome -->
    <link rel="stylesheet" href="{{asset('public/assets/admin/css/fontawesome.css')}}">
    <!-- icofont -->
    <link rel="stylesheet" href="{{asset('public/assets/admin/css/icofont.min.css')}}">
    <!-- Sidemenu Css -->
    <link href="{{asset('public/assets/admin/plugins/fullside-menu/css/dark-side-style.css')}}" rel="stylesheet"/>
    <link href="{{asset('public/assets/admin/plugins/fullside-menu/waves.min.css')}}" rel="stylesheet"/>

    <link href="{{asset('public/assets/admin/css/plugin.css')}}" rel="stylesheet"/>

    <link href="{{asset('public/assets/admin/css/jquery.tagit.css')}}" rel="stylesheet"/>
    <link rel="stylesheet" href="{{ asset('public/assets/admin/css/bootstrap-coloroicker.css') }}">
    <!-- Main Css -->
    <!--Select Picker-->
    <link rel="stylesheet" href="{{asset('public/assets/admin/css/bootstrap-select.min.css')}}" type="text/css">
    <!--Select Picker End-->
    <!-- stylesheet -->
    @if(!empty($adminLang->rtl)&&$adminLang->rtl == 1)

        <link href="{{asset('public/assets/admin/css/rtl/style.css')}}" rel="stylesheet"/>
        <link href="{{asset('public/assets/admin/css/rtl/custom.css')}}" rel="stylesheet"/>
        <link href="{{asset('public/assets/admin/css/rtl/responsive.css')}}" rel="stylesheet"/>
        <link href="{{asset('public/assets/admin/css/common.css')}}" rel="stylesheet"/>
        <link href="{{asset('public/assets/admin/css/customnew.css')}}" rel="stylesheet"/>
    @else
        <link href="{{asset('public/assets/admin/css/style.css')}}" rel="stylesheet"/>
        <link href="{{asset('public/assets/admin/css/custom.css')}}" rel="stylesheet"/>
        <link href="{{asset('public/assets/admin/css/responsive.css')}}" rel="stylesheet"/>
        <link href="{{asset('public/assets/admin/css/common.css')}}" rel="stylesheet"/>
        <link href="{{asset('public/assets/admin/css/customnew.css')}}" rel="stylesheet"/>
        <link href="{{asset('public/css/toaster.css')}}" rel="stylesheet" type="text/css"/>
    @endif

    @if($gs->is_admin_loader == 0)
        <style>
            div#geniustable_processing {
                display: none !important;
            }
        </style>
    @endif
    @yield('styles')

</head>

<body>
<div class="page">
    <div class="page-main">
        <!-- Header Menu Area Start -->
        <div class="header">
            <div class="container-fluid">
                <div class="d-flex justify-content-between">
                    <a class="admin-logo" href="#" target="_blank">

                        <img src="{{asset('assets/images/logo.png')}}" alt=""/>
                    </a>
                    <div class="menu-toggle-button">
                        <a class="nav-link" href="javascript:;" id="sidebarCollapse">
                            <div class="my-toggl-icon">
                                <span class="bar1"></span>
                                <span class="bar2"></span>
                                <span class="bar3"></span>
                            </div>
                        </a>
                    </div>

                    <div class="right-eliment">
                        <ul class="list">

                            <li class="bell-area">
                                <a id="notf_conv" class="dropdown-toggle-1" target="_blank" href="#">
                                    <i class="fas fa-globe-americas"></i>
                                </a>
                            </li>


                            <li class="bell-area">
                                <a id="notf_conv" class="dropdown-toggle-1" href="javascript:;">
                                    <i class="far fa-envelope"></i>
                                    <span data-href="#" id="conv-notf-count">0</span>
                                </a>
                                <div class="dropdown-menu">
                                    <div class="dropdownmenu-wrapper" data-href="#" id="conv-notf-show">
                                    </div>
                                </div>
                            </li>

                            <li class="bell-area">
                                <a id="notf_product" class="dropdown-toggle-1" href="javascript:;">
                                    <i class="icofont-cart"></i>
                                    <span data-href="#" id="product-notf-count">0</span>
                                </a>
                                <div class="dropdown-menu">
                                    <div class="dropdownmenu-wrapper" data-href="#" id="product-notf-show">
                                    </div>
                                </div>
                            </li>

                            <li class="bell-area">
                                <a id="notf_user" class="dropdown-toggle-1" href="javascript:;">
                                    <i class="far fa-user"></i>
                                    <span data-href="#" id="user-notf-count">0</span>
                                </a>
                                <div class="dropdown-menu">
                                    <div class="dropdownmenu-wrapper" data-href="#" id="user-notf-show">
                                    </div>
                                </div>
                            </li>

                            {{--                                    <li class="bell-area">--}}
                            {{--                                        <a id="notf_order" class="dropdown-toggle-1" href="javascript:;">--}}
                            {{--                                            <i class="far fa-newspaper"></i>--}}
                            {{--                                            <span data-href="#" id="order-notf-count">0</span>--}}
                            {{--                                        </a>--}}
                            {{--                                        <div class="dropdown-menu">--}}
                            {{--                                            <div class="dropdownmenu-wrapper" data-href="#" id="order-notf-show">--}}
                            {{--                                            </div>--}}
                            {{--                                        </div>--}}
                            {{--                                    </li>--}}

                            <li class="login-profile-area">
                                <a class="dropdown-toggle-1" href="javascript:;">
                                    <div class="user-img">
                                        <img
                                            src="{{ Auth::guard('admin')->user()->photo ?checkUserImage(Auth::guard('admin')->user()->photo,'admin'):asset('assets/images/noimage.png') }}"
                                            alt="">
                                    </div>
                                </a>
                                <div class="dropdown-menu">
                                    <div class="dropdownmenu-wrapper">
                                        <ul>
                                            <h5>{{ __('Welcome!') }}</h5>
                                            <li>
                                                <a href="{{ route('admin.profile') }}"><i
                                                        class="fas fa-user"></i> {{ __('Edit Profile') }}</a>
                                            </li>
                                            <li>
                                                <a href="{{ route('admin.password') }}"><i
                                                        class="fas fa-cog"></i> {{ __('Change Password') }}</a>
                                            </li>
                                            <li>
                                                <a href="{{ route('admin.logout') }}"><i
                                                        class="fas fa-power-off"></i> {{ __('Logout') }}</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- Header Menu Area End -->
        <div class="wrapper">
            <!-- Side Menu Area Start -->
            <nav id="sidebar" class="nav-sidebar">
                <ul class="list-unstyled components" id="accordion">
                    <li>
                        <a href="{{ route('admin.dashboard') }}" class="wave-effect"><i
                                class="fa fa-home mr-2"></i>{{ __('Dashboard') }}</a>
                    </li>
                    @if(Auth::guard('admin')->user()->IsSuper())
                        @include('includes.admin.roles.super')
                    @else
                        @include('includes.admin.roles.normal')
                    @endif

                </ul>

            </nav>
            <!-- Main Content Area Start -->
        @yield('content')
        <!-- Main Content Area End -->
        </div>
    </div>
</div>
<!-- Dashboard Core -->
<script src="{{asset('public/assets/admin/js/popper.min.js')}}"></script>
<script src="{{asset('public/assets/admin/js/vendors/jquery-1.12.4.min.js')}}"></script>
<script src="{{asset('public/assets/admin/js/vendors/vue.js')}}"></script>
<script src="{{asset('public/assets/admin/js/vendors/bootstrap.min.js')}}"></script>
<script src="{{asset('public/assets/admin/js/jqueryui.min.js')}}"></script>
<script src="{{asset('public/assets/admin/js/bootstrap-select.min.js')}}"></script>
<!-- Fullside-menu Js-->
<script src="{{asset('public/assets/admin/plugins/fullside-menu/jquery.slimscroll.min.js')}}"></script>
<script src="{{asset('public/assets/admin/plugins/fullside-menu/waves.min.js')}}"></script>
<script src="{{asset('public/assets/admin/js/plugin.js')}}"></script>
<script src="{{asset('public/assets/admin/js/Chart.min.js')}}"></script>
<script src="{{asset('public/assets/admin/js/tag-it.js')}}"></script>
<script src="{{asset('public/assets/admin/js/nicEdit.js')}}"></script>
<script src="{{asset('public/assets/admin/js/bootstrap-colorpicker.min.js') }}"></script>
<script type="text/javascript" src="{{ asset('public/js/jsvalidation.js') }}"></script>
<script src="{{ asset('public/js/toastr.min.js') }}"></script>
<script src="{{ asset('public/js/bootbox.min.js') }}"></script>
<script src="{{ asset('public/assets/admin/js/notify.js') }}"></script>

<script src="{{asset('public/assets/admin/js/jquery.canvasjs.min.js')}}"></script>

<script src="{{asset('public/assets/admin/js/load.js')}}"></script>
<!-- Custom Js-->
<script src="{{asset('public/assets/admin/js/custom.js')}}"></script>
<!-- AJAX Js-->
<script>var admin_loader = "{{$gs->admin_loader}}";</script>
<script src="{{asset('public/assets/admin/js/myjs.js')}}"></script>
@yield('scripts')


<script src="{{ asset('public/js/toaster.js')}}"></script>
<script>
    {{--alert("{{ Session::get('message') }}");--}}
    @if(Session::has('message'))
    var type = "{{ Session::get('alert-type', 'info') }}";
    switch (type) {
        case 'info':
            toastr.info("{{ Session::get('message') }}");
            break;
        case 'warning':
            toastr.warning("{{ Session::get('message') }}");
            break;
        case 'success':
            toastr.success("{{ Session::get('message') }}");
            break;
        case 'error':
            toastr.error("{{ Session::get('message') }}");
            break;
    }
    @endif
</script>
<!-----------------------------------error message------------------------------------->
@if ($errors->any())
    @foreach ($errors->all() as $error)
        <script>
            $(document).ready(function () {
                toastr.error('{{$error}}');
            });
        </script>
    @endforeach
@endif
<script>
    $('.selectpicker').selectpicker();
</script>
</body>
</html>
{{--<script>--}}
{{--    function successToaster(message) {--}}
{{--        toastr.remove();--}}
{{--        toastr.options.closeButton = true;--}}
{{--        toastr.success(message, '', {timeOut: 5000});--}}
{{--    }--}}

{{--    function errorToaster(message) {--}}
{{--        toastr.remove();--}}
{{--        toastr.options.closeButton = true;--}}
{{--        toastr.error(message, '', {timeOut: 5000});--}}
{{--    }--}}
{{--</script>--}}
{{--@if(session()->has('success'))--}}
{{--    <script>--}}
{{--        $(document).ready(function () {--}}
{{--            successToaster("{!! session('success') !!}");--}}
{{--        });--}}
{{--    </script>--}}
{{--@endif--}}
{{--@if(session()->has('error'))--}}
{{--    <script>--}}
{{--        $(document).ready(function () {--}}
{{--            errorToaster("{!! session('error') !!}");--}}
{{--        });--}}
{{--    </script>--}}
{{--@endif--}}
