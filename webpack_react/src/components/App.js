import React, {Component} from "react";

const newFunc = (x)=> {
    return x.map((a)=> <span>{a}</span>)
};

class App extends Component {
    render(){
        return (
            <div>
                <h1>{newFunc(["hello", "hi"])}</h1>
                <p>Webpack + Babel</p>
            </div>
        )
    }
}

export default App;