import { error } from "node:console";
import { Assembly } from "./assembly/assembly";
import { writeFileSync } from "fs-extra";
import { Translator } from "./translator/translator";



assembly();
function assembly(){
  if (process.argv.length > 3) {
    throw error("avalible argv: --signalfile or --collectorfile");
  }
  const argv = process.argv[2];

  const parser = new Assembly(argv);
  parser.start();
  const resultString = parser.binaryCode.join('\n');
  const path = __dirname +'/../' +argv.split(".")[0] + ".hack";
  writeFileSync(path,resultString);
  return;
}

translator();
function translator(){
  if (process.argv.length > 3) {
    throw error("avalible argv: --signalfile or --collectorfile");
  }
  const argv = process.argv[2];

  const parser = new Translator(argv);
  parser.start();

  const resultString = parser.codeWriter.asmFile.join('\n');
  const path = __dirname +'/../' +argv.split(".")[0] + ".asm";
  writeFileSync(path,resultString);
}