import { readFileSync } from "fs-extra";
declare type instructionType = "A_INSTRUCTION" | "C_INSTRUCTION" | "L_INSTRUCTION";



export class Assembly {
  private inputFile: string;
  private buffLine: string[];
  private current = 0;
  public binaryCode = new Array<string>();
  private table = new Map<string, number>();
  private address = 16;
  private line = -1;

  constructor(path: string) {
    this.current = 0;
    this.inputFile = readFileSync(path, 'utf-8');
    this.buffLine = this.inputFile.split('\n');

  }

  initializerLOOP() {
    while (this.hasMoreLines()) {
      const ins = this.advance();
      const type = this.instructionType(ins);
      if (type !== "L_INSTRUCTION") {
        this.line++;
      } else {
        const sym = ins.slice(1, -1);
        this.table.set(sym, this.line + 1);
      }
    }
    this.current = 0;
  }

  initializerVAR() {
    this.table.set("R0", 0);
    this.table.set("R1", 1);
    this.table.set("R2", 2);
    this.table.set("R3", 3);
    this.table.set("R4", 4);
    this.table.set("R5", 5);
    this.table.set("R6", 6);
    this.table.set("R7", 7);
    this.table.set("R8", 8);
    this.table.set("R9", 9);
    this.table.set("R10", 10);
    this.table.set("R11", 11);
    this.table.set("R12", 12);
    this.table.set("R13", 13);
    this.table.set("R14", 14);
    this.table.set("R15", 15);

    this.table.set("SP", 0);
    this.table.set("LCL", 1);
    this.table.set("ARG", 2);
    this.table.set("THIS", 3);
    this.table.set("THAT", 4);
    this.table.set("SCREEN", 16384);
    this.table.set("KBD", 24576);

    while (this.hasMoreLines()) {
      const ins = this.advance();
      const type = this.instructionType(ins);
      if (type === "A_INSTRUCTION") {
        const symOrNum = ins.slice(1);
        if (symOrNum === 'ponggame.0') {
          let a = 100;
        }
        if (isNaN(Number(symOrNum))) {
          //sym
          if (!this.table.has(symOrNum)) {
            this.table.set(symOrNum, this.address++);
          }
        }
      }

    }
    this.current = 0;
  }

  start() {
    this.initializerLOOP();
    this.initializerVAR();
    while (this.hasMoreLines()) {
      let binary = "";
      const ins = this.advance();
      if (ins === "EOF") break;
      const type = this.instructionType(ins);
      //0xx or 111
      if (type === "A_INSTRUCTION") {
        binary = "0"
      } else if (type === "C_INSTRUCTION") {
        binary = "111";
      } else {
        continue;
      }

      binary += this.compute(ins);
      this.binaryCode.push(binary);
    }
  }

  getCurrentIns(): string {
    if (this.current < this.buffLine.length) {
      let ins = this.buffLine[this.current];
      if (ins.includes('//')) {
        ins = ins.split('//')[0];
      }
      return ins.trim().replace(/\s+/g, '');
    } else {
      return "EOF";
    }
  }

  hasMoreLines(): boolean {
    return this.current < this.buffLine.length;
  }

  advance(): string {
    while (this.hasMoreLines()) {
      const nextIns = this.getCurrentIns();
      this.current++;
      if (nextIns !== "" && !nextIns.startsWith("//")) {
        return nextIns
      }
    }
    return "EOF";
  }

  instructionType(currentIns: string): instructionType {
    if (currentIns.startsWith('@')) {
      return "A_INSTRUCTION";
    } else if (currentIns.startsWith('(') && currentIns.endsWith(')')) {
      return "L_INSTRUCTION";
    } else {
      return "C_INSTRUCTION";
    }
  }

  symbol(type: instructionType): string {
    if (type === "L_INSTRUCTION") {
      return this.getCurrentIns().slice(1, -1);
    } else if (type === "A_INSTRUCTION") {
      return this.getCurrentIns().slice(1);
    } else {
      throw new Error("C_INSTRUCTION in symbol function");
    }
  }

  dest(currentIns: string): string {
    let dest = [0, 0, 0];
    if (currentIns.includes('=')) {
      const leftCurrentIns = currentIns.split('=')[0];
      if (leftCurrentIns.includes('M')) {
        dest[2] = 1;
      }
      if (leftCurrentIns.includes('D')) {
        dest[1] = 1;
      }
      if (leftCurrentIns.includes('A')) {
        dest[0] = 1;
      }
      return dest.join("");
    } else if (currentIns.includes(';')) {
      return "000";
    } else {
      throw new Error("L_INSTRUCTION,A_INSTRUCTION in symbol function");
    }
  }

  comp(currentIns: string): string {
    let rightCurrentIns = "";
    if (currentIns.includes('=')) {
      rightCurrentIns = currentIns.split('=')[1];
    } else if (currentIns.includes(';')) {
      rightCurrentIns = currentIns.split(';')[0];
    } else {
      throw new Error("rightCurrentIns error in comp funciton")
    }
    switch (rightCurrentIns) {
      case '0':
        return '0101010';
      case '1':
        return '0111111';
      case '-1':
        return '0111010';
      case 'D':
        return '0001100';
      case 'A':
        return '0110000';
      case 'M':
        return '1110000';
      case '!D':
        return '0001101';
      case '!A':
        return '0110011';
      case '!M':
        return '1110001';
      case '-D':
        return '0001111';
      case '-A':
        return '0110011';
      case '-M':
        return '1110011';
      case 'D+1':
      case '1+D':
        return '0011111';
      case 'A+1':
      case '1+A':
        return '0110111';
      case 'M+1':
      case '1+M':
        return '1110111';
      case 'D-1':
        return '0001110';
      case 'A-1':
        return '0110010';
      case 'M-1':
        return '1110010';
      case 'D+A':
      case 'A+D':
        return '0000010';
      case 'D+M':
      case 'M+D':
        return '1000010';
      case 'D-A':
        return '0010011';
      case 'D-M':
        return '1010011';
      case 'A-D':
        return '0000111';
      case 'M-D':
        return '1000111';
      case 'D&A':
      case 'A&D':
        return '0000000';
      case 'D&M':
      case 'M&D':
        return '1000000';
      case 'D|A':
      case 'A|D':
        return '0010101';
      case 'D|M':
      case 'M|D':
        return '1010101';
      default:
        throw new Error("rightCurrentIns error in comp funciton")
    }
  }

  jump(currentIns: string): string {
    if (currentIns.includes(';')) {
      const rightJumpIns = currentIns.split(';')[1];
      switch (rightJumpIns) {
        case 'JMP':
          return '111';
        case 'JGT':
          return '001';
        case 'JEQ':
          return '010';
        case 'JGE':
          return '011';
        case 'JLT':
          return '100';
        case 'JNE':
          return '101';
        case 'JLE':
          return '110';
        default:
          throw new Error("jump");
      }
    } else {
      return '000';
    }
  }

  compute(ins: string) {
    switch (this.instructionType(ins)) {
      case "A_INSTRUCTION":
        const symOrNum = ins.slice(1);
        let num = 0;
        if (isNaN(Number(symOrNum))) {
          //sym
          num = this.table.get(symOrNum) as number;
        } else {
          num = parseInt(symOrNum, 10);
        }
        let binaryStr = num.toString(2);
        while (binaryStr.length < 15) {
          binaryStr = '0' + binaryStr;
        }
        return binaryStr;
      case "C_INSTRUCTION":
        const compIns = this.comp(ins);
        const dddIns = this.dest(ins);
        const jumpIns = this.jump(ins);
        return compIns + dddIns + jumpIns;
      default:
        throw new Error("compute funciton");

    }
  }

  isLoop(str: string) {
    const firstLetter = str.charAt(0);
    return /[A-Z]/.test(firstLetter);
  }


}