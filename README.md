node design
===========

Collection of thoughts and notes about nodejs usual mistakes and misunderstood points, for educational purpose.

![Oh no!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/oh-no.jpg)

This project only provides markdown contents to explain problems and solutions, and samples of code to illustrate them.

Prerequisite
------------

If you wanna play with the [provided samples](https://github.com/openhoat/node-design/tree/master/samples), you first need to install a few dependencies :

```bash
$ npm install
```

Use cases
---------

1. [don't lie with server listening](docs/server-listening.md)
2. [var keyword good place](docs/var.md)
3. [let console.log be your friend](docs/console.md)
4. [public/private in module](docs/module-private.md)
5. [definitely kill the callback hell](docs/callback-hell.md)
6. [the options callback idiom to the rescue](docs/options-cb.md)

coming soon :

- [efficient design for a server component](docs/server.md)
- [mocha loves promises](docs/mocha-promises.md)

Enjoy !