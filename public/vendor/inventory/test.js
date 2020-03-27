var expect = chai.expect;

describe('make_list', function() {
    describe('parameters', function() {
        it('should throw error if no categories passed', function() {
            expect(make_list, 'no error when no categories passed! ').to.throw();
        });
        it('should throw error if category type doesn\'t match', function() {
            expect(() => {
                make_list('str');
            }, 'no error when category type doesn\'t match').to.throw();
        });
    });

    describe('list', function() {
        let cat = [ { id: 111, name: "test1"}, { id: 112, name: "test2"}  ];

        it('should give valid option list ', function() {
            let list = `<option value="${cat[0].id}">${cat[0].name}<option value="${cat[1].id}">${cat[1].name}`;

            expect( make_list(cat), 'output list is not correct! ' ).to.equal(list);
        });
    });
});

/*function myFunc(cond, callback){
    if(cond){
        callback();
    }
}

describe('myFunc', function() {
    it('should call the cb function', function() {
        var call = sinon.spy();

        myFunc(true, call);

        expect(call.calledOnce, 'callback not called once!').to.be.true;
    });
});*/

/*var user = {
    setName: function(name) {
        this.name = name;
    }
};

var nameSpy = sinon.spy(user, 'setName');

//We can call a spy like a function
user.setName('john cina');
user.setName('john noman');

//Now we can get information about the call
console.log(nameSpy.callCount);*/


