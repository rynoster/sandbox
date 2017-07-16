
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("cardPrinted");
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.dropColumn("cardPrinted");
  });
};
