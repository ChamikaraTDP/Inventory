<!doctype html>
<html>
<head>
    <title>test page</title>
</head>

<body>

    <form id="myForm" action="/add_items" method="POST">
        @csrf
        <label for="myName">Send me your name:</label>
        <br/>
        <input id="myName" name="fname" value="John">
        <input id="myName" name="lname" value="watson">
        <input id="myName" name="age" value="32">
        <br/>
        <input id="myName" name="fname" value="John">
        <input id="myName" name="lname" value="watson">
        <input id="myName" name="age" value="32">
        <br/>
        <input id="myName" name="fname" value="John">
        <input id="myName" name="lname" value="watson">
        <input id="myName" name="age" value="32">
        <br/>
        <input type="submit" value="Send Me!">
    </form>
    <p id="para"></p>


    <script>


        x = sumAll(1, 123, 500, 115, 44, 88);

        function sumAll() {
            let i;
            let sum = 0;
            for (i = 0; i < arguments.length; i++) {
                sum += arguments[i];
            }
            return sum;
        }

        console.log(x);
        /*let person = {
            firstName: "John",
            lastName : "Doe",
            language : "",
           set lang(lang) {
                this.language = lang.toUpperCase();
           }
        };

        // Set an object property using a setter:
        person.lang = "en";

        // Display data from the object:
        console.log(person.language);
        // Define object
        let obj = {counter : 5};

        // Define setters
        Object.defineProperty(obj, "reset", {
            get : function () {this.counter = 0;}
        });
        Object.defineProperty(obj, "increment", {
            get: function () {this.counter++;}
        });
        Object.defineProperty(obj, "decrement", {
            get : function () {this.counter--;}
        });
        Object.defineProperty(obj, "add", {
            set : function (value) {this.counter += value;}
        });
        Object.defineProperty(obj, "subtract", {
            set : function (value) {this.counter -= value;}
        });

        console.log(Object.getOwnPropertyNames(person));
        console.log(Object.getOwnPropertyNames(obj));*/


        // Play with the counter:
        /*console.log(obj.counter);
        obj.reset;
        console.log(obj.counter);
        obj.add = 5;
        console.log(obj.counter);
        obj.subtract = 1;
        console.log(obj.counter);
        obj.increment;
        console.log(obj.counter);
        obj.decrement;
        console.log(obj.counter);*/

    </script>

    {{--<script>
        class Car {
            constructor(manuf){
                this.manufacture = manuf;
            }

            get getMName(){
                return this.manufacture;
            }

            set setMName(manuf){
                this.manufacture = manuf;
            }
        }

        let myCar = new Car('jaguar');

        console.log(myCar.getMName);

    </script>--}}





    {{--<script>

        window.addEventListener('load', function () {

            function sendData() {
                console.log("data sending");

                const XHR = new XMLHttpRequest();

                /*XHR.onreadystatechange = () => {
                    if(this.readyState === 4 && this.readyState === 200) {
                        document.getElementById("para").innerHTML = this.responseText;
                    }
                };*/

                //console.log(form.elements.name.length);

                let js_obj = [];

                const FD = new FormData(form);

                //let no_of_rows = FD.getAll('fname').length;

                for(let i = 0; i < FD.getAll('fname').length; i++) {
                    js_obj.push({
                        'fname': FD.getAll('fname')[i],
                        'lname': FD.getAll('lname')[i],
                        'age': FD.getAll('age')[i]
                    });
                }

                console.log(JSON.stringify(js_obj));


                /*const sales = [100.12, 19.49, 10, 42.18, 99.62];
                const abb = sales.reduce((prev, curr) => prev + curr);
                console.log(abb);*/



                /*const formToJSON_deconstructed = elements => {
                    // This is the function that is called on each element of the array.
                    const reducerFunction = (data, element) => {
                        // Add the current field to the object.
                        data[element.name] = element.value;
                        // For the demo only: show each step in the reducer’s progress.
                        console.log(JSON.stringify(data));
                        return data;
                    };
                    // This is used as the initial value of `data` in `reducerFunction()`.
                    const reducerInitialValue = {};
                    // To help visualize what happens, log the inital value.
                    console.log('Initial `data` value:', JSON.stringify(reducerInitialValue));
                    // Now we reduce by `call`-ing `Array.prototype.reduce()` on `elements`.
                    const formData = [].reduce.call(elements, reducerFunction, reducerInitialValue);
                    // The result is then returned for use elsewhere.
                    return formData;
                };*/

                //formToJSON_deconstructed(form.elements);

                /*let object = {};
                for(let pair of FD.entries()) {
                    console.log(pair[0]);
                    console.log(FD.getAll(key));
                }*/
                /*let json = JSON.stringify(object);
                console.log(json);
                let names = FD.getAll('name');
                console.log(names);*/

                //const serialForm = form.serializeArray();

                /*let urlEncodedData = "",
                    urlEncodedDataPairs = [],
                    key;
                for(key in data) {
                    urlEncodedDataPairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }

                urlEncodedData =  urlEncodedDataPairs.join('&').replace(/%20/g, '+');*/

                XHR.addEventListener('load', function (event) {
                    console.log("loaded");
                    //document.getElementById("para").innerHTML = event.target.responseText;

                });

                XHR.addEventListener('error', function (event) {
                    console.log("something went wrong");
                });

                XHR.open('POST', '{{ route('send_data') }}');

                //XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                XHR.send(FD);


            }

            let form = document.getElementById( "myForm" );

            // ...and take over its submit event.
            form.addEventListener( "submit", function ( event ) {
                event.preventDefault();
                sendData();
            });

        });

    </script>--}}

</body>

</html>
    {{--<div class="action-bar">
        <div class="btn-container">
            <button class="action-btn">Add</button>
            <button class="action-btn">Issue</button>
            <button class="action-btn">View</button>
        </div>
    </div>

    <div class="clearfix">
        <div class="sidenav column">
            <button class="side-btn">Search</button>
            <button class="side-btn">Filter</button>
            <button class="side-btn">Contact</button>
            <button class="side-btn">About</button>
        </div>
        <div class="add-form column">
            <form action="">
                <ol>
                    <li>Date:<input class="add-form-date" type="date"></li>
                    <li>Received From:<input class="add-form-text" type="text"></li>
                    <li>Issue Order No:<input class="add-form-text" type="text"></li>
                </ol>
                <table>
                    <tr>
                        <th>Item Category</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Value</th>
                    </tr>
                    <tr>
                        <td>
                            <select name="cars">
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="fiat">Fiat</option>
                                <option value="audi">Audi</option>
                            </select>
                        </td>
                        <td>
                            <select name="vel">
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="fiat">Fiat</option>
                                <option value="audi">Audi</option>
                            </select>
                        </td>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                    </tr>
                </table>
            </form>
        </div>

        <div class="sidenav-right column">
            <div class="issue-list">Issuing list</div>
            <div>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                    </tr>
                </table>
            </div>
        </div>
    </div>--}}

    {{-- <div class="dropimg">
        <img src="/images/darksiders.jpg" alt="Darksiders" width="100" height="50">
        <div class="dropimg-content">
            <img src="/images/darksiders.jpg" alt="Darksiders" width="300" height="200">
            <div class="desc">War with Chaositter</div>
        </div>
    </div> --}}
