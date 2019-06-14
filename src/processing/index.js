import _ from 'lodash';

export function parse_column(data, separator = ' ') {
  var lines = data.split("\n");

  lines = _.filter(lines, l => !l.startsWith("#"));

  var colNames = [];
  var columnLine = lines[0];
  var columns = _.map(_.words(columnLine, /[^, ]+ +/g), cn => new Column(cn));

  lines = _.tail(lines);

  var rows = _.reduce(lines, (acc, line) => {
    var remainingLine = line;
    line = new Row(_.map(columns, col => {
      var ret = remainingLine.substring(0, col.length);
      remainingLine = remainingLine.substring(col.length);
      return ret;
    }), columns);
    if (line.isValid) {
      acc.push(line);
    }
    return acc;
  }, []);

  return {columns, rows};
}

export function parse_sv(data, separator = ',') {
  var lines = data.split("\n");

  var columns = _.map(lines[0].split(separator), cn => new Column(cn));
  lines = _.tail(lines);

  var rows = _.reduce(lines, (acc, line) => {
    line = new Row(line.split(separator), columns);
    if (line.isValid) {
      acc.push(line);
    }
    return acc;
  }, []);

  return {columns, rows};
}

export function to_sv({columns, rows}, separator = ',') {
  return _.join(_.map(columns, 'name'), separator) + "\n" +
    _.join(_.map(rows, r => _.map(columns, c => r.data[c.name])), "\n") + "\n";
}

class Column {
  constructor(string) {
    this.length = string.length;
    this.name = string.trim();
  }
}

class Row {
  constructor(fields, columns) {
    if (fields.length != columns.length || _.every(fields, f => f.trim().length == 0)) {
      this.isValid = false;
      return;
    }
    this.isValid = true;
    this.data = {};
    _.forEach(fields, (s,i) => {
      var data = s.trim();
      var vdata = data;
      if (vdata == 'null') {
        vdata = null;
      }
      var nData = _.toNumber(vdata);
      this.data[columns[i].name] = data;
      this[columns[i].name] = nData || vdata;
    });
  }

  get(col) {
    return this.data[col.name];
  }
}
