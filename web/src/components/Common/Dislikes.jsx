import React from "react";

class Dislikes extends React.Component{

state = {
dislikes: 0
}

handleClick = () => {
    this.setState({
    dislikes: this.state.dislikes + 1
    })
}

render(){
    return(
    <div>
        <button onClick={this.handleClick}> {this.state.dislikes} 👎</button>
    </div>
    )
}
}

export default Dislikes




