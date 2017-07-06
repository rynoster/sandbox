
exports.up = function(knex, Promise) {
  return knex.raw("\
    CREATE TABLE speakers ( \
  id int(11) unsigned NOT NULL AUTO_INCREMENT, \
  fullName varchar(100) NOT NULL DEFAULT '', \
  companyName varchar(100) NOT NULL DEFAULT '', \
  bio text NOT NULL, \
  PRIMARY KEY (id) \
) ENGINE=InnoDB DEFAULT CHARSET=latin1; \
  ") 
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("speakers");
};
