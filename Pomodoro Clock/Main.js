class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {currentTime:props.defaultSession, currentSession:props.defaultSession, currentBreak:props.defaultBreak, paused:true, onBreak:false, timer:null};
		this.increaseBreak = this.increaseBreak.bind(this);
		this.decreaseBreak = this.decreaseBreak.bind(this);
		this.increaseSession = this.increaseSession.bind(this);
		this.decreaseSession = this.decreaseSession.bind(this);
		this.tick = this.tick.bind(this)
	}
	render() {
		return(
			<div id="content">
				<audio id="beep" preload="auto" src="http://www.peter-weinberg.com/files/1014/8073/6015/BeepSound.wav"></audio>
				<div id="title"><h1>Pomodoro Clock</h1></div>
				<div id="clock-container">
					<div className="row" id="main-row">
						<div className="panel panel-dark" id="break-panel">
							<h4 id="break-label">Break Length</h4>
							<div className="panel-buttons">
								<button type="button" id="break-increment" onClick={this.increaseBreak}><i class="fas fa-arrow-up"></i></button>
								<p id="break-length">{this.state.currentBreak/60}</p>
								<button type="button" id="break-decrement" onClick={this.decreaseBreak}><i class="fas fa-arrow-down"></i></button>
							</div>
						</div>
						<div className="panel panel-light" id="timer-panel">
							<h2 id="timer-label">{this.state.onBreak ? "Break" : "Session"}</h2>
							<h3 id="time-left">{this.formatTime(this.state.currentTime)}</h3>
						</div>
						<div className="panel panel-dark" id="session-panel">
							<h4 id="session-label">Session Length</h4>
							<div className="panel-buttons">
								<button type="button" id="session-increment" onClick={this.increaseSession}><i class="fas fa-arrow-up"></i></button>
								<p id="session-length">{this.state.currentSession/60}</p>
								<button type="button" id="session-decrement" onClick={this.decreaseSession}><i class="fas fa-arrow-down"></i></button>
							</div>
						</div>
					</div>
					<div className="row" id="bottom-row">
						<button type="button" id="start_stop" onClick={() => {
							this.setState({paused:!this.state.paused});
							if(this.state.paused) {
								this.setState({timer:setInterval(this.tick, 1000)});
							}
							else {
								clearInterval(this.state.timer);
								this.setState({timer:null});
							}
						}}>{this.state.paused ? <i class="fas fa-play"></i> : <i class="fas fa-pause"></i>}</button>
						<button type="button" id="reset" onClick={() => {
							const beep = document.getElementById("beep");
							beep.pause();
							beep.load();
							this.setState({currentSession:this.props.defaultSession});
							this.setState({currentBreak:this.props.defaultBreak});
							this.setState({currentTime:this.props.defaultSession});
							this.setState({onBreak:false});
							this.setState({paused:true});
							clearInterval(this.state.timer);
							this.setState({timer:null});
						}}><i class="fas fa-sync-alt"></i></button>
					</div>
				</div>
			</div>
		);
	}
	tick() {
		this.setState({currentTime:this.state.currentTime-1},() => {
			if(this.state.currentTime == 0) {
				const beep = document.getElementById("beep");
				beep.volume = 0;
				beep.play();
			}
			if(this.state.currentTime < 0) {
				this.setState({onBreak:!this.state.onBreak});		
				this.state.onBreak ? this.setState({currentTime:this.state.currentSession}) : this.setState({currentTime:this.state.currentBreak}); 
			}
		});
	}
	formatTime(time) {
		function pad(i) {
			while(i.length < 2) {i = "0" + i};
			return i;
		}
		left = pad((parseInt(time/60)).toString());
		right = pad((time%60).toString());
		return (left + ":" + right);
	}
	increaseBreak() {
		if(this.state.currentBreak < this.props.maxBreak) {
			this.setState({currentBreak:this.state.currentBreak+this.props.timeIncrement},
				() => {if(this.state.onBreak) {this.setState({currentTime:this.state.currentBreak});}});
		}
		else{
			console.log("too big!");
		}
	}
	decreaseBreak() {
		if(this.state.currentBreak > this.props.minBreak) {
			this.setState({currentBreak:this.state.currentBreak-this.props.timeIncrement},
				() => {if(this.state.onBreak) {this.setState({currentTime:this.state.currentBreak});}});	
		} 
		else {
			console.log("too small!");
		}
	}
	increaseSession() {
		if(this.state.currentSession < this.props.maxSession) {
			this.setState({currentSession:this.state.currentSession+this.props.timeIncrement},
				() => {if(!this.state.onBreak) {this.setState({currentTime:this.state.currentSession});}});
		}
		else{
			console.log("too big!");
		}	
	}
	decreaseSession() {
		if(this.state.currentSession > this.props.minSession) {
			this.setState({currentSession:this.state.currentSession-this.props.timeIncrement},
				() => {if(!this.state.onBreak) {this.setState({currentTime:this.state.currentSession});}});
		}
		else{
			console.log("too small!");
		}
	}
}
Clock.defaultProps = {
	maxBreak: 60 * 60,
	maxSession: 60 * 60,
	minBreak: 60,
	minSession: 60,
	timeIncrement: 60,
	defaultBreak: 60 * 5,
	defaultSession: 60 * 25
}
ReactDOM.render(<Clock/>, document.getElementById('main'));