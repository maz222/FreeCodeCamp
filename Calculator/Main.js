class Calculator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {formula:[],display:"0"};
		this.clearDisplay = this.clearDisplay.bind(this);
		this.getCalc = this.getCalc.bind(this);
		this.addOperator = this.addOperator.bind(this);
		this.addDigit = this.addDigit.bind(this);
		this.parseInput = this.parseInput.bind(this);
	}
	render() {
		const formulaItems = this.state.formula.map((s) => 
			this.props.operators.has(s) ? <p className="op">{s}</p> : <p>{s}</p>
		);
		return(
			<div id="calculator">
				<div id="displayContainer">
					<div id="formula">{formulaItems}</div>
					<div id="display">{this.state.display}</div>
				</div>
				<hr></hr>
				<div id="buttonsContainer">
					<button type="button" id="clear" onClick={this.clearDisplay}>AC</button>
					<button type="button" id="divide" className="operationButton" onClick={() => {this.parseInput("/");}}>/</button>
					<button type="button" id="multiply" className="operationButton" onClick={() => {this.parseInput("*");}}>*</button>
					<button type="button" id="seven" className="numberButton" onClick={() => {this.parseInput("7");}}>7</button>
					<button type="button" id="eight" className="numberButton" onClick={() => {this.parseInput("8");}}>8</button>
					<button type="button" id="nine" className="numberButton" onClick={() => {this.parseInput("9");}}>9</button>
					<button type="button" id="subtract" className="operationButton" value="-" onClick={() => {this.parseInput("-");}}>-</button>
					<button type="button" id="four" className="numberButton" value="4" onClick={() => {this.parseInput("4");}}>4</button>
					<button type="button" id="five" className="numberButton" onClick={() => {this.parseInput("5");}}>5</button>
					<button type="button" id="six" className="numberButton" onClick={() => {this.parseInput("6");}}>6</button>
					<button type="button" id="add" className="operationButton" onClick={() => {this.parseInput("+");}}>+</button>
					<button type="button" id="one" className="numberButton" onClick={() => {this.parseInput("1");}}>1</button>
					<button type="button" id="two" className="numberButton" onClick={() => {this.parseInput("2");}}>2</button>
					<button type="button" id="three" className="numberButton" onClick={() => {this.parseInput("3");}}>3</button>
					<button type="button" id="equals" onClick={() => {this.parseInput("=");}}>=</button>
					<button type="button" id="zero" className="numberButton" onClick={() => {this.parseInput("0");}}>0</button>
					<button type="button" id="decimal" className="numberButton" onClick={() => {this.parseInput(".");}}>.</button>
				</div>
			</div>
		);
	}
	clearDisplay() {
		this.setState({formula:[], display:"0"});
	}
	addDigit(input) {
		//decimals
		if(input == ".") {
			//no previous numerical input; start a new decimal (0.X)
			if(this.state.display.length == 0 || this.props.operators.has(this.state.display)) {
				this.setState((prevState, props) => {
					return {
						formula: prevState.formula.concat(["0."]),
						display: "0."
					};
				});
			}
			else {
				//invalid - input already contains a decimal
				console.log(this.state);
				if(this.state.display.indexOf(input) != -1) {
					return;
				}
				else {
					this.setState((prevState, props) => {
						if(prevState.formula.length > 1 && prevState.formula[prevState.formula.length-2] == "=") {
							return {
								formula:["0."],
								display:"0."
							};
						}
						return {
							formula: prevState.formula.slice(0,prevState.formula.length-1).concat([prevState.display + input]),
							display: prevState.display + input
						};
					});
				}
			}
		}
		else {
			//invalid, no extraneous leading zeros ("0001")
			if(input == "0" && this.state.display == "0") {
				return;
			}
			else {
				if(this.state.display.length == 0 || this.props.operators.has(this.state.display)) {
					this.setState((prevState, props) => {
						return{ 
							formula: prevState.formula.concat([input]),
							display: input
						};
					});
				}
				else {
					this.setState((prevState, props) => {
						//if formula was previously calculated, start a new one
						if(prevState.formula.length > 1 && prevState.formula[prevState.formula.length-2] == "=") {
							return {
								formula: [input],
								display: input
							};
						}
						if(prevState.display == "0") {
							return {
								formula: prevState.formula.slice(0,prevState.formula.length-1).concat([input]),
								display: input
						}	;						
						}
						return {
							formula: prevState.formula.slice(0,prevState.formula.length-1).concat([prevState.display + input]),
							display: prevState.display + input
						};
					});
				}
			}
		}	
	}
	addOperator(input) {
		//invalid - no left variable ("+ 10" - no)
		if(this.state.formula.length == 0) {
			return;
		}
		//previous input was an operator; just swap the operators
		if(this.props.operators.has(this.state.formula[this.state.formula.length-1])) {
			this.setState((prevState, props) => {
				return {
					formula: prevState.formula.slice(0,this.state.formula.length-1).concat([input]),
					display: input
				};
			});
		}
		else {
			this.setState((prevState, props) => {
				var newFormula = null;
				//if the previous formula has been calculated (has a "="), 'reset' the formula to the answer and continue
				if(prevState.formula.length > 1 && prevState.formula[prevState.formula.length-2] == "=") {
					newFormula = [prevState.formula[prevState.formula.length-1]].concat([input]);
				}
				else {
					newFormula = prevState.formula.concat([input]);
				}
				return {
					formula: newFormula,
					display: input
				};
			});
		}	
	}
	getCalc() {
		//no input, just skip
		if(this.state.display.length == 0 && this.state.formula.length == 0) {
			return;
		}
		if(this.props.operators.has(this.state.display)) {
			this.setState((prevState,props) => {
				//const answer = calculate(prevState.formula.slice(0,prevState.formula.length-1));
				const answer = eval(prevState.formula.slice(0,prevState.formula.length-1).join(" ")).toString();;
				return {
					formula: prevState.formula.slice(0,prevState.formula.length-1).concat(["=",answer]),
					display: answer
				};
			});
		}
		else {
			this.setState((prevState, props) => {
				//const answer = calculate(prevState.formula.slice());
				const answer = eval(prevState.formula.slice().join(" ")).toString();
				return {
					formula: prevState.formula.concat(["=",answer]),
					display: answer
				};
			});
		}
		return;		
	}
	parseInput(input) {
		//calculate stuff
		if(input == "=") {
			this.getCalc();
			return;
		}
		//operator input
		if(this.props.operators.has(input)) {
			this.addOperator(input);
			return;
		}
		//number input
		else {
			this.addDigit(input);
			return;
		}
	}
}
Calculator.defaultProps = {
	operators: new Set(["-","+","*","/"]),

}
ReactDOM.render(<Calculator/>, document.getElementById('main'));