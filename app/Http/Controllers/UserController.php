<?php

namespace App\Http\Controllers;

use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use function React\Promise\reject;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('can:edit_settings');
    }


    public function create(Request $request)
    {
        $user = new User;
        $user->name = $request->name;
        $user->username = $request->username;
        $user->user_type = $request->user_type;
        $user->station_id = $request->station_id;
        $user->password = Hash::make($request->password);
        $user->save();
    }


    public function index()
    {
        $users = User::with('station:id,name')->get();

        return $users;
    }


    public function update(Request $request)
    {
        $user = User::find($request->id);

        $user->name = $request->name;
        $user->station_id = $request->station_id;
        $user->user_type = $request->user_type;

        if($request->has('username')){
            $user->username = $request->username;
        }

        if($request->has('password')){
            $user->password = Hash::make($request->password);
        }

        $user->save();
    }


    public function delete(Request $request) {
        $user = User::find($request->id);

        try{
            $user->delete();
        }
        catch (Exception $error) {
            try {
                $user->user_type = 'guest';
                $user->save();
            }
            catch (Exception $exp){
                abort(500, $exp->getMessage());
            }
        }
    }


}
