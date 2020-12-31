const { expect } = require('chai');
const knex = require('knex');
const ShoppingListService = require('../src/shopping-list-service');

describe.only('Shopping List Service object', function() {
  let db;
  let testItems = [
    {
      item_id: 1,
      name: 'First Test Item',
      price: '1.11',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
    {
      item_id: 2,
      name: 'Second Test Item',
      price: '2.22',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
    {
      item_id: 3,
      name: 'Third Test Item',
      price: '3.33',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    }
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db('shopping_list').truncate());

  afterEach(() => db('shopping_list').truncate());

  after(() => db.destroy());

  context(`Given 'shopping_list' table has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems);
    });

    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testItems);
        });
    });

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const itemId = 3;
      const expectedItem = testItems[itemId - 1];
      
      return ShoppingListService.getById(db, itemId)
        .then(actual => {
          expect(actual).to.eql(expectedItem);
        });
    });

    it(`updateItem() updates an item by id from 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const expectedItem = testItems[idOfItemToUpdate - 1];
      const updateData = {
        name: 'Updated Name',
        price: '4.00',
      };

      return ShoppingListService.updateItem(db, idOfItemToUpdate, updateData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            item_id: expectedItem.item_id,
            date_added: expectedItem.date_added,
            checked: expectedItem.checked,
            category: expectedItem.category,
            ...updateData
          });
        });
    });
  
    it(`deleteItem() deletes an item by id from 'shopping_list' table`, () => {
      const idOfItemToDelete = 3;

      return ShoppingListService.deleteItem(db, idOfItemToDelete)
        .then(() => ShoppingListService.getAllItems(db))
        .then(items => {
          const expected = testItems.filter(item => item.item_id !== idOfItemToDelete);
          expect(items).to.eql(expected);
        });
    });
  });

  context(`Given 'shopping_list' table has no data`, () => {
    before(() => db('shopping_list').truncate());

    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });

    it(`insertItem() inserts a new item into 'shopping_list' table and resolves the new item with an id`, () => {
      const newItem = {
        name: 'First Test Item',
        price: '1.11',
        date_added: new Date('2029-01-22T16:28:32.615Z'),
        checked: false,
        category: 'Main'
      };

      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            item_id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: newItem.date_added,
            checked: newItem.checked,
            category: newItem.category
          });
        });
    });
  });

});
