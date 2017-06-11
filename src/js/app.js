import $ from 'jquery';
import { add3 } from './module/subModule1';

const x = 1;

// Example of jquery
$('h1').css('color', 'blue');

console.log(x + add3(21));
