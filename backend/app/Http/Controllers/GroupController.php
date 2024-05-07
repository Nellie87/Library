<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Groups;
use PHPUnit\TextUI\XmlConfiguration\Group;
use Validator;
class GroupController extends Controller{
    public function __construct()
    {
        
    }
    public function add(Request $request)
    {
        try{

            $validator=  Validator::make($request->all(),[
                'user_id'=> 'required|numeric',
                'topic'=>'required',
                'users'=>'required',
            ]);

            if ($validator->fails()) {
                return api_response(201, 'file field is required',$validator->errors());
            }
            extract($request->all());

            $group = new Groups;
            $group->user_id = $user_id;
            $group->topic = $topic;
            $group->users =$users;
            $group->save();

            return $this->apiResponse('201','Group Successfully Created',$group);
        }
        catch(\Exception $ex){
            return response()->json(['error'=>$ex]);
        }
    }
    public function edit($id,Request $request){

        $validator=  Validator::make($request->all(),[
            'user_id'=> 'required|numeric',
            'topic'=>'required',
            'users'=>'required',
        ]);

        if ($validator->fails()) {
            return api_response(201, 'file field is required',$validator->errors());
        }
        extract($request->all());

        $group = Groups::find($id);
        $group->user_id = $user_id;
        $group->topic = $topic;
        $group->users =$users;
        $group->save();

        return $this->apiResponse('201','Group Successfully Created',$group);
    }
    public function changeStatus($id,Request $request){
        extract($request->all());
        $group = Groups::find($id);
        $group->user_id = $is_blocked;
        $group->save();
        return $this->apiResponse('200','Group status changed',$group);
    }
    public function show($id){
        try{
            $group = Groups::Where(['user_id'=>$id])->get();
            return $this->apiResponse('200','Group List',$group);
        }
        catch(\Exception $ex){
            return response()->json(['error'=>$ex]);
        }
    }
}