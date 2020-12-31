const ShoppingListService = {
  getAllItems(knex) {
    return knex
      .select('*')
      .from('shopping_list');
  },
  getById(knex, id) {
    return knex
      .select('*')
      .from('shopping_list')
      .where('item_id', id)
      .first();
  },
  updateItem(knex, id, updatedValues) {
    return knex
      .select('*')
      .from('shopping_list')
      .where('item_id', id)
      .update(updatedValues);
  }, 
  insertItem(knex, item) {
    return knex
      .into('shopping_list')
      .insert(item)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  deleteItem(knex, item_id) {
    return knex
      .select('*')
      .from('shopping_list')
      .where({ item_id })
      .delete();
  }
};

module.exports = ShoppingListService;