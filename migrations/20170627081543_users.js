
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("regComplete").defaultTo(0);
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.boolean("regComplete");
  });
};
