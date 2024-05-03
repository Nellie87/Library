<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Audit;
use Illuminate\Support\Facades\DB;
use App\Models\Categories;
use Illuminate\Support\Facades\Log;
use App\Models\Content;
use App\Models\Classes;
use App\User;
use App\Models\Vendors;
use App\Models\budget;
class VendorController extends Controller
{
    function __construct()
    {
    }
    public function index(Request $request)
    {
        try {
            $list = Vendors::where(['is_deleted'=>0])->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);
           return api_response(200, 'Vendor list successfully fetch', $list);
        } catch (\Exception $ex) {
            Log::Info('Vendor list Exception'.$ex->getMessage());
           return api_response(201, "Vendor list Exception");
        }
    }
    public function detail(Request $request)
    {
        try {
            $vendor =$request->vendor_id;
            $list = Vendors::where('vendors_id',(int)$vendor)->first();
           return api_response(200, 'Vendor list successfully fetch', $list);
        } catch (\Exception $ex) {
            Log::Info('Vendor detail Exception'.$ex->getMessage());
           return api_response(201, "Vendor detail Exception");
        }
    }
    public function add(Request $request){
        try{
            $data = array(
                'name' =>$request->name,
                'phone' =>$request->mobile,
                'email' => $request->email,
                'address' =>$request->address
            );
            $result = Vendors::insert($data);
            return api_response(200,'Vendor successfully added');
        }
        catch(\Exception $ex){
            return api_response(201,'Add vendor exceptions');
        }
    }
    public function edit(Request $request){
        try{
            $where = array(
                'vendors_id'=>$request->vendor_id
            );
            $data = array(
                'name' =>$request->name,
                'phone' =>$request->mobile,
                'email' => $request->email,
                'address' =>$request->address
            );
           
            $result = Vendors::where( array(
                'vendors_id'=>$request->vendor_id
            ))->update($data);
            return api_response(200,'Vendor record updated');
        }
        catch(\Exception $ex){
            return api_response(201,'update vendor Exceptions');
        }
    }
    public function deletevendor(Request $request){
        try{
          
            $data = array(
                'is_deleted' =>1,
            );
           
            $result = Vendors::where( array(
                'vendors_id'=>$request->vendor_id
            ))->update($data);
            return api_response(200,'Vendor record removed');
        }
        catch(\Exception $ex){
            log::info('delete vendor exceptions'.$ex);
            return api_response(201,'delete vendor Exceptions');
        }
    }
    public function budget(Request $request)
    {
        try {
            $list = Budget::paginate($request->per_page_limit, ['*'], 'page', $request->current_page);
           return api_response(200, 'Budget list successfully fetch', $list);
        } catch (\Exception $ex) {
           return api_response(201, "Budget Fetch Exceptions");
        }
    }
    public function budgetdetail(Request $request)
    {
        try {
            $list = Budget::where('budget_id',$request->budget_id)->first();
           return api_response(200, 'Budget list successfully fetch', $list);
        } catch (\Exception $ex) {
           return api_response(201, "Budget Fetch Exceptions");
        }
    }
    public function addbudget(Request $request){
        try{
            $data = array(
                'financial_year' => $request->financial_year,
                'amount' =>$request->amount
            );
            $exists = Budget::where('financial_year',$request->financial_year)->first();
            if($exists){
                $result = Budget::where('financial_year',$request->financial_year)->update(['amount' =>$request->amount]);
                return api_response(200,'Budget successfully updated');
            }else{
                $result = Budget::insert($data);
                return api_response(200,'Budget successfully added');
            }
            
            
        }
        catch(\Exception $ex){
            return api_response(201,'Add Budget exceptions');
        }
    }
    public function editbudget(Request $request){
        try{
            $where = array(
                'budget_id'=>$request->budget_id
            );
            $data = array(
                'financial_year' => $request->financial_year,
                'amount' =>$request->amount
            );
            $result = Budget::where($where)->update($data);
            return api_response(200,'Budget updated successfully');
        }
        catch(\Exception $ex){
            return api_response(201,'update Budget Exceptions');
        }
    }
}
