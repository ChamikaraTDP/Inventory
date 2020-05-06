@extends('layouts.app')

@section('content')

    <div class="container">
        <div class="columns is-centered">
           <div class="column is-7">
               <form id="new_item_form">
                   @csrf
                   <div class="card">
                       <div class="card-header">
                           <p class="card-header-title title is-3">
                               Add New Item
                           </p>
                       </div>
                       <div class="card-content">
                           <div class="field">
                               <label class="label">Item Name</label>
                               <div class="control">
                                   <input class="input" name="name" type="text" placeholder="Text input" required>
                               </div>
                           </div>
                           <div class="field">
                               <label class="label">Category</label>
                               <div class="control">
                                   <div class="select">
                                       <select name="category" required>
                                           @foreach($categories as $category)
                                                <option value={{ $category->id }}>{{ $category->name }}</option>
                                           @endforeach
                                       </select>
                                   </div>
                               </div>
                           </div>
                           <div class="field">
                               <label class="label">Item Type</label>
                               <div class="control">
                                   <label class="radio">
                                       <input type="radio" name="type" value="1" required>
                                       Inventory
                                   </label>
                                   <label class="radio">
                                       <input type="radio" name="type" value="0">
                                       Bulk
                                   </label>
                               </div>
                           </div>
                       </div>
                       <div class="card-footer">
                           <div class="field card-footer-item">
                               <div class="control">
                                   <button class="button is-link" type="submit">Submit</button>
                               </div>
                           </div>
                           <div class="field card-footer-item">
                               <div class="control">
                                   <a class="button is-link is-light" href="{{ route('inventory') }}">Cancel</a>
                               </div>
                           </div>
                       </div>
                   </div>
                </form>
           </div>
        </div>
    </div>

    <div id="model" class="modal">
        <div class="modal-background"></div>
        <div class="modal-content" style="background-color: ghostwhite; padding: 2rem">
            <span class="icon is-medium">
                <i class="fas fa-check"></i>
            </span>
            <span class="title is-5">Item Added Successfully!</span>
        </div>
        <button id="model_close" class="modal-close is-large" type="button" aria-label="close"></button>
    </div>

    <script>
        const form = document.getElementById('new_item_form');
        const model = document.getElementById('model');

        model.querySelector('div.modal-background').addEventListener('click', function() {
            model.classList.toggle('is-active');
        });

        model.querySelector('#model_close').addEventListener( 'click', function() {
            model.classList.toggle('is-active');
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const req = new XMLHttpRequest();

            req.onload = function(event) {
                if(event.target.status === 200) {
                    model.classList.toggle('is-active');
                }
                else {
                    alert("Error occurred" + req.status);
                }
            };

            req.open('POST', '{{ route('item_create') }}');

            req.send( new FormData(form) );

        });
    </script>

@endsection
