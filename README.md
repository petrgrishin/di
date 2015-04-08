# di
Simple JS dependency injection container

#### Defining services
```js
container.set('storage', function(container) {
    return new Storage;
});

container.set('cache', function(container) {
    return new Cache(container.get('storage'));
});
```

#### Defining factory services
```js
container.set('cache', container.factory(function(container) {
    return new Cache(container.get('storage'));
}));
```

#### Modifying services after definition
```js
container.extend('cache', function(cache, container) {
    cache.setTtl(100);
    return cache;
});
```

#### Defining you factory*
```js
container.protect('cache', function(container) {
    return new Cache(container.get('storage'));
});
```

#### Sample application
```js
var app = new Container;

app.set('app', function(container) {
    return {
        run: function() {
            console.log('App start');
            container.get('table').render();
            container.get('newInstance').render();
            container.get('newInstance').render();
            container.get('newInstance').render();
            container.get('myFactory').render();
            container.get('myFactory').render();
            container.get('myFactory').render();
            console.log('App end');
        }
    };
});

app.set('table', function(container) {
    var row = container.get('row');
    return {
        render: function () {
            row.render(1);
            row.render(2);
            row.render(3);
        },
        setRow: function(value) {
            row = value;
        }
    };
});

app.extend('table', function(table, container) {
    var row2 = container.get('row2');
    table.setRow(row2);
    return table;
});

app.set('newInstance', app.factory(function(container) {
    var random = Math.random();
    return {
        render: function () {
            console.log('newInstance -> ' + random);
        }
    };
}));

app.protect('myFactory', function (container) {
        var random = Math.random();
        return {
            render: function () {
                console.log('instance from my myFactory -> ' + random);
            }
        };
});

app.set('row', function(container) {
    var random = Math.random();
    return {
        render: function (value) {
            console.log('render row: ' + value + ' -> ' + random);
        }
    };
});

app.set('row2', function(container) {
    var random = Math.random();
    return {
        render: function (value) {
            console.log('render row2: ' + value + ' -> ' + random);
        }
    };
});

app.get('app').run();
```
