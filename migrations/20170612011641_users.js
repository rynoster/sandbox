
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.string("accountManager", 45);
    table.string("orgRole", 50);
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.dropColumn("accountManager");
    table.dropColumn("orgRole");
  });
};
