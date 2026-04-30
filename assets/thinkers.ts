import antiquity from './eras/antiquity.json';
import renaissanceModernity from './eras/renaissance_modernity.json';
import enlightenment from './eras/enlightenment.json';
import nineteenthCentury from './eras/nineteenth_century.json';
import turnOfCentury from './eras/turn_of_century.json';
import twentiethCentury from './eras/twentieth_century.json';
import contemporary from './eras/contemporary.json';

const thinkersData = {
  eras: [
    antiquity,
    renaissanceModernity,
    enlightenment,
    nineteenthCentury,
    turnOfCentury,
    twentiethCentury,
    contemporary,
  ],
} as const;

export default thinkersData;
