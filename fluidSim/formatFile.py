#file = open("NoLoopsParallel.txt","r+")
#out = open("outNoLoopsParallel.txt","w")
#file = open("OneLoopParallel.txt","r+")
#out = open("outOneLoopParallel.txt","w")

file = open("TwoLoopsParallel.txt","r+")
out = open("outTwoLoopsParallel.txt","w")

fileLines = file.readlines()
for i in range(len(fileLines)):
    out.write(fileLines[i].split(" ")[0] + "\n")
