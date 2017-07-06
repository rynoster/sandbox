
exports.up = function(knex, Promise) {
  return knex.schema.table("speakers", function(table){
    table.string("imageUrl", 100);
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("speakers", function(table){
    table.dropColumn("imageUrl");
  });
};
