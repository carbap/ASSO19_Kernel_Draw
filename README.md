# Kernel Draw

## Requirements:
- Instructions for creating, drawing and performing basic operations on geometric shapes
- User can type instructions in 3 different "cores"
- Instructions run asynchronously between cores
- Cores can wait for each other using the wait and signal instructions
- Instructions have a (fictional) time that they take to execute
- Interpret instructions and check for compilation errors
- Display errors to user
- Run each line of code step by step
- User sees changes each step
- Run all code at once
- Check if user generated figure matches the proposed image
- Check if the time to execute user code did not surpass the problem's time limit
- Advance to the next problem if the previous one was solved sucessfuly

## Dependencies

[Paper.js](http://paperjs.org/) was used to help with the drawing logic of geometric shapes.

## Architecture

### Architectural patterns:

<b>Model View Controller</b> (includes Observer and Mediator)

Used to separate logic, input and rendering.<br>
Observer is used when notifying the View that Model has changed.<br>
The Controller has the role of a Mediator, so the communication between Model and View is not direct.<br>

- Advantages:
    - High coesion inside modules and loose coupling between them.
    - We can render figures in multiple ways (SVG, HTMLCanvas, ...) just by adding more views.
    - Changes in the model's logic should not affect the way the controller and the rendering (view) works.

- Disadvantages:
    - Adding more layers of indirection.

### Design patterns:

#### Command
For encapsulating user's code as a command.

All implemented commands can be found in this [folder](proj/src/model/commands).

Every command has an associated shape and duration (the time to execute the instruction, mentioned earlier). It also has the model in which the command will be executed. This could be be useful to execute commands differently depending on the model.

#### Interpreter
Used to interpret user's commands.

The code related to interpreting commands can be found entirely in the [Expression](proj/src/model/interpreter/Expression.ts) class.

#### Iterator
To find the next instruction that should be run according to the times they take to execute.

The code related to this can be found in the [Kernel](proj/src/model/Kernel.ts) class.

#### Strategy
Allows having multiple geometric shapes sharing commom properties. Facilitates adding more shapes.

All implemented shapes can be found in this [folder](proj/src/model/shapes). All of them extend the Shape base class.

#### Factory Method
The [PaperFactory](proj/src/view/paperJS/PaperFactory.ts) facilitates the creation of [PaperShapes](proj/src/view/paperJS/paper_shapes) from a given Shape.
A [PaperShape](proj/src/view/paperJS/paper_shapes/PaperShape.ts) has a [Path](proj/dist/paperJS/dist/paper.d.ts), which is the Paper.js class that is responsible for actually drawing shapes.

#### Composite
To group shapes together (Intersection, Union). A group is still a shape and can be treated as such.

The [Intersection](proj/src/model/shapes/Intersection.ts) and [Union](proj/src/model/shapes/Union.ts) shapes have an array of shapes that constitute them. The shapes on this array are a clone of the ones that were used at the time of creating the group. Performing an operation over a group (Intersection or Union) only changes that group; the original shapes will be kept the same.

#### Null Object
The [Null Shape](proj/src/model/shapes/NullShape.ts) class was used for signal and wait commands because they dont act on a shape. However, the Command base class must always receive a Shape.

The [PaperEmpty](proj/src/view/paperJS/paper_shapes/PaperEmpty.ts) class was used because the [PaperFactory](proj/src/view/paperJS/PaperFactory.ts) can never return a 'null' object. That is, it always needs to return a valid [PaperShape](proj/src/view/paperJS/paper_shapes/PaperShape.ts) (the base class).

## Instructions:

The index.html page itself contains information about all the instructions available to the user, namely the arguments they take and the time associated to them.<br>
In this section we will provide some possible solutions for the presented problems, that could be used for testing:

### Problem 1:
```
create square s1 0 0 50
draw s1
create circle c1 25 25 25
draw c1
```

### Problem 2:

The drawings match, but unable to complete within the time limit (18s/15s):
```
create square s1 100 100 150
create square s2 300 100 150
create circle c1 275 175 25
draw s1
draw s2
draw c1
```

The drawings match and completed within time limit (15s/15s):
```
create square s1 100 100 150
draw s1
translate s1 200 0
draw s1
create circle c1 275 175 25
draw c1
```

Even better execution time using multiple cores (9s/15s):

<b>Core 1</b>
```
create square s1 100 100 150
draw s1
translate s1 200 0
draw s1
```
<b>Core 2</b>
```
create circle c1 275 175 25
draw c1
```

### Problem 3:
```
create triangle t1 100 100 400 100 100 450
create triangle t2 150 450 450 450 450 100
create square s1 200 200 150
create intersection inter1 s1 t1
create intersection inter2 s1 t2
draw s1
draw t1
draw t2
draw inter1
draw inter2
```
### Problem 4:

The drawings match, but unable to complete within the time limit (22s/20s):
```
create triangle t1 100 350 450 350 275 50
create circle c1 275 275 100
create circle c2 275 175 75
create intersection inter c1 c2
draw t1
draw inter
```

The drawings match and completed within time limit (16s/20s):

<b>Core 1</b>
```
create triangle t1 100 350 450 350 275 50
draw t1
```
<b>Core 2</b>
```
create circle c1 275 275 100
create circle c2 275 175 75
create intersection inter c1 c2
draw inter
```

## Run
Just open `/proj/index.html` on browser. Simple as that. If you're just trying out the application, there's no need to compile it first.

## Compile
1. Go to `/proj` directory.
2. Run `npm install` command, if you haven't installed node modules yet.
3. Run `npm start` command.
