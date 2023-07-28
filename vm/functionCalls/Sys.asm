@256
D=A
@SP
M=D

@Sys.init$ret.0
D=A
@SP
M=M+1
A=M-1
M=D
@LCL
D=M
@SP
M=M+1
A=M-1
M=D
@ARG
D=M
@SP
M=M+1
A=M-1
M=D
@THIS
D=M
@SP
M=M+1
A=M-1
M=D
@THAT
D=M
@SP
M=M+1
A=M-1
M=D
@5
D=A
@SP
D=M-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
(Sys.init$ret.0)
//function Sys.init 0
(Sys.init)
//push constant 4000
@4000
D=A
@SP
M=M+1
A=M-1
M=D

//pop pointer 0
@SP
AM=M-1
D=M
@3
M=D

//push constant 5000
@5000
D=A
@SP
M=M+1
A=M-1
M=D

//pop pointer 1
@SP
AM=M-1
D=M
@4
M=D

//call Sys.main 0
@Sys.main$ret.0
D=A
@SP
M=M+1
A=M-1
M=D
@LCL
D=M
@SP
M=M+1
A=M-1
M=D
@ARG
D=M
@SP
M=M+1
A=M-1
M=D
@THIS
D=M
@SP
M=M+1
A=M-1
M=D
@THAT
D=M
@SP
M=M+1
A=M-1
M=D
@5
D=A
@SP
D=M-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.main
0;JMP
(Sys.main$ret.0)
//pop temp 1
@SP
AM=M-1
D=M
@6
M=D

//label LOOP
(LOOP)
//goto LOOP
@LOOP
0;JMP
//function Sys.main 5
(Sys.main)
D=0
@SP
M=M+1
A=M-1
M=D
D=0
@SP
M=M+1
A=M-1
M=D
D=0
@SP
M=M+1
A=M-1
M=D
D=0
@SP
M=M+1
A=M-1
M=D
D=0
@SP
M=M+1
A=M-1
M=D
//push constant 4001
@4001
D=A
@SP
M=M+1
A=M-1
M=D

//pop pointer 0
@SP
AM=M-1
D=M
@3
M=D

//push constant 5001
@5001
D=A
@SP
M=M+1
A=M-1
M=D

//pop pointer 1
@SP
AM=M-1
D=M
@4
M=D

//push constant 200
@200
D=A
@SP
M=M+1
A=M-1
M=D

//pop local 1
@1
D=A
@LCL
D=D+M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D

//push constant 40
@40
D=A
@SP
M=M+1
A=M-1
M=D

//pop local 2
@2
D=A
@LCL
D=D+M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D

//push constant 6
@6
D=A
@SP
M=M+1
A=M-1
M=D

//pop local 3
@3
D=A
@LCL
D=D+M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D

//push constant 123
@123
D=A
@SP
M=M+1
A=M-1
M=D

//call Sys.add12 1
@Sys.add12$ret.0
D=A
@SP
M=M+1
A=M-1
M=D
@LCL
D=M
@SP
M=M+1
A=M-1
M=D
@ARG
D=M
@SP
M=M+1
A=M-1
M=D
@THIS
D=M
@SP
M=M+1
A=M-1
M=D
@THAT
D=M
@SP
M=M+1
A=M-1
M=D
@5
D=A
@1
D=D+A
@SP
D=M-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.add12
0;JMP
(Sys.add12$ret.0)
//pop temp 0
@SP
AM=M-1
D=M
@5
M=D

//push local 0
@0
D=A
@LCL
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

//push local 1
@1
D=A
@LCL
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

//push local 2
@2
D=A
@LCL
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

//push local 3
@3
D=A
@LCL
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

//push local 4
@4
D=A
@LCL
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

//add
@SP
AM=M-1
D=M
@SP
A=M-1
M=D+M

//add
@SP
AM=M-1
D=M
@SP
A=M-1
M=D+M

//add
@SP
AM=M-1
D=M
@SP
A=M-1
M=D+M

//add
@SP
AM=M-1
D=M
@SP
A=M-1
M=D+M

//return
@LCL
D=M
@R15
M=D
@5
D=A
@R15
A=M-D
D=M
@R14
M=D
@SP
AM=M-1
D=M
@ARG
A=M
M=D
@ARG
D=M
@SP
M=D+1
@R15
AM=M-1
D=M
@THAT
M=D
@R15
AM=M-1
D=M
@THIS
M=D
@R15
AM=M-1
D=M
@ARG
M=D
@R15
AM=M-1
D=M
@LCL
M=D
@R14
A=M
0;JMP
//function Sys.add12 0
(Sys.add12)
//push constant 4002
@4002
D=A
@SP
M=M+1
A=M-1
M=D

//pop pointer 0
@SP
AM=M-1
D=M
@3
M=D

//push constant 5002
@5002
D=A
@SP
M=M+1
A=M-1
M=D

//pop pointer 1
@SP
AM=M-1
D=M
@4
M=D

//push argument 0
@0
D=A
@ARG
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

//push constant 12
@12
D=A
@SP
M=M+1
A=M-1
M=D

//add
@SP
AM=M-1
D=M
@SP
A=M-1
M=D+M

//return
@LCL
D=M
@R15
M=D
@5
D=A
@R15
A=M-D
D=M
@R14
M=D
@SP
AM=M-1
D=M
@ARG
A=M
M=D
@ARG
D=M
@SP
M=D+1
@R15
AM=M-1
D=M
@THAT
M=D
@R15
AM=M-1
D=M
@THIS
M=D
@R15
AM=M-1
D=M
@ARG
M=D
@R15
AM=M-1
D=M
@LCL
M=D
@R14
A=M
0;JMP