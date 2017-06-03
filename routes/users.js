var express = require('express');
var router = express.Router();

var app = express();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(users);
});

router
  .get('/register', (req, res) => {
    res.send("Register page")
  })
  .get("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id == id);

    if (user) {
      res.send(user);
    } else {
      res.status(404).send('User does not exist');
    }
  })
  .delete("/:id", (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(user => user.id == id);

    if (index > -1){
      users.splice(index, 1);
      res.sendStatus(200);
    } else {
      res.status(404).send('User ${id} does not exist');
    }
  })



module.exports = router;

var users = [
  {
  "id": 1,
  "first_name": "Lacee",
  "last_name": "Shickle",
  "email": "lshickle0@addthis.com",
  "gender": "Female",
  "ip_address": "119.104.47.216"
}, {
  "id": 2,
  "first_name": "Weston",
  "last_name": "Shasnan",
  "email": "wshasnan1@mtv.com",
  "gender": "Male",
  "ip_address": "5.244.100.5"
}, {
  "id": 3,
  "first_name": "Wrennie",
  "last_name": "Ferrierio",
  "email": "wferrierio2@alexa.com",
  "gender": "Female",
  "ip_address": "9.186.173.251"
}, {
  "id": 4,
  "first_name": "Lewie",
  "last_name": "Antal",
  "email": "lantal3@google.pl",
  "gender": "Male",
  "ip_address": "55.118.113.123"
}, {
  "id": 5,
  "first_name": "Pattie",
  "last_name": "Wade",
  "email": "pwade4@facebook.com",
  "gender": "Male",
  "ip_address": "71.51.116.19"
}, {
  "id": 6,
  "first_name": "Marika",
  "last_name": "Baumer",
  "email": "mbaumer5@disqus.com",
  "gender": "Female",
  "ip_address": "252.42.246.32"
}, {
  "id": 7,
  "first_name": "Cecily",
  "last_name": "Finders",
  "email": "cfinders6@bizjournals.com",
  "gender": "Female",
  "ip_address": "46.186.72.205"
}, {
  "id": 8,
  "first_name": "Krissie",
  "last_name": "Gosney",
  "email": "kgosney7@adobe.com",
  "gender": "Female",
  "ip_address": "157.59.14.51"
}, {
  "id": 9,
  "first_name": "Lydon",
  "last_name": "Cattow",
  "email": "lcattow8@uiuc.edu",
  "gender": "Male",
  "ip_address": "76.153.219.226"
}, {
  "id": 10,
  "first_name": "Cosette",
  "last_name": "Dumigan",
  "email": "cdumigan9@pcworld.com",
  "gender": "Female",
  "ip_address": "65.1.217.177"
}, {
  "id": 11,
  "first_name": "Adolpho",
  "last_name": "Bembrick",
  "email": "abembricka@si.edu",
  "gender": "Male",
  "ip_address": "176.211.189.225"
}, {
  "id": 12,
  "first_name": "Stavros",
  "last_name": "Aronstein",
  "email": "saronsteinb@bbb.org",
  "gender": "Male",
  "ip_address": "9.187.251.136"
}, {
  "id": 13,
  "first_name": "Tomasine",
  "last_name": "Drever",
  "email": "tdreverc@google.it",
  "gender": "Female",
  "ip_address": "25.90.53.209"
}, {
  "id": 14,
  "first_name": "Kayne",
  "last_name": "Jirzik",
  "email": "kjirzikd@a8.net",
  "gender": "Male",
  "ip_address": "134.220.42.10"
}, {
  "id": 15,
  "first_name": "Arlen",
  "last_name": "Buglar",
  "email": "abuglare@vkontakte.ru",
  "gender": "Male",
  "ip_address": "49.143.45.56"
}, {
  "id": 16,
  "first_name": "Bride",
  "last_name": "Rountree",
  "email": "brountreef@sciencedirect.com",
  "gender": "Female",
  "ip_address": "130.92.115.156"
}, {
  "id": 17,
  "first_name": "Iggie",
  "last_name": "Lytlle",
  "email": "ilytlleg@indiegogo.com",
  "gender": "Male",
  "ip_address": "42.92.29.168"
}, {
  "id": 18,
  "first_name": "Stacie",
  "last_name": "Kibel",
  "email": "skibelh@usda.gov",
  "gender": "Female",
  "ip_address": "229.217.242.205"
}, {
  "id": 19,
  "first_name": "Arte",
  "last_name": "Deeks",
  "email": "adeeksi@qq.com",
  "gender": "Male",
  "ip_address": "237.163.175.253"
}, {
  "id": 20,
  "first_name": "Jolene",
  "last_name": "Blondelle",
  "email": "jblondellej@netscape.com",
  "gender": "Female",
  "ip_address": "65.196.231.12"
}
]
