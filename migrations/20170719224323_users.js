
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.integer("block1");
    table.integer("block2");
    table.integer("block3");
    table.integer("block4");
    table.integer("block5");
    table.integer("block6");
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table){
    table.dropColumn("block1");
    table.dropColumn("block2");
    table.dropColumn("block3");
    table.dropColumn("block4");
    table.dropColumn("block5");
    table.dropColumn("block6");
  });
};
