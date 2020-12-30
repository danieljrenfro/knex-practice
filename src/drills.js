require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function getAllItemsWithText(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

// getAllItemsWithText('bacon');

function paginateItems(pageNumber) {
  const productsPerPage = 6; 
  const offset = 6 * (pageNumber - 1);

  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

// paginateItems(1);

function getItemsAddedAfterDate(daysAgo) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::Interval`, daysAgo)
    )
    .then(results => {
      console.log(results);
    });
}

// getItemsAddedAfterDate(3);

function getTotalCostPerCategory() {
  knexInstance
    .select('category')
    .sum('price AS total_price')
    .from('shopping_list')
    .groupBy('category')
    .orderBy([
      { column: 'total_price', order: 'DESC' }
    ])
    .then(result => {
      console.log(result);
    });
}

getTotalCostPerCategory();




