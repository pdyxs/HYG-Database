import fs from 'fs';
import util from 'util';
import {parse_sv, parse_column, to_sv} from './processing';
const fs_readFile = util.promisify(fs.readFile);
const fs_writeFile = util.promisify(fs.writeFile);

// import { FILENAME, SEPARATOR, processors } from
//   './processHYGData';

const HYGFilename = './hygdata_v3.csv';
const OutFilename = './hygdata_v3-ext.csv';

const IAUFilename = './IAU-CSN.txt';

Promise.all([
  fs_readFile(HYGFilename, 'utf-8'),
  fs_readFile(IAUFilename, 'utf-8')
]).then(([HYG, IAU]) => {
  var starData = parse_sv(HYG);
  var nameData = parse_column(IAU);

  _.forEach(nameData.rows, name => {
    var star = null;
    if (name.Designation.startsWith("HR")) {
      var hrid = Number(name.Designation.substring(3));
      star = _.find(starData.rows, s => s.hr == hrid);
    } else if (name.Designation.startsWith("GJ")) {
      var gjid = Number(name.Designation.substring(3));
      star = _.find(starData.rows, s => s.gl == `Gl ${gjid}`);
    } else if (name.Designation.startsWith("HD")) {
      var hdid = Number(name.Designation.substring(3));
      star = _.find(starData.rows, s => s.hd == hdid);
    }
    if (!star)
      console.log(`Not found: ${name.Name} ${name.Designation} ${name.IDa} ${name.IDb}`)
    else {
      star.proper = name.Name;
      star.data.proper = name.Name;
    }

  })
  return fs_writeFile(OutFilename, to_sv(starData));
});
