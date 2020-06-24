<?php

namespace App\Jobs;

use App\InventoryItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateInvItem implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $item_id;
    protected $item_status;

    /**
     * Create a new job instance.
     *
     * @param $item_id
     * @param $item_status
     */
    public function __construct($item_id, $item_status)
    {
        $this->item_id = $item_id;
        $this->item_status = $item_status;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $item = InventoryItem::find($this->item_id);
        $item->status = $this->item_status;
        $item->save();
    }
}
