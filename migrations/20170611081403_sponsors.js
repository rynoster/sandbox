
exports.up = function(knex, Promise) {
  return knex.raw("\
    CREATE TABLE sponsors ( \
    sponsorId int(11) unsigned NOT NULL AUTO_INCREMENT, \
    sponsorUrl varchar(50) DEFAULT NULL, \
    sponsorName varchar(50) DEFAULT NULL, \
    sponsorContent text, \
    sponsorTag varchar(15) DEFAULT '', \
    sponsorLevel varchar(10) DEFAULT '', \
    sponsorLogo varchar(50) DEFAULT '', \
    PRIMARY KEY (sponsorId) \
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1; \
  ")

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("sponsors");
};
