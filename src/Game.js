import React from 'react';
import Grid from './Grid';
import './index.css';
import wall from './wall.png'

export default class Game extends React.Component{
    constructor(){
        super();
        this.state = {
            squares: initializeGrid(),
        }

    }

    handleClick(i){
        if(i !== 22 && i !== 77){
            if(this.state.squares[i].isWall){
                var setter = this.state.squares[i];
                setter.style = {background: "#FFF"};
                setter.isWall = false;
                this.setState({setter});
            }else{
                var setter = this.state.squares[i];
                setter.style = {backgroundImage : "url("+wall+")"};
                setter.isWall = true;
                this.setState({setter})

            }
        }
    }

    render(){
        return(
            <div className="game">
                <div className="rowa">
                    <div className="column">
                        <h1>Run Dijkstra's Algorithm</h1>
                        <div className="grid">
                            <Grid 
                                onClick={(i) => this.handleClick(i)}
                                squares={this.state.squares}
                            />
                        </div>
                    </div>
                    <div className="column">
                        <h2>Welcome! This React based project utilizes Dijkstra's Algorithm find the shortest path between the two points. Click in the squares to add walls.</h2>
                        <div className="row">
                            <div className="rowa">
                                <button 
                                    className={"squareLegend " + "lightSquare"}
                                    style={{backgroundColor: "FFFFFF"}}
                                ></button>
                                <p> Starting Point</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="rowa">
                                <button 
                                    className={"squareLegend " +"darkSquare"}
                                ></button>
                                <p> Ending Point</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="rowa">
                                <button 
                                    className={"squareLegend " +"wallSquare"}
                                ></button>
                                <p> Click to add barriers</p>
                            </div>
                        </div>
                        <button 
                            className="startButton"
                            onClick={(i)=> this.animateDijkstra()}
                            squares={this.state.squares}
                        >Start</button>
                        <button
                            className="startButton"
                            onClick={(i)=> window.location.reload()}
                        >Reset</button>
                    </div>
                </div>

            </div>
        )
    }

    animateDijkstra(){
        const orderedGrid = this.dijkstras(this.state.squares, 22, 77);
        const finalPath = this.getPath(orderedGrid, 77);
        for(var node = 0; node <orderedGrid.length; node++){
            var setter = this.state.squares[orderedGrid[node].id];
            setter.style = {background: "#0000FF"};
            this.setState({setter});
        }

        for(var node = 0; node <finalPath.length; node++){
            var setter = this.state.squares[finalPath[node].id];
            setter.style = {background: "#FFFF00"};
            this.setState({setter});
        }
    }

    getPath(grid, endNode){
        const path = [];
        var current = grid[grid.length - 1];
        while(current !== null){
            path.unshift(current);
            current = current.prevSquare;
        }
        return path;
    }

    dijkstras(grid, startNode, endNode){
        var orderedGrid = [];
        var starting = grid[startNode];
        starting.distance = 0;
        var unvisitedSquares = [];
        for(let x = 0; x < 100; x++){
                unvisitedSquares.push(grid[x]);
        }

        while(unvisitedSquares.length > 0){
            unvisitedSquares.sort((squareA, squareB) => squareA.distance - squareB.distance);
            var closestSquare = unvisitedSquares.shift();
            if(closestSquare.isWall === true){
                continue;
            }
            if(closestSquare.distance === Infinity){
                return orderedGrid;
            }
            closestSquare.visited = true;
            orderedGrid.push(closestSquare);
            if(unvisitedSquares[0].id === endNode){
                this.updateNeighbors(closestSquare, grid);
                unvisitedSquares.sort((squareA, squareB) => squareA.distance - squareB.distance);
                var closestSquare = unvisitedSquares.shift();
                closestSquare.visited = true;
                orderedGrid.push(closestSquare);
                return orderedGrid;
            }
            this.updateNeighbors(closestSquare, grid);
        }
    }

    updateNeighbors(square, grid){
        const neighbors = this.getNeighbors(square, grid);
        for(let neighbor = 0; neighbor < neighbors.length; neighbor++){
            grid[neighbors[neighbor].id].distance = square.distance +1;
            grid[neighbors[neighbor].id].prevSquare = square;
        }
    }

    getNeighbors(square, grid){
        const neighbors = [];
        if(square.id - 10 >= 0){
            neighbors.push(grid[square.id - 10]);
        }
        if(square.id +10 <100){
            neighbors.push(grid[square.id + 10]);
        }
        if((square.id + 1) % 10 !== 0){
            neighbors.push(grid[square.id + 1]);
        }
        if((square.id - 1) % 10 !== 9 && square.id > 0){
            neighbors.push(grid[square.id - 1]);
        }
        return neighbors.filter(neighbor => !neighbor.visited);
    }
}

class Start{
    constructor(id){
        this.style = {background: "#00FF00"}
        this.isWall = false;
        this.distance = Infinity;
        this.visited = false;
        this.prevSquare = null;
        this.id = id;
    }
}

class Finish{
    constructor(id){
        this.style = {background: "#FF0000"}
        this.isWall = false;
        this.distance = Infinity;
        this.visited = false;
        this.prevSquare = null;
        this.id = id;
    }
}

class Gap{
    constructor(id){
        this.style = {background: "#FFF"}
        this.isWall = false;
        this.distance = Infinity;
        this.visited = false;
        this.prevSquare = null;
        this.id = id;
    }
}

function initializeGrid(){
    const squares = Array(100).fill(null);
    for(let x = 0; x <100; x++){
        squares[x] = new Gap(x);
    }
    squares[22] = new Start(22);
    squares[77] = new Finish(77);
    return squares;
}