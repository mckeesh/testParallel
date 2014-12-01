file = open("ResolveConstraintsLoopTiming.txt","r+")
out = open("outResolveConstraints.txt","w")
fileLines = file.readlines()
for i in range(len(fileLines)):
    out.write(fileLines[i].split(" ")[0] + "\n")
