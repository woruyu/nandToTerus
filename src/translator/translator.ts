import { readFileSync } from "fs-extra";
declare type commandType = "C_ARITHMETIC" | "C_PUSH" | "C_POP" | "C_LABEL" | "C_GOTO" | "C_IF" | "C_FUNCTION" | "C_RETURN" | "C_CALL"

export class Translator {
  private inputFile: string;
  private buffLine: string[];
  private current = 0;
  private arithmeticSym = ["add", "sub", "neg", "eq", "gt", "lt", "and", "or", "not"];
  public codeWriter = new CodeWriter();

  constructor(path: string) {
    this.inputFile = readFileSync(path, 'utf-8');
    this.buffLine = this.inputFile.split('\n');
  }

  start() {
    while (this.hasMoreLines()) {
      const ins = this.advance();
      if (ins.length === 0) break;
      const type = this.getCommandType(ins);
      if (type === "C_POP" || type === "C_PUSH") {
        this.codeWriter.writePushPop(ins);
      } else if (type === "C_ARITHMETIC") {
        this.codeWriter.writeArithmetic(ins);
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
    } else {
      throw new Error("");
    }
  }

  getArg1(opcode: string[]) {
    const type = this.getCommandType(opcode);
    if (type === "C_ARITHMETIC") {
      return opcode[0];
    } else if (type === "C_POP" || type === "C_PUSH") {
      return opcode[1];
    } else {
      throw new Error("in getArg1");
    }
  }

  getArg2(opcode: string[]) {
    const type = this.getCommandType(opcode);
    if (type === "C_POP" || type === "C_PUSH") {
      return Number.parseInt(opcode[2]);
    } else {
      throw new Error("in getArg2");
    }
  }
}

export class CodeWriter {
  public asmFile = ["@256", "D=A", "@SP", "M=D", ""];
  private uniqueSym = new Map<string, number>();

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

  genCompareCode(op: string) {
    //get arg1 arg2
    let asm = [`@SP`, "AM=M-1", "D=M", "@SP", "A=M-1"];
    const trueSym = this.getUniqueSym("TRUE");
    const falseSym = this.getUniqueSym("FALSE");
    const continueSym = this.getUniqueSym("CONTINUE");

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
          const staticName = `static_${num}`;
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
        }
        case "static":{
          const staticName = `static_${num}`;
          asm = [`@SP`, "AM=M-1", "D=M"].concat([`@${staticName}`,'M=D']);
        }
        case "pointer":{
          asm = [`@SP`, "AM=M-1", "D=M"].concat([`@${num+3}`,'M=D']);
        }
      }
    }
    this.asmFile = this.asmFile.concat(asm).concat("");
  }

  getUniqueSym(sym: string): string {
    let num = this.uniqueSym.get(sym);
    if (num) {
      this.uniqueSym.set(sym, num + 1);
      return `${sym}_${num}`;
    } else {
      num = 0;
      this.uniqueSym.set(sym, num + 1);
      return `${sym}_${num}`;
    }
  }
}