import { readFileSync } from "fs-extra";
declare type commandType = "C_ARITHMETIC" | "C_PUSH" | "C_POP" | "C_LABEL" | "C_GOTO" | "C_IF" | "C_FUNCTION" | "C_RETURN" | "C_CALL"

export class Translator {
  private inputFile: string;
  private buffLine: string[];
  private current = 0;
  private arithmeticSym = ["add","sub","neg","eq","gt","lt","and","or","not"];
  public codeWriter = new CodeWriter(); 

  constructor(path:string){
    this.inputFile = readFileSync(path, 'utf-8');
    this.buffLine = this.inputFile.split('\n');
  }

  start() {
    while (this.hasMoreLines()) {
      const ins = this.advance();
      if (ins.length === 0) break;
      const type = this.getCommandType(ins);
      if(type === "C_POP" || type === "C_PUSH"){
        this.codeWriter.writePushPop(ins);
      }else if(type === "C_ARITHMETIC"){
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

  getCommandType(opcode:string[]):commandType{
    const operate = opcode[0];

    if(this.arithmeticSym.includes(operate)){
      return "C_ARITHMETIC";
    }else if(operate === "push"){
      return "C_PUSH";
    }else if(operate === "pop"){
      return "C_POP";
    }else{
      throw new Error("");
    }
  }
 
  getArg1(opcode:string[]){
    const type =this.getCommandType(opcode);
    if(type === "C_ARITHMETIC"){
      return opcode[0];
    }else if(type === "C_POP" || type === "C_PUSH"){
      return opcode[1];
    }else{
      throw new Error("in getArg1");
    }
  }

  getArg2(opcode:string[]){
    const type =this.getCommandType(opcode);
    if(type === "C_POP" || type === "C_PUSH"){
      return Number.parseInt(opcode[2]);
    }else{
      throw new Error("in getArg2");
    }
  }
}

export class CodeWriter{
  public asmFile = ["@256","D=A","@SP","M=D",""];

  writeArithmetic(command:string[]){
    let asm:string[] = []
    if(command[0] === "add"){
      asm  = [`@SP`,"AM=M-1","D=M","@SP","A=M-1","M=D+M"]
    }else{
    }
    this.asmFile = this.asmFile.concat(asm).concat("");
  }

  writePushPop(command:string[]){
    let asm:string[] = []
    const num = Number.parseInt(command[2]);
    if(command[0] === "push"){
      switch(command[1]){
        case "constant":{
          asm  = [`@${num}`,"D=A","@SP","M=M+1","A=M-1","M=D"]  
        }
      }
    }
    this.asmFile = this.asmFile.concat(asm).concat("");
  }
}