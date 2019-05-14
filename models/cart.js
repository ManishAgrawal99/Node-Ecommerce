module.exports = function Cart(oldCart){

    //If the oldCart is filled, we use the values already available
    //Else we set an empty object for items and 0 for totalPrice and totalQty
    //If we dont do that, it will remain undefined and we could not increment them

    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item,id){
        var storedItem = this.items[id];

        if(!storedItem){
            storedItem = this.items[id] = {item:item, qty:0, price:0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;

        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }

    //Converting object type to array
    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
};