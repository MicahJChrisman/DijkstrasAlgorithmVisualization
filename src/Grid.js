import React from 'react';
import './index.css';

function Square(props){
    return(
        <button 
            className={"square "}
            onClick={props.onClick}
            style={props.style}
            key={props.key}
            isWall={props.isWall}
        ></button>
    );
}

export default class Grid extends React.Component{
    renderSquare(i){
        return <Square
            key={i}
            style={this.props.squares[i] ? this.props.squares[i].style : null}
            isWall={this.props.squares[i].isWall}
            onClick={() => this.props.onClick(i)}
        />
    }

    render(){
        const grid = []
        for(let x=0; x<10; x++){
            const rows = [];
            for( let y=0; y<10; y++){
               rows.push(this.renderSquare(x*10 + y));
            }
            grid.push(<div className="row" key={x}>{rows}</div>)
        }

        return(
            <div>
                {grid}
            </div>
        );
    }
}