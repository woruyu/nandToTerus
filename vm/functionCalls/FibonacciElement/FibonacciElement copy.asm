@256
D=A
@SP
M=D

@continuation_Sys.init_0
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
@SP
D=M
@5
D=D-A
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
// go handler Sys.init
@Sys.init
0;JMP
// label continuation_Sys.init_0
(continuation_Sys.init_0)

(Main.fibonacci)
@0
D=A
@ARG
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

@2
D=A
@SP
M=M+1
A=M-1
M=D

@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@TRUE_0
D;JLT
@FALSE_0
0;JMP
(TRUE_0)
@SP
A=M-1
M=-1
@CONTINUE_0
0;JMP
(FALSE_0)
@SP
A=M-1
M=0
(CONTINUE_0)

@SP
AM=M-1
D=M
@IF_TRUE
D;JNE
@IF_FALSE
0;JMP
(IF_TRUE)
@0
D=A
@ARG
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

@LCL
D=M
@R15
M=D
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
@R15
AM=M-1
A=M
0;JMP
(IF_FALSE)
@0
D=A
@ARG
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

@2
D=A
@SP
M=M+1
A=M-1
M=D

@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D

@Main.fibonacci$ret.0
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
(Main.fibonacci$ret.0)
@0
D=A
@ARG
A=M+D
D=M
@SP
M=M+1
A=M-1
M=D

@1
D=A
@SP
M=M+1
A=M-1
M=D

@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D

@Main.fibonacci$ret._1
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
(Main.fibonacci$ret._1)
@SP
AM=M-1
D=M
@SP
A=M-1
M=D+M

@SP
AM=M-1
D=M
@ARG
A=M
M=D
@LCL
D=M
@R15
M=D
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
@R15
AM=M-1
A=M
0;JMP
(Sys.init)
@4
D=A
@SP
M=M+1
A=M-1
M=D

@Main.fibonacci$ret._2
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
(Main.fibonacci$ret._2)
(WHILE)
@WHILE
0;JMP