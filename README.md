# node-beerticon

Generate color variation icon from svg.

From SVG files  
```[bottle_heart.svg, bottle_star.svg]```　And identity string

To colored icons
![2015-03-28 16 41 47](https://cloud.githubusercontent.com/assets/1113464/6880207/87201136-d569-11e4-9364-c043588a0f85.png)

The color pattern is determined by the hash of a string(e.g. user_id).  
It can make a unique icon for each user.(However, unlike Identicon, it is easy to collision depending on the svg)

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
|----|----|----|
| sourceSvg | input svg file path(s) ([String] or String) | ['./path/to/input.svg', './second.svg'] |
| size | output image size | {width:128, height:128} |
| replace | function to replace color. It returns Beerticon.Hash or Beerticon.Color data type. | function(str, org){return new Beerticon.Hash(myHash(str));} |

#### Sample for fixing a specific color (background is always white)
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


## LICENSE
The MIT License (MIT)

Copyright (c) 2015 Daishi Nakajima(http://pig-brewing.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
