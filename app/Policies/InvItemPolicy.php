<?php

namespace App\Policies;

use App\InventoryItem;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InvItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any inventory items.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the inventory item.
     *
     * @param  \App\User  $user
     * @param  \App\InventoryItem  $inventoryItem
     * @return mixed
     */
    public function view(User $user, InventoryItem $inventoryItem)
    {
        //
    }

    /**
     * Determine whether the user can create inventory items.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->station_id === 1;
    }

    /**
     * Determine whether the user can update the inventory item.
     *
     * @param  \App\User  $user
     * @param  \App\InventoryItem  $inventoryItem
     * @return mixed
     */
    public function update(User $user, InventoryItem $inventoryItem)
    {
        //
    }

    /**
     * Determine whether the user can delete the inventory item.
     *
     * @param  \App\User  $user
     * @param  \App\InventoryItem  $inventoryItem
     * @return mixed
     */
    public function delete(User $user, InventoryItem $inventoryItem)
    {
        //
    }

    /**
     * Determine whether the user can restore the inventory item.
     *
     * @param  \App\User  $user
     * @param  \App\InventoryItem  $inventoryItem
     * @return mixed
     */
    public function restore(User $user, InventoryItem $inventoryItem)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the inventory item.
     *
     * @param  \App\User  $user
     * @param  \App\InventoryItem  $inventoryItem
     * @return mixed
     */
    public function forceDelete(User $user, InventoryItem $inventoryItem)
    {
        //
    }
}
