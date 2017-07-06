
exports.up = function(knex, Promise) {
  return knex.schema.table("speakers", function(table){
    table.string("twitter", 50);
    table.string("email", 50);
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("speakers", function(table){
    table.dropColumn("twitter");
    table.dropColumn("email");
  });
};
