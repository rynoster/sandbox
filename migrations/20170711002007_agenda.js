
exports.up = function(knex, Promise) {
  return knex.raw("\
    CREATE TABLE agenda ( \
  id int(11) unsigned NOT NULL AUTO_INCREMENT, \
  title varchar(200) NOT NULL DEFAULT '', \
  tabName varchar(50) DEFAULT NULL, \
  location varchar(100) NOT NULL DEFAULT '', \
  imageUrl varchar(150) DEFAULT NULL, \
  timeStart time DEFAULT NULL, \
  timeEnd time DEFAULT NULL, \
  content text NOT NULL, \
  speakerId int(11) DEFAULT NULL, \
  parentId int(11) DEFAULT NULL, \
  PRIMARY KEY (id) \
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1; \
  ") 
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("agenda");
};
