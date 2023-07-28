import { ensureFileSync, lstatSync, readFileSync, readdirSync, writeFileSync } from "fs-extra";
import { basename, dirname, join } from "node:path";
declare type commandType = "C_ARITHMETIC" | "C_PUSH" | "C_POP" | "C_LABEL" | "C_GOTO" | "C_FUNCTION" | "C_RETURN" | "C_CALL" | "C_IFGOTO"

export class Translator {
  private path:string;
  private inputFile: string = "";
  private buffLine: string[] = [];
  private current = 0;
  private arithmeticSym = ["add", "sub", "neg", "eq", "gt", "lt", "and", "or", "not"];
  public codeWriter = new CodeWriter();

  constructor(path: string) {
    this.path = path;
  }

  _init(){
    this.inputFile = "";
    this.buffLine = [];
    this.current = 0;
  }

  start(){
    this.codeWriter.writeCall(["call","Sys.init","0"]);

    const stats = lstatSync(this.path);
    const parentDirectory = dirname(this.path);
    const lastName = basename(this.path);
    if(stats.isDirectory()){
      const files = readdirSync(this.path);
      for(const fileName of files){
        const filePath = join(this.path,fileName);
        this.codeWriter.fileName = fileName.split('.')[0];
        this._start(filePath);
      }
      this.end(join(this.path,lastName+'.asm'));
    }else if(stats.isFile()){
      this.codeWriter.fileName = lastName.split('.')[0];
      this._start(this.path);
      this.end(join(parentDirectory,lastName.split('.')[0]+'.asm'));
    }
  }

  end(path:string){
    const resultString = this.codeWriter.asmFile.join('\n');
    ensureFileSync(path);
    writeFileSync(path,resultString);
  }

  _start(filePath:string) {
    if(filePath.endsWith('.vm')){
      this._init();
    }else{
      return;
    }
    this.inputFile = readFileSync(filePath, 'utf-8');
    this.buffLine = this.inputFile.split('\n');
    while (this.hasMoreLines()) {
      const ins = this.advance();
      if (ins.length === 0) break;
      const instruction = "//" + ins.join(" ");
      if(instruction === "//pop static 1"){
        let a = 100;
      }
      this.codeWriter.asmFile.push(instruction);
      const type = this.getCommandType(ins);
      if (type === "C_POP" || type === "C_PUSH") {
        this.codeWriter.writePushPop(ins);
      } else if (type === "C_ARITHMETIC") {
        this.codeWriter.writeArithmetic(ins);
      } else if (type === 'C_LABEL'){
        this.codeWriter.writeLabel(ins);
      } else if(type === 'C_GOTO'){
        this.codeWriter.writeGoto(ins);
      } else if(type === 'C_IFGOTO'){
        this.codeWriter.writeIfGoto(ins);
      }else if(type === 'C_FUNCTION'){
        this.codeWriter.writeFunction(ins);
      }else if(type === 'C_CALL'){
        this.codeWriter.writeCall(ins);
      }else if(type === 'C_RETURN'){
        this.codeWriter.writeReturn();
      }
    }
  }

  advance(): string[] {
    while (this.hasMoreLines()) {
      const nextIns = this.getCurrentIns();
      this.current++;
      if (nextIns !== "" && !nextIns.startsWith("//")) {
        return nextIns.split(" ");
      }
    }
    return [];
  }

  getCurrentIns(): string {
    if (this.current < this.buffLine.length) {
      let ins = this.buffLine[this.current];
      if (ins.includes('//')) {
        ins = ins.split('//')[0];
      }
      return ins.trim();
    } else {
      return "EOF";
    }
  }

  hasMoreLines(): boolean {
    return this.current < this.buffLine.length;
  }

  getCommandType(opcode: string[]): commandType {
    const operate = opcode[0];

    if (this.arithmeticSym.includes(operate)) {
      return "C_ARITHMETIC";
    } else if (operate === "push") {
      return "C_PUSH";
    } else if (operate === "pop") {
      return "C_POP";
    } else if (operate === 'if-goto'){
      return 'C_IFGOTO';
    }else if (operate === 'label'){
      return "C_LABEL";
    }else if (operate === 'goto'){
      return 'C_GOTO';
    }else if (operate === 'function'){
      return 'C_FUNCTION';
    }else if (operate === 'call'){
      return 'C_CALL';
    }else if (operate === 'return'){
      return 'C_RETURN';
    } else {
      throw new Error("");
    }
  }
}

export class CodeWriter {
  public asmFile = ["@256", "D=A", "@SP", "M=D", ""];
  public uniqueSym = new Map<string, number>();
  public fileName: string = "";
  writeArithmetic(command: string[]) {
    let asm: string[] = []
    const op = command[0];
    switch (op) {
      case "add":
        asm = [`@SP`, "AM=M-1", "D=M", "@SP", "A=M-1", "M=D+M"];
        break;
      case "sub":
        asm = [`@SP`, "AM=M-1", "D=M", "@SP", "A=M-1", "M=M-D"];
        break;
      case "neg":
        asm = [`@SP`, "A=M-1", "M=-M"];
        break;
      case "eq":
      case "gt":
      case "lt":
        asm = this.genCompareCode(op);
        break;
      case "and":
        asm = [`@SP`, "AM=M-1", "D=M", "@SP", "A=M-1", "M=D&M"];
        break;
      case "or":
        asm = [`@SP`, "AM=M-1", "D=M", "@SP", "A=M-1", "M=D|M"];
        break;
      case "not":
        asm = [`@SP`, "A=M-1", "M=!M"];
        break;
      default:
        throw new Error("bad op");

    }
    this.asmFile = this.asmFile.concat(asm).concat("");
  }

  writePushPop(command: string[]) {
    let asm: string[] = []
    const num = Number.parseInt(command[2]);
    const inConstant = ["@SP", "M=M+1", "A=M-1", "M=D"];
    const outConstant = [`@SP`, "AM=M-1", "D=M",'@R13','A=M','M=D'];
    if (command[0] === "push") {
      switch (command[1]) {
        case "constant": {
          asm = [`@${num}`, "D=A", "@SP", "M=M+1", "A=M-1", "M=D"]
          break;
        }
        case "local": {
          asm = [`@${num}`, "D=A", "@LCL", "A=M+D", "D=M"].concat(inConstant);
          break;
        }
        case "argument": {
          asm = [`@${num}`, "D=A", "@ARG", "A=M+D", "D=M"].concat(inConstant);
          break;
        }
        case "this":{
          asm = [`@${num}`, "D=A", "@THIS", "A=M+D", "D=M"].concat(inConstant);
          break;
        }
        case "that":{
          asm = [`@${num}`, "D=A", "@THAT", "A=M+D", "D=M"].concat(inConstant);     
          break;
        }
        case "temp":{
          asm = [`@${num+5}`, "D=M"].concat(inConstant);  
          break;
        }
        case "static":{
          const staticName = `${this.fileName}.${num}`;
          asm = [`@${staticName}`, "D=M"].concat(inConstant);  
          break;
        }
        case "pointer":{
          asm = [`@${num+3}`, "D=M"].concat(inConstant);  
          break;
        }
      }
    }else if(command[0] === "pop"){
      switch (command[1]) {
        case "constant": {
          asm = [`@SP`, "AM=M-1", "D=M"];
          break;
        }
        case "local": {
          asm = [`@${num}`,'D=A','@LCL','D=D+M','@R13','M=D'].concat(outConstant);
          break;
        }
        case "argument": {
          asm = [`@${num}`,'D=A','@ARG','D=D+M','@R13','M=D'].concat(outConstant);
          break;
        }
        case "this":{
          asm = [`@${num}`,'D=A','@THIS','D=D+M','@R13','M=D'].concat(outConstant);
          break;
        }
        case "that":{
          asm = [`@${num}`,'D=A','@THAT','D=D+M','@R13','M=D'].concat(outConstant);
          break;
        }
        case "temp":{
          asm = [`@SP`, "AM=M-1", "D=M"].concat([`@${num+5}`,'M=D']);
          break;
        }
        case "static":{
          const staticName = `${this.fileName}.${num}`;
          asm = [`@SP`, "AM=M-1", "D=M"].concat([`@${staticName}`,'M=D']);
          break;
        }
        case "pointer":{
          asm = [`@SP`, "AM=M-1", "D=M"].concat([`@${num+3}`,'M=D']);
          break;
        }
      }
    }
    this.asmFile = this.asmFile.concat(asm).concat("");
  }

  writeFunction(command: string[]){
    this.asmFile = this.asmFile.concat(`(${command[1]})`)
    const localVar = Number.parseInt(command[2]);
    for(let i = 0; i<localVar;i++){
      this.asmFile = this.asmFile.concat("D=0", "@SP", "M=M+1", "A=M-1", "M=D")
    }
  }

  writeCall(command: string[]){
    //push address
    const label = this.getUniqueSym(`${command[1]}$ret.`);
    this.asmFile = this.asmFile.concat(`@${label}`, 'D=A',"@SP", "M=M+1", "A=M-1", "M=D");

    //push LCL
    this.asmFile = this.asmFile.concat(`@LCL`, 'D=M',"@SP", "M=M+1", "A=M-1", "M=D");
    this.asmFile = this.asmFile.concat(`@ARG`, 'D=M',"@SP", "M=M+1", "A=M-1", "M=D");
    this.asmFile = this.asmFile.concat(`@THIS`, 'D=M',"@SP", "M=M+1", "A=M-1", "M=D");
    this.asmFile = this.asmFile.concat(`@THAT`, 'D=M',"@SP", "M=M+1", "A=M-1", "M=D");

    const args = Number.parseInt(command[2]);
    //ARG = SP -5 -nArgs
    if(args === 0){
      this.asmFile = this.asmFile.concat(`@5`, 'D=A',"@SP", "D=M-D",'@ARG','M=D');
    }else{
      this.asmFile = this.asmFile.concat(`@5`, 'D=A',`@${command[2]}`, "D=D+A", "@SP", "D=M-D",'@ARG','M=D');
    }
    //LCL = SP
    this.asmFile = this.asmFile.concat(`@SP`, 'D=M',`@LCL`, "M=D");

    //goto f
    this.asmFile = this.asmFile.concat(`@${command[1]}`,"0;JMP");

    //return_address label
    this.asmFile = this.asmFile.concat(`(${label})`);
  }

  writeReturn(){
    //frame = LCL -- R15
    this.asmFile = this.asmFile.concat('@LCL','D=M','@R15','M=D');
    //ADDRESS -> *(FRAME-5)
    this.asmFile = this.asmFile.concat('@5','D=A','@R15','A=M-D','D=M','@R14','M=D');
    //*ARG = pop();
    this.asmFile = this.asmFile.concat([`@SP`, "AM=M-1", "D=M","@ARG", "A=M", "M=D"]);
    //SP = ARG+1
    this.asmFile = this.asmFile.concat("@ARG","D=M","@SP","M=D+1")
    //THAT -> *(FRAME-1)
    this.asmFile = this.asmFile.concat('@R15','AM=M-1','D=M','@THAT','M=D');
    //THIS -> *(FRAME-2)
    this.asmFile = this.asmFile.concat('@R15','AM=M-1','D=M','@THIS','M=D');
    //ARG -> *(FRAME-3)
    this.asmFile = this.asmFile.concat('@R15','AM=M-1','D=M','@ARG','M=D');
    //LCL -> *(FRAME-4)
    this.asmFile = this.asmFile.concat('@R15','AM=M-1','D=M','@LCL','M=D');

    //return
    this.asmFile = this.asmFile.concat('@R14','A=M','0;JMP');
  }

  writeLabel(command: string[]){
    this.asmFile = this.asmFile.concat(`(${command[1]})`);
  }

  writeGoto(command: string[]){
    this.asmFile = this.asmFile.concat(`@${command[1]}`,'0;JMP');
  }

  writeIfGoto(command: string[]){
    this.asmFile = this.asmFile.concat([`@SP`, "AM=M-1", "D=M", `@${command[1]}`,'D;JNE']);
  }

  genCompareCode(op: string) {
    //get arg1 arg2
    let asm = [`@SP`, "AM=M-1", "D=M", "@SP", "A=M-1"];
    const trueSym = this.getUniqueSym("TRUE_");
    const falseSym = this.getUniqueSym("FALSE_");
    const continueSym = this.getUniqueSym("CONTINUE_");

    if (op === "eq") {
      asm = asm.concat(["D=M-D", `@${trueSym}`, "D;JEQ"]);
    } else if (op === "gt") {
      asm = asm.concat(["D=M-D", `@${trueSym}`, "D;JGT"]);
    } else if (op === "lt") {
      asm = asm.concat(["D=M-D", `@${trueSym}`, "D;JLT"]);
    }

    //true block
    asm = asm.concat([`@${falseSym}`, "0;JMP", `(${trueSym})`, '@SP', 'A=M-1', 'M=-1', `@${continueSym}`, '0;JMP']);

    //false block
    asm = asm.concat([`(${falseSym})`, '@SP', 'A=M-1', 'M=0']);

    //continue block
    asm = asm.concat([`(${continueSym})`])

    return asm;
  }

  getUniqueSym(sym: string): string {
    let num = this.uniqueSym.get(sym);
    if (num) {
      this.uniqueSym.set(sym, num + 1);
      return `${sym}${num}`;
    } else {
      num = 0;
      this.uniqueSym.set(sym, num + 1);
      return `${sym}${num}`;
    }
  }
}