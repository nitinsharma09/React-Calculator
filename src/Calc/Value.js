import React , {Component} from 'react';
import './style.css';

class Value extends Component{
	constructor(props)
	{
		super(props);
		this.handle = this.handle.bind(this);
	}

	handle(){
		this.props.handleValue(this.props.data);
	}

	render(){
		return(
			<div className="value">
				<button className="button" onClick={this.handle}>{this.props.data}</button>
			</div>
		);
	}
}

export default Value;