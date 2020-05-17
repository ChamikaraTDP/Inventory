<?php

namespace App\Providers;

use App\InventoryItem;
use App\Item;
use App\Policies\InvItemPolicy;
use App\Policies\ItemPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        InventoryItem::class => InvItemPolicy::class,
        Item::class => ItemPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('edit_settings', function ($user) {
            return $user->user_type == 'admin';
        });
    }
}
