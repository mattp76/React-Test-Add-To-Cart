var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign  = require('react/lib/Object.assign');

var CHANGE_EVENT = "change";

var _catalog = [];

for(var i=1; i<9; i++){
  _catalog.push({
    'id': 'Widget' +i,
    'title':'Widget #' + i,
    'summary': 'This is an awesome widget!',
    'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, commodi.',
    'img': 'http://placehold.it/300x250&text=image 1',
    'cost': i
  });
}

var _cartItems = [];

function _removeItem(index){
	_cartItems[index].inCart = false;
	_cartItems.splice(index, 1);
}

function _increaseItem(index){
    console.log('increasing');
	_cartItems[index].qty++;
}

function _decreaseItem(index){
   if(_cartItems[index].qty>1) {
	 _cartItems[index].qty--;
	} else {
	 _removeItems(index);
	}
}

function _addItem(item){
   if(!item.inCart) {
	   item['qty'] = 1;
	   item['inCart'] = true;
	   _cartItems.push(item);
	} else {
	 _cartItems.forEach(function(cartItem, i) {
		if(cartItem.id===item.id) {
		_increaseItem(i);
	   }
	 }); 
   }
}


var AppStore = assign(new EventEmitter(), {
	emitChange:function(){
		this.emit(CHANGE_EVENT)
	},
	addChangeListener:function(callback){
		this.on(CHANGE_EVENT, callback)
	},
	removeChangeListener:function(callback){
	   this.removeListener(CHANGE_EVENT, callback)
	},
	getCart:function() {
		return _cartItems
	},
	getCatalog:function(){
	   
		return _catalog
	},
	
	dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
	
	console.log('HELLO MATTY', payload);
	
    switch(action.actionType){
      case AppConstants.ADD_ITEM:
        _addItem(payload.action.item);
        break;

      case AppConstants.REMOVE_ITEM:
        _removeItem(payload.action.index);
        break;

      case AppConstants.INCREASE_ITEM:
        _increaseItem(payload.action.index);
        break;

      case AppConstants.DECREASE_ITEM:
        _decreaseItem(payload.action.index);
        break;
    }
    AppStore.emitChange();

    return true;
  })
	
	
})

module.exports = AppStore;

