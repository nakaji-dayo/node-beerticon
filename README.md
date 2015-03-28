# node-beerticon

Generate color variation icon from svg.

From SVG files  
```[bottle_heart.svg, bottle_star.svg]```

To colored icons
![2015-03-28 16 41 47](https://cloud.githubusercontent.com/assets/1113464/6880207/87201136-d569-11e4-9364-c043588a0f85.png)

## install
```npm install beerticon```

## usage

### buffer
```
var beerticon = new (require('beerticon'))();
beerticon.generate(user.nickname, function(err, buffer) {
  res.send(buffer);
});
```

### output to file
```
(new Beerticon()).generateFile('tmp.png' , console.log);
```

### use Settings
```
new Beerticon({
    sourceSvg: './test/test.svg',
    size: {width: 32, height: 32}
})
```
#### Settings
| name | description | example |
| -- | -- | -- |
| sourceSvg | input svg file path(s) ([String] or String) | './path/to/input.svg' |
| size | output image size | {width:128, height:128} |
| replace | function to replace color. It returns Beerticon.Hash or Beerticon.Color data type. | function(str, org){return new Beerticon.Hash(myHash(str));} |

#### Sample for fixing a specific color
```
new Beerticon({
    replace: function(str, org){
        if (org == "#42F2F3") {
            return new Beerticon.Color('rgb(255,255,255)');
        } else {
            return Beerticon.defaultSettings.replace(str, org);
        }
    }
});
```
