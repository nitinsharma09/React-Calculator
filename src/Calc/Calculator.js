import React , {Component} from 'react';
import './style.css';
import Value from './Value.js';

class Calculator extends Component{
	constructor(props)
	{
		super(props);
		let values=[
			[7,8,9,'<-','ce'],
			[4,5,6,'+','-'],
			[1,2,3,'*','/'],
			['.',0,'(',')','=']
		];
		let expr = [];
		this.state={
			values : values,
			expr : expr,
			answer : 0,
			number:'',
			last : '',
		};
		this.getButton = this.getButton.bind(this);
		this.handleValue = this.handleValue.bind(this);
		this.evaluateExpression = this.evaluateExpression.bind(this);
		this.hasPrecedence = this.hasPrecedence.bind(this);
		this.applyOp = this.applyOp.bind(this);
	}

	handleValue(i){
		if(i === '=')
		{
			this.evaluateExpression();
		}
		else if(i === 'ce')
		{
			this.setState({expr : [] , answer:0});
		}
		else if(i === '<-')
		{
			let arr = this.state.expr;
			if(this.state.answer!='')
				this.setState({answer:''});
			if(arr.length!==0)
			{
				arr.pop();
			}
			this.setState({expr:arr});
		}
		else if((i>=0 && i<=9) || i == '.') 
		{
			if(this.state.answer==='')
				this.setState({answer:''});
			let arr = this.state.expr;
			arr.push(i);
			this.setState({expr : arr});
		}
		else if((i === '+') || (i === '-') || (i === '/') || (i === '*') || (i === '(') || (i ===')'))
		{
			let arr = this.state.expr;
			if(this.state.answer!=='')
				arr.push(parseFloat(this.state.answer));
			arr.push(i);
			this.setState({expr : arr});
		}
	}

	evaluateExpression()
	{
		var expr = this.state.expr;
		var stackInt = [];
		var stackOps = [];
		var flag = 0;
		console.log('expr ' + expr);
		for(let i = 0 ; i < expr.length ; i++)
		{
			console.log(expr[i] + ' ');
			if((expr[i]>=0 && expr[i]<=9) || expr[i]=='.')
			{
				console.log("Pushing in staclInt " + stackInt);
				let a = "";
				while (i < expr.length && (expr[i] >= 0 && expr[i] <= 9) || expr[i]=='.') 
                {
                	a = a + expr[i];
                	console.log("Pushing in stackInt " + stackInt);
                	i = i + 1;
                	flag = 1;
                }
                if(flag === 1)
                {
                	i--;
                	flag = 0;
                }
                stackInt.push(parseFloat(a));
			}
            else if(expr[i] === '(')
            	stackOps.push(expr[i]);
            else if(expr[i] === ')')
            {
            	let len = stackOps.length-1;
            	while(len > -1 && stackOps[len] !== '(')
            	{
            		stackInt.push(this.applyOp(stackOps.pop(),stackInt.pop(),stackInt.pop()));
            		len = len-1;
            	}
            	stackOps.pop();
            }
            else if (expr[i] === '+' || expr[i] === '-' || expr[i] === '*' || expr[i] === '/')
            {
            	let len = stackOps.length-1;
                while (len > -1 && this.hasPrecedence(expr[i], stackOps[len]) && stackInt.length >= 2)
                {
                	len = len - 1;
                	stackInt.push(this.applyOp(stackOps.pop(), stackInt.pop(), stackInt.pop()));
                }
                console.log("Pushing i " + expr[i]);
                stackOps.push(expr[i]);
            }
            else
            {
            	stackInt.push(expr[i]);
            }
            console.log("Stack op" + stackOps);
            console.log("Stack Int " + stackInt);
            
		}
		var lenops = stackOps.length-1;
		while (lenops>-1)
        {
        	let t = this.applyOp(stackOps.pop(), stackInt.pop(), stackInt.pop());
       		console.log("Ans = " + t);
        	stackInt.push(t);
        	lenops = lenops - 1;
        }
        console.log("Hello World");
        let a = 0;
        if(stackInt.length!==0)
        {
        	a = stackInt.pop();
        }
        console.log("a = " + a);
        console.log("StackInt =  " + stackInt);
        this.setState({answer:a,expr:[]});
	}

	applyOp(op , a , b)
	{
		let t = b;
		b = a;
		a = t;
		if(op === '/')
		{
			if(a < b)
			{
				let temp = a;
				a = b;
				b = temp;
			}
		}
		console.log(op + ' ' + a + b);
		switch(op)
		{
			case '+':
				console.log(a+b);
				return a + b
			case '-':
				console.log(a-b);
				return a - b
			case '*':
				return a * b
			case '/':
				if(b === 0)
					return 0;
				else
					return a/b;
			default:
				return 0;
		}
	}

	hasPrecedence(a , b)
	{
		if(a === ')' || b === ')')
		{
			return false;
		}
		if ((a === '*' || a === '/') && (b === '+' || b === '-'))
            return false;
        return true;
	}	

	getButton(data)
	{
		let button = <Value data={data} handleValue={this.handleValue} />
		return button;
	}

	show()
	{
		let arr = this.state.expr;
		let answer = this.state.answer;
		if(arr.length===0)
			return answer;
		else
		{
			let a = "";
			for(let i = 0 ; i < arr.length ; i++)
			{
				a = a + arr[i];
			}
			return a;
		}
	}

	render(){
		let row = [];
		let values = this.state.values;
		for(let i = 0 ; i < 4 ; i++)
		{
			let one = [];
			for(let j = 0 ; j < 5 ; j++)
			{
				let temp = this.getButton(values[i][j]);
				one.push(temp);
			}
			row.push(one);
		}
		return(
			<div className="block">
				<div className="text-answer">
					<input type="text" value={this.show()} className="answer" />
				</div>
				<div className="row">
					{row}
				</div>
			</div>
		);
	}
}

export default Calculator;