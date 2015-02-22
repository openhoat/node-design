# node design

Collection of thoughts and notes about nodejs usual mistakes and misunderstood points, for educational purpose.

## Prerequisite

To play, you first need to install a few dependencies :

```
npm install
```

## Server listening

Usual mistake :

```javascript
server.listen(port);
console.log('server listening on port %s', port);
```

Most of the time this code falls running...

### Why ?