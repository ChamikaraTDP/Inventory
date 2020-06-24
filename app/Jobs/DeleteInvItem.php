<?php

namespace App\Jobs;

use App\InventoryItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteInvItem implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $item_id;

    /**
     * Create a new job instance.
     *
     * @param $item_id
     */
    public function __construct($item_id)
    {
        $this->item_id = $item_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $item = InventoryItem::find($this->item_id);
        $item->status = 'Discarded';
        $item->save();
    }
}
